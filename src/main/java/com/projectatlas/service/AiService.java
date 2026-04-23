package com.projectatlas.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectatlas.dto.SearchFilterDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${AI_API_KEY:}")
    private String apiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=";

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    public SearchFilterDTO parseQueryWithAi(String query) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("AI_API_KEY is not set. Falling back to manual search parsing.");
            return null;
        }

        log.info("Attempting AI parsing for query: {}", query);

        String prompt = String.format(
            "You are a project search assistant for ProjectAtlas. Parse the following user query into a clean JSON object. " +
            "CRITICAL: Only include fields that are EXPLICITLY mentioned or STRONGLY implied by the user. Do not guess or use defaults. " +
            "Valid values for 'difficulty' are: BEGINNER, INTERMEDIATE, ADVANCED. " +
            "Valid values for 'category' are: FULL_STACK, BACKEND, DATA_ENGINEERING, DEVOPS, MICROSERVICES, API_SERVICE, TOOL_UTILITY, LEARNING_PROJECT. " +
            "JSON structure: { \"keyword\": string, \"difficulty\": string, \"category\": string, \"techStack\": string, \"minImpactScore\": integer(1-10), \"isTrending\": boolean } " +
            "User query: \"%s\"", query
        );

        try {
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", prompt)
                    ))
                )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            String url = GEMINI_API_URL + apiKey;

            log.info("Calling Gemini API at: {}", url.replaceAll("key=.*", "key=REDACTED"));
            System.out.println("DEBUG: Calling Gemini API for parseQueryWithAi");
            Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);
            log.info("Gemini API raw response: {}", response);
            System.out.println("DEBUG: Gemini API raw response: " + response);

            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> firstCandidate = candidates.get(0);
                    Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");
                    if (content != null && content.containsKey("parts")) {
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            String aiResponse = null;
                            for (Map<String, Object> part : parts) {
                                if (part.containsKey("text")) {
                                    aiResponse = (String) part.get("text");
                                    break;
                                }
                            }
                            if (aiResponse != null) {
                                log.info("AI Text Response: {}", aiResponse);
                                String jsonStr = extractJson(aiResponse);
                                log.info("Extracted JSON: {}", jsonStr);
                                return objectMapper.readValue(jsonStr, SearchFilterDTO.class);
                            } else {
                                log.warn("Gemini API returned no text part.");
                            }
                        }
                    } else {
                        log.warn("Gemini API returned no content. Possible safety block. Response: {}", response);
                    }
                }
            }
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            log.error("HTTP Error in parseQueryWithAi: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Error in parseQueryWithAi: {}", e.getMessage(), e);
        }

        return null;
    }

    public String generateContent(String systemPrompt, String userPrompt) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("AI_API_KEY is blank in generateContent");
            return "AI is not configured.";
        }

        try {
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", systemPrompt + "\n\nUser: " + userPrompt)
                    ))
                )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            String url = GEMINI_API_URL + apiKey;

            log.info("Calling Gemini API for content generation...");
            System.out.println("DEBUG: Calling Gemini API for content generation");
            Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);
            log.info("Gemini API content response: {}", response);
            System.out.println("DEBUG: Gemini API content response: " + response);

            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> firstCandidate = candidates.get(0);
                    Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");
                    if (content != null && content.containsKey("parts")) {
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            for (Map<String, Object> part : parts) {
                                if (part.containsKey("text")) {
                                    return (String) part.get("text");
                                }
                            }
                            log.warn("Gemini API returned no text part.");
                            return "Sorry, my safety filters prevented me from generating a response. Let's try something else.";
                        }
                    } else {
                        log.warn("Gemini API returned no content. Possible safety block. Response: {}", response);
                        return "Sorry, my safety filters prevented me from generating a response. Let's try something else.";
                    }
                }
            }
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            log.error("HTTP Error in generateContent: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return "Gemini API Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString();
        } catch (Exception e) {
            log.error("Error in generateContent: {}", e.getMessage(), e);
            return "Sorry, I'm having trouble thinking right now. Error: " + e.getMessage();
        }
        return "Sorry, I'm having trouble thinking right now.";
    }

    private String extractJson(String text) {
        if (text.contains("```json")) {
            return text.substring(text.indexOf("```json") + 7, text.lastIndexOf("```")).trim();
        } else if (text.contains("```")) {
            return text.substring(text.indexOf("```") + 3, text.lastIndexOf("```")).trim();
        }
        return text.trim();
    }
}

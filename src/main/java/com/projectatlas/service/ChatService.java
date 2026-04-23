package com.projectatlas.service;

import com.projectatlas.dto.ProjectDTO;
import com.projectatlas.dto.SearchFilterDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final AiService aiService;
    private final ProjectService projectService;

    public Map<String, Object> processMentorChat(String userMessage) {
        // Step 1: Use AI to determine search filters based on career goals
        String filterPrompt = "You are a career advisor. Based on the user's message, identify the best ProjectCategory and TechStack keywords. " +
                "Respond ONLY with a JSON object: { \"category\": \"FULL_STACK\"|\"BACKEND\"|... , \"techStack\": \"keyword\" }";
        
        SearchFilterDTO filters = aiService.parseQueryWithAi(userMessage);
        
        // Step 2: Fetch actual projects from DB
        List<ProjectDTO> recommendations = List.of();
        if (filters != null) {
            filters.setPage(0);
            filters.setPageSize(3);
            Page<ProjectDTO> page = projectService.searchProjects(filters);
            recommendations = page.getContent();
        }

        // Step 3: Generate the mentor's response
        String systemPrompt = "You are the ProjectAtlas Mentor. Your goal is to give professional career advice. " +
                "The user wants to achieve a specific career goal. You have found a few projects from our database that could help them. " +
                "Explain how building these specific projects will help them get hired or reach their goal. " +
                "Keep it encouraging and professional. Max 3 paragraphs.";
        
        StringBuilder contextBuilder = new StringBuilder();
        contextBuilder.append("User Goal: ").append(userMessage).append("\n\n");
        contextBuilder.append("Found Projects:\n");
        for (ProjectDTO p : recommendations) {
            contextBuilder.append("- ").append(p.getTitle()).append(": ").append(p.getShortHook()).append("\n");
        }

        String mentorResponse = aiService.generateContent(systemPrompt, contextBuilder.toString());

        Map<String, Object> result = new HashMap<>();
        result.put("message", mentorResponse);
        result.put("recommendations", recommendations);
        return result;
    }

    public boolean isAiConfigured() {
        return aiService.isConfigured();
    }
}

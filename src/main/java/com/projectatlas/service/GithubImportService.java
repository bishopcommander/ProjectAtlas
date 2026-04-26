package com.projectatlas.service;

import com.projectatlas.entity.DifficultyLevel;
import com.projectatlas.entity.Project;
import com.projectatlas.entity.ProjectCategory;
import com.projectatlas.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GithubImportService {

    private final ProjectRepository projectRepository;
    private final RestTemplate restTemplate;

    private static final String GITHUB_API_URL = "https://api.github.com/search/repositories?q=topic:%s+stars:%s&sort=stars&order=desc&per_page=%d";

    public int importProjectsByTopic(String topic, String starRange, int limit) {
        String url = String.format(GITHUB_API_URL, topic, starRange, limit);
        try {
            // Using a generic Map for simplicity in this prototype
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("User-Agent", "ProjectAtlas-App");
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);
            
            org.springframework.http.ResponseEntity<Map> responseEntity = restTemplate.exchange(
                url, 
                org.springframework.http.HttpMethod.GET, 
                entity, 
                Map.class
            );
            
            Map<String, Object> response = responseEntity.getBody();

            if (response == null || !response.containsKey("items")) {
                return 0;
            }

            List<Map<String, Object>> items = (List<Map<String, Object>>) response.get("items");
            int count = 0;
            for (Map<String, Object> item : items) {
                if (importProject(item)) {
                    count++;
                }
            }
            return count;
        } catch (Exception e) {
            log.error("Error importing projects from GitHub for topic: {}", topic, e);
            return 0;
        }
    }

    private boolean importProject(Map<String, Object> item) {
        String title = (String) item.get("name");
        if (projectRepository.existsByTitle(title)) {
            return false;
        }

        String description = (String) item.get("description");
        List<String> topics = (List<String>) item.get("topics");
        Integer stars = (Integer) item.get("stargazers_count");

        Project project = Project.builder()
                .title(title)
                .shortHook(description != null && description.length() > 100 ? description.substring(0, 97) + "..." : description)
                .description(description)
                .techStack(topics != null ? String.join(", ", topics) : "")
                .impactScore(calculateImpactScore(stars))
                .isTrending(stars != null && stars > 1000)
                .difficulty(estimateDifficulty(topics))
                .category(mapToCategory(topics))
                .viewCount(0L)
                .bookmarkCount(0L)
                .build();

        projectRepository.save(project);
        return true;
    }

    public int importBulkProjects() {
        List<String> coreTopics = List.of(
            "machine-learning", "react", "spring-boot", "blockchain", 
            "fintech", "ecommerce", "system-design", "microservices", 
            "devops", "kubernetes", "data-engineering", "cybersecurity",
            "game-development", "mobile-app", "iot", "artificial-intelligence",
            "cloud-native", "serverless", "web3", "distributed-systems",
            "automation", "rust", "golang", "typescript", "terraform",
            "ansible", "graphql", "grpc", "nosql", "postgres"
        );
        
        List<String> starRanges = List.of(">5000", "1000..5000", "50..1000", "0..50");
        
        int totalImported = 0;
        for (String topic : coreTopics) {
            for (String starRange : starRanges) {
                int imported = importProjectsByTopic(topic, starRange, 50); // Increased to 50
                totalImported += imported;
                log.info("Bulk imported {} projects for topic: {} in star range: {}", imported, topic, starRange);
                
                try {
                    // Sleep to respect GitHub's unauthenticated search rate limit (10 per minute)
                    Thread.sleep(6500); 
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }
        return totalImported;
    }

    private Integer calculateImpactScore(Integer stars) {
        if (stars == null) return 5;
        if (stars > 10000) return 10;
        if (stars > 5000) return 9;
        if (stars > 1000) return 8;
        if (stars > 500) return 7;
        if (stars > 100) return 6;
        if (stars > 50) return 5;
        if (stars > 10) return 4;
        return 3;
    }

    private DifficultyLevel estimateDifficulty(List<String> topics) {
        if (topics == null) return DifficultyLevel.INTERMEDIATE;
        if (topics.contains("beginner") || topics.contains("simple")) return DifficultyLevel.BEGINNER;
        if (topics.contains("complex") || topics.contains("advanced") || topics.contains("high-performance")) return DifficultyLevel.ADVANCED;
        return DifficultyLevel.INTERMEDIATE;
    }

    private ProjectCategory mapToCategory(List<String> topics) {
        if (topics == null) return ProjectCategory.LEARNING_PROJECT;
        if (topics.contains("backend") || topics.contains("server")) return ProjectCategory.BACKEND;
        if (topics.contains("fullstack") || topics.contains("web")) return ProjectCategory.FULL_STACK;
        if (topics.contains("api") || topics.contains("rest")) return ProjectCategory.API_SERVICE;
        if (topics.contains("data") || topics.contains("analytics")) return ProjectCategory.DATA_ENGINEERING;
        if (topics.contains("docker") || topics.contains("kubernetes")) return ProjectCategory.DEVOPS;
        return ProjectCategory.LEARNING_PROJECT;
    }
}

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

    private static final String GITHUB_API_URL = "https://api.github.com/search/repositories?q=topic:%s&sort=stars&order=desc&per_page=%d";

    public int importProjectsByTopic(String topic, int limit) {
        String url = String.format(GITHUB_API_URL, topic, limit);
        try {
            // Using a generic Map for simplicity in this prototype
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
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
            "game-development", "mobile-app", "iot"
        );
        
        int totalImported = 0;
        for (String topic : coreTopics) {
            int imported = importProjectsByTopic(topic, 50); // Get up to 50 top repos per topic
            totalImported += imported;
            log.info("Bulk imported {} projects for topic: {}", imported, topic);
            
            try {
                // Sleep to respect GitHub's unauthenticated search rate limit (10 per minute)
                Thread.sleep(6000); 
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
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
        return 6;
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

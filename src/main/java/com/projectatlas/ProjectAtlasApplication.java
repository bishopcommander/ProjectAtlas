package com.projectatlas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class ProjectAtlasApplication {

    public static void main(String[] args) {
        io.github.cdimascio.dotenv.Dotenv dotenv = io.github.cdimascio.dotenv.Dotenv.configure()
            .ignoreIfMissing()
            .load();
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
        
        SpringApplication.run(ProjectAtlasApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public org.springframework.boot.CommandLineRunner initData(com.projectatlas.repository.ProjectRepository projectRepository, com.projectatlas.service.GithubImportService githubImportService) {
        return args -> {
            if (projectRepository.count() == 0) {
                System.out.println("DEBUG: Database is empty. Starting dynamic Mass Context Expansion from GitHub in background...");
                new Thread(() -> {
                    try {
                        int imported = githubImportService.importBulkProjects();
                        System.out.println("DEBUG: Dynamic seeding complete. Imported " + imported + " projects from GitHub.");
                    } catch (Exception e) {
                        System.err.println("DEBUG: Failed to import projects from GitHub: " + e.getMessage());
                    }
                }).start();
            } else {
                System.out.println("DEBUG: Database already has " + projectRepository.count() + " projects.");
            }
        };
    }
    private com.projectatlas.entity.Project createProject(String title, String hook, String tech, int impact, com.projectatlas.entity.DifficultyLevel diff, com.projectatlas.entity.ProjectCategory cat) {
        com.projectatlas.entity.Project p = new com.projectatlas.entity.Project();
        p.setTitle(title);
        p.setShortHook(hook);
        p.setTechStack(tech);
        p.setImpactScore(impact);
        p.setDifficulty(diff);
        p.setCategory(cat);
        p.setIsTrending(true);
        p.setViewCount(0L);
        p.setBookmarkCount(0L);
        return p;
    }
}

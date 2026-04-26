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
    public org.springframework.boot.CommandLineRunner initData(com.projectatlas.repository.ProjectRepository projectRepository) {
        return args -> {
            System.out.println("DEBUG: Checking database for projects...");
            if (projectRepository.count() == 0) {
                System.out.println("DEBUG: Database is empty. Seeding 10 core projects...");
                projectRepository.saveAll(java.util.List.of(
                    createProject("E-commerce Order Management System", "Build a scalable order service", "Java, Spring Boot", 8, com.projectatlas.entity.DifficultyLevel.INTERMEDIATE, com.projectatlas.entity.ProjectCategory.BACKEND),
                    createProject("Real-time Notification Service", "Master event-driven architecture", "Kafka, Spring Boot", 9, com.projectatlas.entity.DifficultyLevel.ADVANCED, com.projectatlas.entity.ProjectCategory.BACKEND),
                    createProject("Smart IoT Home Hub", "Connect your home", "Python, React", 9, com.projectatlas.entity.DifficultyLevel.ADVANCED, com.projectatlas.entity.ProjectCategory.IOT),
                    createProject("AI Resume Optimizer", "Get past the ATS", "Python, OpenAI", 8, com.projectatlas.entity.DifficultyLevel.INTERMEDIATE, com.projectatlas.entity.ProjectCategory.API_SERVICE)
                ));
                System.out.println("DEBUG: Seeding complete. Total projects: " + projectRepository.count());
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

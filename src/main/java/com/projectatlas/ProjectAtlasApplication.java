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
                    com.projectatlas.entity.Project.builder().title("E-commerce Order Management System").shortHook("Build a scalable order service").description("Full description...").techStack("Java, Spring Boot").impactScore(8).difficulty(com.projectatlas.entity.DifficultyLevel.INTERMEDIATE).category(com.projectatlas.entity.ProjectCategory.BACKEND).isTrending(true).build(),
                    com.projectatlas.entity.Project.builder().title("Real-time Notification Service").shortHook("Master event-driven architecture").description("Full description...").techStack("Kafka, Spring Boot").impactScore(9).difficulty(com.projectatlas.entity.DifficultyLevel.ADVANCED).category(com.projectatlas.entity.ProjectCategory.BACKEND).isTrending(true).build(),
                    com.projectatlas.entity.Project.builder().title("Smart IoT Home Hub").shortHook("Connect your home").description("Full description...").techStack("Python, React").impactScore(9).difficulty(com.projectatlas.entity.DifficultyLevel.ADVANCED).category(com.projectatlas.entity.ProjectCategory.IOT).isTrending(true).build(),
                    com.projectatlas.entity.Project.builder().title("AI Resume Optimizer").shortHook("Get past the ATS").description("Full description...").techStack("Python, OpenAI").impactScore(8).difficulty(com.projectatlas.entity.DifficultyLevel.INTERMEDIATE).category(com.projectatlas.entity.ProjectCategory.API_SERVICE).isTrending(true).build()
                ));
                System.out.println("DEBUG: Seeding complete. Total projects: " + projectRepository.count());
            } else {
                System.out.println("DEBUG: Database already has " + projectRepository.count() + " projects.");
            }
        };
    }
}

package com.projectatlas.config;

import com.projectatlas.entity.DifficultyLevel;
import com.projectatlas.entity.Project;
import com.projectatlas.entity.ProjectCategory;
import com.projectatlas.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final ProjectRepository projectRepository;

    @Override
    public void run(String... args) throws Exception {
        if (projectRepository.count() == 0) {
            log.info("Database is empty. Seeding sample projects...");
            
            List<Project> sampleProjects = List.of(
                createProject("E-commerce Order Management System", "Build a scalable order service with real-time processing", "A microservices-based order processing system with advanced queue management and analytics", "Java, Spring Boot, MySQL, Redis, RabbitMQ", 8, DifficultyLevel.INTERMEDIATE, ProjectCategory.BACKEND, true),
                createProject("Real-time Notification Service", "Master event-driven architecture with high concurrency", "High-throughput notification system supporting multiple channels (email, SMS, push)", "Java, Spring Boot, Kafka, PostgreSQL, WebSocket", 9, DifficultyLevel.ADVANCED, ProjectCategory.BACKEND, true),
                createProject("Smart IoT Home Hub", "Connect and automate your home with a unified hub", "Centralized dashboard for controlling smart devices with voice support", "Python, Raspberry Pi, MQTT, React", 9, DifficultyLevel.ADVANCED, ProjectCategory.IOT, true),
                createProject("AI-Powered Resume Optimizer", "Get past the ATS with AI-driven resume improvements", "Analyzes resumes against job descriptions using NLP", "Python, OpenAI API, Flask, React", 8, DifficultyLevel.INTERMEDIATE, ProjectCategory.API_SERVICE, true),
                createProject("Personal Finance Tracker", "Take control of your finances with smart categorization", "Automated expense tracking with bank sync and budget alerts", "React, Node.js, Plaid API, MongoDB", 7, DifficultyLevel.INTERMEDIATE, ProjectCategory.FULL_STACK, false),
                createProject("Container Orchestration Dashboard", "Learn container orchestration and infrastructure automation", "Kubernetes cluster manager with monitoring and auto-scaling capabilities", "Docker, Kubernetes, Go, Prometheus", 8, DifficultyLevel.ADVANCED, ProjectCategory.DEVOPS, false),
                createProject("Decentralized Voting System", "Ensure fair and immutable voting with blockchain", "Blockchain-based voting platform for transparent elections", "Solidity, Ethereum, Web3.js, React", 9, DifficultyLevel.ADVANCED, ProjectCategory.BLOCKCHAIN, false),
                createProject("Task Management REST API", "Learn REST API fundamentals and database design", "Simple yet complete task management system demonstrating CRUD operations", "Java, Spring Boot, MySQL", 5, DifficultyLevel.BEGINNER, ProjectCategory.LEARNING_PROJECT, false),
                createProject("Microservices Monitoring tool", "Keep your distributed system healthy with real-time monitoring", "Unified dashboard for health checks and metric collection for microservices", "Java, Spring Boot, Prometheus, Grafana", 9, DifficultyLevel.ADVANCED, ProjectCategory.MICROSERVICES, true),
                createProject("Collaborative Markdown Editor", "Write documentation together in real-time", "Real-time collaborative editing with live preview and version history", "React, Node.js, Socket.io, MongoDB", 8, DifficultyLevel.INTERMEDIATE, ProjectCategory.FULL_STACK, true)
            );

            projectRepository.saveAll(sampleProjects);
            log.info("Successfully seeded {} projects.", sampleProjects.size());
        } else {
            log.info("Database already contains {} projects. Skipping seeding.", projectRepository.count());
        }
    }

    private Project createProject(String title, String shortHook, String description, String techStack, int impact, DifficultyLevel difficulty, ProjectCategory category, boolean trending) {
        return Project.builder()
                .title(title)
                .shortHook(shortHook)
                .description(description)
                .techStack(techStack)
                .impactScore(impact)
                .difficulty(difficulty)
                .category(category)
                .isTrending(trending)
                .viewCount(0L)
                .bookmarkCount(0L)
                .build();
    }
}

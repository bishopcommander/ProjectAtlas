package com.projectatlas.service;

import com.projectatlas.dto.ProjectScoreDTO;
import com.projectatlas.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ScoringService {

    private final ProjectRepository projectRepository;

    /**
     * Calculate comprehensive project score based on multiple factors
     */
    public ProjectScoreDTO calculateProjectScore(Long projectId) {
        return projectRepository.findById(projectId).map(project -> {
            int uniqueness = project.getUniquenessScore() != null ? project.getUniquenessScore() : 5;
            int complexity = calculateComplexity(project.getDifficulty().toString());
            int resumeValue = project.getResumeValue() != null ? project.getResumeValue() : 5;
            int learning = project.getLearningPotential() != null ? project.getLearningPotential() : 5;

            int overallScore = (uniqueness + complexity + resumeValue + learning) / 4;

            return ProjectScoreDTO.builder()
                    .projectId(projectId)
                    .overallScore(overallScore)
                    .uniquenessScore(uniqueness)
                    .complexityScore(complexity)
                    .resumeValue(resumeValue)
                    .learningPotential(learning)
                    .scoreFeedback(generateFeedback(overallScore, uniqueness, complexity))
                    .build();
        }).orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
    }

    private int calculateComplexity(String difficulty) {
        return switch (difficulty) {
            case "BEGINNER" -> 3;
            case "INTERMEDIATE" -> 6;
            case "ADVANCED" -> 9;
            default -> 5;
        };
    }

    private String generateFeedback(int overall, int uniqueness, int complexity) {
        StringBuilder feedback = new StringBuilder();

        if (overall >= 8) {
            feedback.append("Excellent project choice! ");
        } else if (overall >= 6) {
            feedback.append("Good project with solid potential. ");
        } else {
            feedback.append("Consider enhancements to boost impact. ");
        }

        if (uniqueness >= 8) {
            feedback.append("High uniqueness - stands out! ");
        }

        if (complexity >= 8) {
            feedback.append("Challenging but rewarding learning experience. ");
        }

        return feedback.toString();
    }

    /**
     * Get project fit score based on user skills and project requirements
     */
    public int calculateFitScore(String userSkillLevel, String projectDifficulty) {
        int skillLevel = parseSkillLevel(userSkillLevel);
        int projectLevel = parseProjectLevel(projectDifficulty);

        // Perfect match
        if (skillLevel == projectLevel) {
            return 90;
        }

        // One level above current skill - good stretch
        if (skillLevel + 1 == projectLevel) {
            return 75;
        }

        // Same level as current - comfortable
        if (skillLevel == projectLevel) {
            return 85;
        }

        // Too easy
        if (skillLevel > projectLevel) {
            return 60;
        }

        // Too hard
        if (skillLevel < projectLevel - 1) {
            return 40;
        }

        return 50;
    }

    private int parseSkillLevel(String level) {
        return switch (level.toUpperCase()) {
            case "BEGINNER" -> 1;
            case "INTERMEDIATE" -> 2;
            case "ADVANCED" -> 3;
            default -> 2;
        };
    }

    private int parseProjectLevel(String difficulty) {
        return switch (difficulty.toUpperCase()) {
            case "BEGINNER" -> 1;
            case "INTERMEDIATE" -> 2;
            case "ADVANCED" -> 3;
            default -> 2;
        };
    }
}

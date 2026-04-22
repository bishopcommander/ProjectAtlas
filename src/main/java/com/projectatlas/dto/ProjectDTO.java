package com.projectatlas.dto;

import com.projectatlas.entity.DifficultyLevel;
import com.projectatlas.entity.ProjectCategory;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDTO {
    private Long projectId;
    private String title;
    private String description;
    private String shortHook;
    private DifficultyLevel difficulty;
    private ProjectCategory category;
    private String techStack;
    private Integer impactScore;
    private Integer uniquenessScore;
    private Integer learningPotential;
    private Integer resumeValue;
    private Boolean isTrending;
    private Long viewCount;
    private Long bookmarkCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

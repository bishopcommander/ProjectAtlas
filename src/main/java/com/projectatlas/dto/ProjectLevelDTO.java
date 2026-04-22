package com.projectatlas.dto;

import com.projectatlas.entity.LevelType;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectLevelDTO {
    private Long levelId;
    private Long projectId;
    private LevelType levelType;
    private String description;
    private String requirements;
    private Integer estimatedHours;
    private String features;
    private String implementationTips;
}

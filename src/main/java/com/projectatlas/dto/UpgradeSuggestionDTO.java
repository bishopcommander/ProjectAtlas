package com.projectatlas.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpgradeSuggestionDTO {
    private Long suggestionId;
    private Long projectId;
    private String title;
    private String description;
    private String complexity;
    private String implementationTips;
    private String impactLevel;
}

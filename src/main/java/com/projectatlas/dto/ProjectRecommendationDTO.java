package com.projectatlas.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectRecommendationDTO {
    private ProjectDTO project;
    private Integer fitScore;
    private Integer recommendationScore;
    private String reason;
}

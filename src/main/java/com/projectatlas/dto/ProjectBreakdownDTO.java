package com.projectatlas.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectBreakdownDTO {
    private ProjectDTO project;
    private ProjectDetailDTO detail;
    private List<ProjectLevelDTO> levels;
    private List<UpgradeSuggestionDTO> upgradeSuggestions;
    private ProjectScoreDTO evaluation;
    private Integer fitScore;
    private List<String> standoutReasons;
}

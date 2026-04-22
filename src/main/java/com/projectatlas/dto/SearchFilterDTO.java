package com.projectatlas.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchFilterDTO {
    private String keyword;
    private String difficulty;
    private String category;
    private String techStack;
    private Integer minImpactScore;
    private Boolean isTrending;
    @Builder.Default
    private Integer page = 0;
    @Builder.Default
    private Integer pageSize = 20;
}

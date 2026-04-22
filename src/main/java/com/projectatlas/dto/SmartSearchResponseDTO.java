package com.projectatlas.dto;

import org.springframework.data.domain.Page;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SmartSearchResponseDTO {
    private String query;
    private String interpretation;
    private SearchFilterDTO appliedFilters;
    private Page<ProjectDTO> results;
}

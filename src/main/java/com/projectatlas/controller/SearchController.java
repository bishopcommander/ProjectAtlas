package com.projectatlas.controller;

import com.projectatlas.dto.ProjectDTO;
import com.projectatlas.dto.SearchFilterDTO;
import com.projectatlas.dto.SmartSearchResponseDTO;
import com.projectatlas.service.ProjectService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SearchController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<Page<ProjectDTO>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        SearchFilterDTO filter = SearchFilterDTO.builder()
                .keyword(keyword)
                .page(page)
                .pageSize(size)
                .build();
        return ResponseEntity.ok(projectService.searchProjects(filter));
    }

    @PostMapping("/filter")
    public ResponseEntity<Page<ProjectDTO>> advancedFilter(@RequestBody SearchFilterDTO filter) {
        return ResponseEntity.ok(projectService.searchProjects(filter));
    }

    @PostMapping("/smart")
    public ResponseEntity<SmartSearchResponseDTO> smartSearch(
            @RequestParam String query,
            @RequestBody SearchFilterDTO baseFilters) {
        return ResponseEntity.ok(projectService.smartSearch(query, baseFilters));
    }

    @GetMapping("/filter/difficulty/{difficulty}")
    public ResponseEntity<Page<ProjectDTO>> filterByDifficulty(
            @PathVariable String difficulty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(projectService.filterByDifficulty(difficulty, page, size));
    }

    @GetMapping("/filter/category/{category}")
    public ResponseEntity<Page<ProjectDTO>> filterByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(projectService.filterByCategory(category, page, size));
    }

    @GetMapping("/filter/impact/{minScore}")
    public ResponseEntity<Page<ProjectDTO>> filterByImpact(
            @PathVariable Integer minScore,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(projectService.filterByMinImpactScore(minScore, page, size));
    }
}

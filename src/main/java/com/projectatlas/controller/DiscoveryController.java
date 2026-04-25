package com.projectatlas.controller;

import com.projectatlas.dto.ProjectDTO;
import com.projectatlas.service.ProjectService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/discovery")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DiscoveryController {

    private final ProjectService projectService;

    @GetMapping("/feed")
    public ResponseEntity<Page<ProjectDTO>> getDiscoveryFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(projectService.getAllProjects(page, size));
    }

    @GetMapping("/trending")
    public ResponseEntity<Page<ProjectDTO>> getTrendingProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(projectService.getTrendingProjects(page, size));
    }

    @GetMapping("/high-impact")
    public ResponseEntity<Page<ProjectDTO>> getHighImpactProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(projectService.getHighImpactProjects(page, size));
    }

    @GetMapping("/recent")
    public ResponseEntity<Page<ProjectDTO>> getRecentProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(projectService.getRecentProjects(page, size));
    }

    @GetMapping("/underrated")
    public ResponseEntity<Page<ProjectDTO>> getUnderratedProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(projectService.getUnderratedProjects(page, size));
    }

    @GetMapping("/backend-focused")
    public ResponseEntity<Page<ProjectDTO>> getBackendFocusedProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(projectService.filterByCategory("BACKEND", page, size));
    }
}

package com.projectatlas.controller;

import com.projectatlas.dto.ProjectBreakdownDTO;
import com.projectatlas.dto.ProjectDTO;
import com.projectatlas.dto.ProjectRecommendationDTO;
import com.projectatlas.service.ProjectService;
import com.projectatlas.repository.ProjectRepository;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectService projectService;
    private final ProjectRepository projectRepository;

    public ProjectController(ProjectService projectService, ProjectRepository projectRepository) {
        this.projectService = projectService;
        this.projectRepository = projectRepository;
    }

    @GetMapping("/debug/db")
    public ResponseEntity<Map<String, Object>> debugDb() {
        return ResponseEntity.ok(Map.of(
            "count", projectRepository.count(),
            "projects", projectRepository.findAll().stream().limit(5).toList()
        ));
    }

    @GetMapping
    public ResponseEntity<Page<ProjectDTO>> getAllProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(projectService.getAllProjects(page, size));
    }

    @GetMapping("/bulk")
    public ResponseEntity<List<ProjectDTO>> getProjectsBulk(@RequestParam List<Long> ids) {
        return ResponseEntity.ok(projectService.getProjectsBulk(ids));
    }

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id:\\d+}/breakdown")
    public ResponseEntity<ProjectBreakdownDTO> getProjectBreakdown(
            @PathVariable Long id,
            @RequestParam(required = false) Long userId) {
        return projectService.getProjectBreakdown(id, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/recommendations/user/{userId}")
    public ResponseEntity<List<ProjectRecommendationDTO>> getRecommendations(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(projectService.getRecommendationsForUser(userId, limit));
    }

    @GetMapping("/random")
    public ResponseEntity<ProjectDTO> getRandomProject() {
        return projectService.getRandomProject()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectDTO projectDTO) {
        ProjectDTO created = projectService.createProject(projectDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id:\\d+}")
    public ResponseEntity<ProjectDTO> updateProject(
            @PathVariable Long id,
            @RequestBody ProjectDTO projectDTO) {
        try {
            ProjectDTO updated = projectService.updateProject(id, projectDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id:\\d+}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        try {
            projectService.deleteProject(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id:\\d+}/view")
    public ResponseEntity<Void> recordView(@PathVariable Long id) {
        projectService.incrementViewCount(id);
        return ResponseEntity.ok().build();
    }
}

package com.projectatlas.controller;

import com.projectatlas.dto.ProjectScoreDTO;
import com.projectatlas.service.ScoringService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/scoring")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ScoringController {

    private final ScoringService scoringService;

    @GetMapping("/project/{projectId}")
    public ResponseEntity<ProjectScoreDTO> getProjectScore(@PathVariable Long projectId) {
        try {
            ProjectScoreDTO score = scoringService.calculateProjectScore(projectId);
            return ResponseEntity.ok(score);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/fit")
    public ResponseEntity<Integer> getProjectFitScore(
            @RequestParam String userSkillLevel,
            @RequestParam String projectDifficulty) {
        Integer fitScore = scoringService.calculateFitScore(userSkillLevel, projectDifficulty);
        return ResponseEntity.ok(fitScore);
    }
}

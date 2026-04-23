package com.projectatlas.controller;

import com.projectatlas.service.GithubImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/import")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ImportController {

    private final GithubImportService githubImportService;

    @PostMapping("/github")
    public ResponseEntity<Map<String, Object>> importFromGithub(
            @RequestParam(defaultValue = "web-standard") String topic,
            @RequestParam(defaultValue = ">50") String starRange,
            @RequestParam(defaultValue = "10") int limit) {
        
        int importedCount = githubImportService.importProjectsByTopic(topic, starRange, limit);
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "topic", topic,
            "importedCount", importedCount,
            "message", String.format("Successfully imported %d projects for topic: %s", importedCount, topic)
        ));
    }

    @PostMapping("/github/bulk")
    public ResponseEntity<Map<String, Object>> importBulkFromGithub() {
        
        // Run in background to prevent HTTP timeout since it takes ~90 seconds
        new Thread(() -> {
            try {
                githubImportService.importBulkProjects();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Mass context expansion started. Fetching hundreds of projects across 15 domains. This will take about 2 minutes."
        ));
    }
}

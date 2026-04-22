package com.projectatlas.controller;

import com.projectatlas.dto.UserCollectionDTO;
import com.projectatlas.service.UserCollectionService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/collections")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserCollectionController {

    private final UserCollectionService userCollectionService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<UserCollectionDTO>> getUserCollections(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(userCollectionService.getUserCollections(userId, page, size));
    }

    @PostMapping("/user/{userId}/project/{projectId}")
    public ResponseEntity<UserCollectionDTO> addToCollection(
            @PathVariable Long userId,
            @PathVariable Long projectId,
            @RequestBody UserCollectionDTO collectionDTO) {
        try {
            UserCollectionDTO added = userCollectionService.addToCollection(userId, projectId, collectionDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(added);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{collectionId}")
    public ResponseEntity<UserCollectionDTO> updateCollection(
            @PathVariable Long collectionId,
            @RequestBody UserCollectionDTO collectionDTO) {
        try {
            UserCollectionDTO updated = userCollectionService.updateCollectionStatus(collectionId, collectionDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{collectionId}")
    public ResponseEntity<Void> removeFromCollection(
            @PathVariable Long collectionId,
            @RequestParam Long projectId) {
        try {
            userCollectionService.removeFromCollection(collectionId, projectId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

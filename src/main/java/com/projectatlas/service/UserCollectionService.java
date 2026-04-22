package com.projectatlas.service;

import com.projectatlas.dto.UserCollectionDTO;
import com.projectatlas.entity.UserCollection;
import com.projectatlas.repository.ProjectRepository;
import com.projectatlas.repository.UserCollectionRepository;
import com.projectatlas.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserCollectionService {

    private final UserCollectionRepository userCollectionRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectService projectService;

    public Page<UserCollectionDTO> getUserCollections(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userCollectionRepository.findByUser_UserId(userId, pageable)
                .map(this::convertToDTO);
    }

    public UserCollectionDTO addToCollection(Long userId, Long projectId, UserCollectionDTO collectionDTO) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        if (!projectRepository.existsById(projectId)) {
            throw new RuntimeException("Project not found with id: " + projectId);
        }

        // Check if already exists
        if (userCollectionRepository.existsByUser_UserIdAndProject_ProjectId(userId, projectId)) {
            throw new RuntimeException("Project already in collection");
        }

        var user = userRepository.findById(userId).orElseThrow();
        var project = projectRepository.findById(projectId).orElseThrow();

        UserCollection collection = UserCollection.builder()
                .user(user)
                .project(project)
                .status(collectionDTO.getStatus())
                .notes(collectionDTO.getNotes())
                .build();

        UserCollection saved = userCollectionRepository.save(collection);
        projectService.incrementBookmarkCount(projectId);

        return convertToDTO(saved);
    }

    public UserCollectionDTO updateCollectionStatus(Long collectionId, UserCollectionDTO collectionDTO) {
        return userCollectionRepository.findById(collectionId).map(collection -> {
            collection.setStatus(collectionDTO.getStatus());
            collection.setNotes(collectionDTO.getNotes());
            UserCollection updated = userCollectionRepository.save(collection);
            return convertToDTO(updated);
        }).orElseThrow(() -> new RuntimeException("Collection not found with id: " + collectionId));
    }

    public void removeFromCollection(Long collectionId, Long projectId) {
        if (!userCollectionRepository.existsById(collectionId)) {
            throw new RuntimeException("Collection not found with id: " + collectionId);
        }
        userCollectionRepository.deleteById(collectionId);
        projectService.decrementBookmarkCount(projectId);
    }

    private UserCollectionDTO convertToDTO(UserCollection collection) {
        UserCollectionDTO dto = new UserCollectionDTO();
        BeanUtils.copyProperties(collection, dto);
        dto.setUserId(collection.getUser().getUserId());
        dto.setProjectId(collection.getProject().getProjectId());
        return dto;
    }
}

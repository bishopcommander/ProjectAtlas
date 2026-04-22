package com.projectatlas.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detail_id")
    private Long detailId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "overview", columnDefinition = "TEXT")
    private String overview;

    @Column(name = "core_logic", columnDefinition = "TEXT")
    private String coreLogic;

    @Column(name = "system_architecture", columnDefinition = "TEXT")
    private String systemArchitecture;

    @Column(name = "common_mistakes", columnDefinition = "TEXT")
    private String commonMistakes;

    @Column(name = "what_impresses", columnDefinition = "TEXT")
    private String whatImpresses;

    @Column(name = "key_learnings", columnDefinition = "TEXT")
    private String keyLearnings;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

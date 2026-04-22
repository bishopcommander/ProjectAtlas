package com.projectatlas.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "upgrade_suggestions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpgradeSuggestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "suggestion_id")
    private Long suggestionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "complexity", length = 50)
    private String complexity;

    @Column(name = "implementation_tips", columnDefinition = "TEXT")
    private String implementationTips;

    @Column(name = "impact_level", length = 50)
    private String impactLevel;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

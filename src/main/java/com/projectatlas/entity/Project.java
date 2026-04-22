package com.projectatlas.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_id")
    private Long projectId;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 500)
    private String shortHook;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DifficultyLevel difficulty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectCategory category;

    @Column(name = "tech_stack", columnDefinition = "TEXT")
    private String techStack;

    @Column(name = "impact_score")
    private Integer impactScore;

    @Column(name = "uniqueness_score")
    private Integer uniquenessScore;

    @Column(name = "learning_potential")
    private Integer learningPotential;

    @Column(name = "resume_value")
    private Integer resumeValue;

    @Column(name = "is_trending")
    private Boolean isTrending;

    @Column(name = "view_count")
    @Builder.Default
    private Long viewCount = 0L;

    @Column(name = "bookmark_count")
    @Builder.Default
    private Long bookmarkCount = 0L;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<ProjectDetail> projectDetails;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<ProjectLevel> projectLevels;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<UpgradeSuggestion> upgradeSuggestions;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        viewCount = 0L;
        bookmarkCount = 0L;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getShortHook() { return shortHook; }
    public void setShortHook(String shortHook) { this.shortHook = shortHook; }
    
    public DifficultyLevel getDifficulty() { return difficulty; }
    public void setDifficulty(DifficultyLevel difficulty) { this.difficulty = difficulty; }
    
    public ProjectCategory getCategory() { return category; }
    public void setCategory(ProjectCategory category) { this.category = category; }
    
    public String getTechStack() { return techStack; }
    public void setTechStack(String techStack) { this.techStack = techStack; }
    
    public Integer getImpactScore() { return impactScore; }
    public void setImpactScore(Integer impactScore) { this.impactScore = impactScore; }
    
    public Integer getUniquenessScore() { return uniquenessScore; }
    public void setUniquenessScore(Integer uniquenessScore) { this.uniquenessScore = uniquenessScore; }
    
    public Integer getLearningPotential() { return learningPotential; }
    public void setLearningPotential(Integer learningPotential) { this.learningPotential = learningPotential; }
    
    public Integer getResumeValue() { return resumeValue; }
    public void setResumeValue(Integer resumeValue) { this.resumeValue = resumeValue; }
    
    public Boolean getIsTrending() { return isTrending; }
    public void setIsTrending(Boolean isTrending) { this.isTrending = isTrending; }
    
    public Long getViewCount() { return viewCount; }
    public void setViewCount(Long viewCount) { this.viewCount = viewCount; }
    
    public Long getBookmarkCount() { return bookmarkCount; }
    public void setBookmarkCount(Long bookmarkCount) { this.bookmarkCount = bookmarkCount; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

package com.projectatlas.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_collections",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "project_id"})})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCollection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "collection_id")
    private Long collectionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "bookmarked_at", updatable = false)
    private LocalDateTime bookmarkedAt;

    @PrePersist
    protected void onCreate() {
        bookmarkedAt = LocalDateTime.now();
    }

    public Long getCollectionId() { return collectionId; }
    public void setCollectionId(Long collectionId) { this.collectionId = collectionId; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
    
    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public LocalDateTime getBookmarkedAt() { return bookmarkedAt; }
    public void setBookmarkedAt(LocalDateTime bookmarkedAt) { this.bookmarkedAt = bookmarkedAt; }
}

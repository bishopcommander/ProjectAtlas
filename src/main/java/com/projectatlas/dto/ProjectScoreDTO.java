package com.projectatlas.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectScoreDTO {
    private Long projectId;
    private Integer overallScore;
    private Integer uniquenessScore;
    private Integer complexityScore;
    private Integer resumeValue;
    private Integer learningPotential;
    private String scoreFeedback;

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    
    public Integer getOverallScore() { return overallScore; }
    public void setOverallScore(Integer overallScore) { this.overallScore = overallScore; }
    
    public Integer getUniquenessScore() { return uniquenessScore; }
    public void setUniquenessScore(Integer uniquenessScore) { this.uniquenessScore = uniquenessScore; }
    
    public Integer getComplexityScore() { return complexityScore; }
    public void setComplexityScore(Integer complexityScore) { this.complexityScore = complexityScore; }
    
    public Integer getResumeValue() { return resumeValue; }
    public void setResumeValue(Integer resumeValue) { this.resumeValue = resumeValue; }
    
    public Integer getLearningPotential() { return learningPotential; }
    public void setLearningPotential(Integer learningPotential) { this.learningPotential = learningPotential; }
    
    public String getScoreFeedback() { return scoreFeedback; }
    public void setScoreFeedback(String scoreFeedback) { this.scoreFeedback = scoreFeedback; }
}

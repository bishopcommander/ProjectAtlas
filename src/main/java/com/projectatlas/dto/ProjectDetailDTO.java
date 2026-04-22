package com.projectatlas.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDetailDTO {
    private Long detailId;
    private Long projectId;
    private String overview;
    private String coreLogic;
    private String systemArchitecture;
    private String commonMistakes;
    private String whatImpresses;
    private String keyLearnings;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

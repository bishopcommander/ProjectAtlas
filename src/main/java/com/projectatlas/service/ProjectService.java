package com.projectatlas.service;

import com.projectatlas.dto.ProjectBreakdownDTO;
import com.projectatlas.dto.ProjectDTO;
import com.projectatlas.dto.ProjectDetailDTO;
import com.projectatlas.dto.ProjectLevelDTO;
import com.projectatlas.dto.ProjectRecommendationDTO;
import com.projectatlas.dto.ProjectScoreDTO;
import com.projectatlas.dto.SearchFilterDTO;
import com.projectatlas.dto.SmartSearchResponseDTO;
import com.projectatlas.dto.UpgradeSuggestionDTO;
import com.projectatlas.entity.DifficultyLevel;
import com.projectatlas.entity.Project;
import com.projectatlas.entity.ProjectCategory;
import com.projectatlas.entity.ProjectDetail;
import com.projectatlas.entity.ProjectLevel;
import com.projectatlas.entity.UpgradeSuggestion;
import com.projectatlas.entity.User;
import com.projectatlas.repository.ProjectDetailRepository;
import com.projectatlas.repository.ProjectLevelRepository;
import com.projectatlas.repository.ProjectRepository;
import com.projectatlas.repository.UpgradeSuggestionRepository;
import com.projectatlas.repository.UserRepository;
import com.projectatlas.util.ProjectSpecification;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectDetailRepository projectDetailRepository;
    private final ProjectLevelRepository projectLevelRepository;
    private final UpgradeSuggestionRepository upgradeSuggestionRepository;
    private final UserRepository userRepository;
    private final ScoringService scoringService;

    public Page<ProjectDTO> getAllProjects(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return projectRepository.findAll(pageable).map(this::convertToDTO);
    }

    public Optional<ProjectDTO> getProjectById(Long projectId) {
        return projectRepository.findById(projectId).map(this::convertToDTO);
    }

    public Page<ProjectDTO> getTrendingProjects(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return projectRepository.findTrendingProjects(pageable).map(this::convertToDTO);
    }

    public Page<ProjectDTO> getHighImpactProjects(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return projectRepository.findHighImpactProjects(pageable).map(this::convertToDTO);
    }

    public Page<ProjectDTO> searchByKeyword(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return projectRepository.searchByKeyword(keyword, pageable).map(this::convertToDTO);
    }

    public Page<ProjectDTO> filterByDifficulty(String difficulty, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        DifficultyLevel parsedDifficulty = parseDifficulty(difficulty);
        if (parsedDifficulty == null) {
            return Page.empty(pageable);
        }
        return projectRepository.findByDifficulty(parsedDifficulty, pageable).map(this::convertToDTO);
    }

    public Page<ProjectDTO> filterByCategory(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        ProjectCategory parsedCategory = parseCategory(category);
        if (parsedCategory == null) {
            return Page.empty(pageable);
        }
        return projectRepository.findByCategory(parsedCategory, pageable).map(this::convertToDTO);
    }

    public Page<ProjectDTO> filterByMinImpactScore(Integer minScore, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return projectRepository.findByMinImpactScore(minScore, pageable).map(this::convertToDTO);
    }

    public Page<ProjectDTO> getRecentProjects(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return projectRepository.findRecentProjects(pageable).map(this::convertToDTO);
    }

    public Page<ProjectDTO> getUnderratedProjects(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return projectRepository.findUnderrated(pageable).map(this::convertToDTO);
    }

    public Page<ProjectDTO> searchProjects(SearchFilterDTO filter) {
        int page = filter.getPage() != null ? filter.getPage() : 0;
        int size = filter.getPageSize() != null ? filter.getPageSize() : 20;

        // Sort order mirrors what the old JPQL query did
        Sort sort = Sort.by(
                Sort.Order.desc("isTrending"),
                Sort.Order.desc("impactScore"),
                Sort.Order.desc("viewCount"),
                Sort.Order.desc("createdAt")
        );
        Pageable pageable = PageRequest.of(page, size, sort);

        // Use JPA Specification instead of JPQL to avoid Hibernate 6
        // "IS NULL" parameter-binding issues with enum/boolean typed params.
        Specification<Project> spec = ProjectSpecification.withFilters(
                normalize(filter.getKeyword()),
                parseDifficulty(filter.getDifficulty()),
                parseCategory(filter.getCategory()),
                normalize(filter.getTechStack()),
                filter.getMinImpactScore(),
                filter.getIsTrending()
        );

        return projectRepository.findAll(spec, pageable).map(this::convertToDTO);
    }

    public SmartSearchResponseDTO smartSearch(String query, SearchFilterDTO baseFilters) {
        SearchFilterDTO filters = parseNaturalLanguageQuery(query, baseFilters);
        Page<ProjectDTO> results = searchProjects(filters);

        return SmartSearchResponseDTO.builder()
                .query(query)
                .interpretation(buildInterpretation(filters))
                .appliedFilters(filters)
                .results(results)
                .build();
    }

    public Optional<ProjectBreakdownDTO> getProjectBreakdown(Long projectId, Long userId) {
        return projectRepository.findById(projectId).map(project -> {
            ProjectScoreDTO evaluation = scoringService.calculateProjectScore(projectId);
            Integer fitScore = null;
            if (userId != null) {
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
                fitScore = scoringService.calculateFitScore(user.getSkillLevel(), project.getDifficulty().name());
            }

            return ProjectBreakdownDTO.builder()
                    .project(convertToDTO(project))
                    .detail(projectDetailRepository.findByProject_ProjectId(projectId).map(this::convertDetailToDTO).orElse(null))
                    .levels(projectLevelRepository.findByProject_ProjectId(projectId).stream().map(this::convertLevelToDTO).toList())
                    .upgradeSuggestions(upgradeSuggestionRepository.findByProject_ProjectId(projectId).stream().map(this::convertUpgradeToDTO).toList())
                    .evaluation(evaluation)
                    .fitScore(fitScore)
                    .standoutReasons(buildStandoutReasons(project, evaluation))
                    .build();
        });
    }

    public List<ProjectRecommendationDTO> getRecommendationsForUser(Long userId, int limit) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        String preferredStack = normalize(user.getPreferredTechStack());
        int cappedLimit = Math.max(1, Math.min(limit, 20));

        return projectRepository.findAll().stream()
                .map(project -> toRecommendation(project, user.getSkillLevel(), preferredStack))
                .sorted(Comparator.comparing(ProjectRecommendationDTO::getRecommendationScore).reversed())
                .limit(cappedLimit)
                .toList();
    }

    public Optional<ProjectDTO> getRandomProject() {
        long total = projectRepository.count();
        if (total == 0) {
            return Optional.empty();
        }

        int randomIndex = ThreadLocalRandom.current().nextInt((int) total);
        Pageable pageable = PageRequest.of(randomIndex, 1);
        return projectRepository.findAll(pageable)
                .stream()
                .findFirst()
                .map(this::convertToDTO);
    }

    public ProjectDTO createProject(ProjectDTO projectDTO) {
        Project project = convertToEntity(projectDTO);
        Project savedProject = projectRepository.save(project);
        return convertToDTO(savedProject);
    }

    public ProjectDTO updateProject(Long projectId, ProjectDTO projectDTO) {
        return projectRepository.findById(projectId).map(project -> {
            BeanUtils.copyProperties(projectDTO, project, "projectId", "createdAt");
            Project updatedProject = projectRepository.save(project);
            return convertToDTO(updatedProject);
        }).orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
    }

    public void deleteProject(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new RuntimeException("Project not found with id: " + projectId);
        }
        projectRepository.deleteById(projectId);
    }

    public void incrementViewCount(Long projectId) {
        projectRepository.findById(projectId).ifPresent(project -> {
            project.setViewCount(project.getViewCount() + 1);
            projectRepository.save(project);
        });
    }

    public void incrementBookmarkCount(Long projectId) {
        projectRepository.findById(projectId).ifPresent(project -> {
            project.setBookmarkCount(project.getBookmarkCount() + 1);
            projectRepository.save(project);
        });
    }

    public void decrementBookmarkCount(Long projectId) {
        projectRepository.findById(projectId).ifPresent(project -> {
            if (project.getBookmarkCount() > 0) {
                project.setBookmarkCount(project.getBookmarkCount() - 1);
                projectRepository.save(project);
            }
        });
    }

    private ProjectDTO convertToDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        BeanUtils.copyProperties(project, dto);
        return dto;
    }

    private ProjectDetailDTO convertDetailToDTO(ProjectDetail detail) {
        ProjectDetailDTO dto = new ProjectDetailDTO();
        BeanUtils.copyProperties(detail, dto);
        dto.setProjectId(detail.getProject().getProjectId());
        return dto;
    }

    private ProjectLevelDTO convertLevelToDTO(ProjectLevel level) {
        ProjectLevelDTO dto = new ProjectLevelDTO();
        BeanUtils.copyProperties(level, dto);
        dto.setProjectId(level.getProject().getProjectId());
        return dto;
    }

    private UpgradeSuggestionDTO convertUpgradeToDTO(UpgradeSuggestion suggestion) {
        UpgradeSuggestionDTO dto = new UpgradeSuggestionDTO();
        BeanUtils.copyProperties(suggestion, dto);
        dto.setProjectId(suggestion.getProject().getProjectId());
        return dto;
    }

    private Project convertToEntity(ProjectDTO dto) {
        Project project = new Project();
        BeanUtils.copyProperties(dto, project, "projectId", "createdAt", "updatedAt");
        return project;
    }

    private SearchFilterDTO parseNaturalLanguageQuery(String query, SearchFilterDTO baseFilters) {
        String normalizedQuery = query == null ? "" : query.trim().toLowerCase();
        String workingQuery = normalizedQuery;

        SearchFilterDTO filters = baseFilters != null ? baseFilters : SearchFilterDTO.builder().build();
        if (filters.getPage() == null) filters.setPage(0);
        if (filters.getPageSize() == null) filters.setPageSize(20);

        if (workingQuery.contains("beginner")) {
            filters.setDifficulty(DifficultyLevel.BEGINNER.name());
            workingQuery = workingQuery.replace("beginner", "");
        } else if (workingQuery.contains("intermediate") || workingQuery.contains("medium")) {
            filters.setDifficulty(DifficultyLevel.INTERMEDIATE.name());
            workingQuery = workingQuery.replace("intermediate", "").replace("medium", "");
        } else if (workingQuery.contains("advanced") || workingQuery.contains("hard")) {
            filters.setDifficulty(DifficultyLevel.ADVANCED.name());
            workingQuery = workingQuery.replace("advanced", "").replace("hard", "");
        }

        // Logic for Category
        if (workingQuery.contains("full stack") || workingQuery.contains("fullstack")) {
            filters.setCategory(ProjectCategory.FULL_STACK.name());
            workingQuery = workingQuery.replace("full stack", "").replace("fullstack", "");
        } else if (containsAny(workingQuery, "data", "etl", "analytics")) {
            filters.setCategory(ProjectCategory.DATA_ENGINEERING.name());
            // Don't fully strip "data" yet as it might be part of tech names like "database"
        } else if (containsAny(workingQuery, "devops", "infra", "kubernetes", "docker")) {
            filters.setCategory(ProjectCategory.DEVOPS.name());
        } else if (containsAny(workingQuery, "microservice", "distributed")) {
            filters.setCategory(ProjectCategory.MICROSERVICES.name());
        } else if (containsAny(workingQuery, "backend", "api", "server")) {
            filters.setCategory(ProjectCategory.BACKEND.name());
            workingQuery = workingQuery.replace("backend", "").replace("api", "").replace("server", "");
        } else if (containsAny(workingQuery, "tool", "utility", "developer tool")) {
            filters.setCategory(ProjectCategory.TOOL_UTILITY.name());
            workingQuery = workingQuery.replace("tool", "").replace("utility", "").replace("developer tool", "");
        }

        if (containsAny(workingQuery, "trending", "popular", "hot")) {
            filters.setIsTrending(true);
            workingQuery = workingQuery.replace("trending", "").replace("popular", "").replace("hot", "");
        }

        if (containsAny(workingQuery, "resume", "portfolio", "recruiter", "impress")) {
            filters.setMinImpactScore(8);
            workingQuery = workingQuery.replace("resume", "").replace("portfolio", "").replace("recruiter", "").replace("impress", "");
        }

        String techStack = extractTechStack(workingQuery);
        if (techStack != null) {
            filters.setTechStack(techStack);
            workingQuery = workingQuery.replace(techStack, "");
        }

        // Merge Keyword Context instead of overwriting
        String extractedKeyword = extractKeyword(workingQuery);
        if (extractedKeyword != null && !extractedKeyword.isBlank()) {
            String existing = filters.getKeyword();
            if (existing != null && !existing.isBlank() && !existing.toLowerCase().contains(extractedKeyword.toLowerCase())) {
                filters.setKeyword(existing + " " + extractedKeyword);
            } else if (existing == null || existing.isBlank()) {
                filters.setKeyword(extractedKeyword);
            }
        }

        return filters;
    }

    private String extractTechStack(String normalizedQuery) {
        return Stream.of(
                        "java",
                        "spring boot",
                        "mysql",
                        "postgresql",
                        "redis",
                        "rabbitmq",
                        "kafka",
                        "docker",
                        "kubernetes",
                        "python",
                        "django",
                        "react",
                        "go",
                        "spark",
                        "airflow",
                        "websocket"
                )
                .filter(normalizedQuery::contains)
                .findFirst()
                .orElse(null);
    }

    private String buildInterpretation(SearchFilterDTO filters) {
        List<String> parts = new ArrayList<>();

        if (filters.getDifficulty() != null) {
            parts.add(filters.getDifficulty().toLowerCase() + " difficulty");
        }
        if (filters.getCategory() != null) {
            parts.add(filters.getCategory().toLowerCase().replace('_', ' ') + " projects");
        }
        if (filters.getTechStack() != null) {
            parts.add("using " + filters.getTechStack());
        }
        if (filters.getMinImpactScore() != null) {
            parts.add("with impact score >= " + filters.getMinImpactScore());
        }
        if (Boolean.TRUE.equals(filters.getIsTrending())) {
            parts.add("currently trending");
        }

        if (parts.isEmpty()) {
            return "Showing all projects because no strong filter intent was detected.";
        }
        return "Matched intent for " + String.join(", ", parts) + ".";
    }

    private List<String> buildStandoutReasons(Project project, ProjectScoreDTO evaluation) {
        List<String> reasons = new ArrayList<>();
        if (Boolean.TRUE.equals(project.getIsTrending())) {
            reasons.add("Trending signal suggests current developer interest.");
        }
        if (project.getResumeValue() != null && project.getResumeValue() >= 8) {
            reasons.add("Strong resume value makes it easier to discuss in interviews.");
        }
        if (project.getLearningPotential() != null && project.getLearningPotential() >= 8) {
            reasons.add("High learning potential gives you room to grow the project in stages.");
        }
        if (evaluation.getUniquenessScore() != null && evaluation.getUniquenessScore() >= 8) {
            reasons.add("Above-average uniqueness helps it stand out from common clone projects.");
        }
        return reasons;
    }

    private ProjectRecommendationDTO toRecommendation(Project project, String userSkillLevel, String preferredStack) {
        int fitScore = scoringService.calculateFitScore(userSkillLevel, project.getDifficulty().name());
        int stackBonus = hasTechStackOverlap(preferredStack, normalize(project.getTechStack())) ? 10 : 0;
        int recommendationScore = fitScore
                + safe(project.getImpactScore())
                + safe(project.getResumeValue())
                + stackBonus;

        return ProjectRecommendationDTO.builder()
                .project(convertToDTO(project))
                .fitScore(fitScore)
                .recommendationScore(recommendationScore)
                .reason(buildRecommendationReason(project, fitScore, stackBonus))
                .build();
    }

    private String buildRecommendationReason(Project project, int fitScore, int stackBonus) {
        StringBuilder reason = new StringBuilder();
        if (fitScore >= 85) {
            reason.append("Excellent skill match");
        } else if (fitScore >= 70) {
            reason.append("Good stretch project");
        } else {
            reason.append("Ambitious pick with growth potential");
        }

        if (stackBonus > 0) {
            reason.append(" aligned with your preferred tech stack");
        }

        if (project.getResumeValue() != null && project.getResumeValue() >= 8) {
            reason.append(" and strong portfolio upside");
        }

        return reason.toString();
    }

    private DifficultyLevel parseDifficulty(String difficulty) {
        try {
            return difficulty == null || difficulty.isBlank() ? null : DifficultyLevel.valueOf(difficulty.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }

    private ProjectCategory parseCategory(String category) {
        try {
            return category == null || category.isBlank() ? null : ProjectCategory.valueOf(category.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }

    private boolean containsAny(String input, String... tokens) {
        for (String token : tokens) {
            if (input.contains(token)) {
                return true;
            }
        }
        return false;
    }

    private String normalize(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private int safe(Integer value) {
        return value == null ? 0 : value;
    }

    private String extractKeyword(String workingQuery) {
        // Clean up common filler words and search noise
        String candidate = workingQuery
                .replace("difficulty", "")
                .replace("projects", "")
                .replace("project", "")
                .replace("show me", "")
                .replace("find me", "")
                .replace("give me", "")
                .replace("build", "")
                .replace("with", "")
                .replace("using", "")
                .replace("focused", "")
                .replaceAll("\\s+", " ")
                .trim();

        return candidate.isBlank() ? null : candidate;
    }

    private boolean hasTechStackOverlap(String preferredStack, String projectStack) {
        if (preferredStack == null || projectStack == null) {
            return false;
        }

        String normalizedProjectStack = projectStack.toLowerCase();
        for (String token : preferredStack.toLowerCase().split(",")) {
            String trimmedToken = token.trim();
            if (!trimmedToken.isEmpty() && normalizedProjectStack.contains(trimmedToken)) {
                return true;
            }
        }
        return false;
    }
}

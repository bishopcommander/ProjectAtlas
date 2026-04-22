package com.projectatlas.util;

import com.projectatlas.entity.DifficultyLevel;
import com.projectatlas.entity.Project;
import com.projectatlas.entity.ProjectCategory;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

/**
 * JPA Specification for dynamic Project filtering.
 *
 * This replaces the JPQL searchWithFilters query which fails silently
 * under Hibernate 6 when typed parameters (enums, booleans) are null due to
 * the ":param IS NULL" pattern not being handled correctly in that version.
 */
public class ProjectSpecification {

    private ProjectSpecification() {}

    public static Specification<Project> withFilters(
            String keyword,
            DifficultyLevel difficulty,
            ProjectCategory category,
            String techStack,
            Integer minImpactScore,
            Boolean isTrending) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern),
                        cb.like(cb.lower(root.get("shortHook")), pattern)
                ));
            }

            if (difficulty != null) {
                predicates.add(cb.equal(root.get("difficulty"), difficulty));
            }

            if (category != null) {
                predicates.add(cb.equal(root.get("category"), category));
            }

            if (techStack != null && !techStack.isBlank()) {
                predicates.add(cb.like(
                        cb.lower(root.get("techStack")),
                        "%" + techStack.toLowerCase() + "%"
                ));
            }

            if (minImpactScore != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("impactScore"), minImpactScore));
            }

            if (Boolean.TRUE.equals(isTrending)) {
                predicates.add(cb.equal(root.get("isTrending"), Boolean.TRUE));
            }

            return predicates.isEmpty()
                    ? cb.conjunction()
                    : cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

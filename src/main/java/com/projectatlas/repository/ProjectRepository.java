package com.projectatlas.repository;

import com.projectatlas.entity.DifficultyLevel;
import com.projectatlas.entity.Project;
import com.projectatlas.entity.ProjectCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long>, JpaSpecificationExecutor<Project> {

    @Query("SELECT p FROM Project p WHERE p.isTrending = true ORDER BY p.viewCount DESC")
    Page<Project> findTrendingProjects(Pageable pageable);

    @Query("SELECT p FROM Project p ORDER BY p.impactScore DESC")
    Page<Project> findHighImpactProjects(Pageable pageable);

    @Query("SELECT p FROM Project p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Project> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT p FROM Project p WHERE p.difficulty = :difficulty ORDER BY p.viewCount DESC")
    Page<Project> findByDifficulty(@Param("difficulty") DifficultyLevel difficulty, Pageable pageable);

    @Query("SELECT p FROM Project p WHERE p.category = :category ORDER BY p.viewCount DESC")
    Page<Project> findByCategory(@Param("category") ProjectCategory category, Pageable pageable);

    @Query("SELECT p FROM Project p WHERE p.impactScore >= :minScore ORDER BY p.impactScore DESC")
    Page<Project> findByMinImpactScore(@Param("minScore") Integer minScore, Pageable pageable);

    @Query("SELECT p FROM Project p ORDER BY p.createdAt DESC")
    Page<Project> findRecentProjects(Pageable pageable);

    @Query("SELECT p FROM Project p WHERE p.uniquenessScore >= 8 ORDER BY p.uniquenessScore DESC")
    Page<Project> findUnderrated(Pageable pageable);

    @Query("""
           SELECT p FROM Project p
           WHERE (:keyword IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(p.shortHook) LIKE LOWER(CONCAT('%', :keyword, '%')))
             AND (:difficulty IS NULL OR p.difficulty = :difficulty)
             AND (:category IS NULL OR p.category = :category)
             AND (:techStack IS NULL OR LOWER(p.techStack) LIKE LOWER(CONCAT('%', :techStack, '%')))
             AND (:minImpactScore IS NULL OR p.impactScore >= :minImpactScore)
             AND (:isTrending IS NULL OR p.isTrending = :isTrending)
           ORDER BY p.isTrending DESC, p.impactScore DESC, p.viewCount DESC, p.createdAt DESC
           """)
    Page<Project> searchWithFilters(@Param("keyword") String keyword,
                                    @Param("difficulty") DifficultyLevel difficulty,
                                    @Param("category") ProjectCategory category,
                                    @Param("techStack") String techStack,
                                    @Param("minImpactScore") Integer minImpactScore,
                                    @Param("isTrending") Boolean isTrending,
                                    Pageable pageable);

    boolean existsByTitle(String title);
}

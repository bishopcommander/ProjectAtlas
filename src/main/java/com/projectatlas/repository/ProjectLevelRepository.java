package com.projectatlas.repository;

import com.projectatlas.entity.ProjectLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectLevelRepository extends JpaRepository<ProjectLevel, Long> {
    List<ProjectLevel> findByProject_ProjectId(Long projectId);
}

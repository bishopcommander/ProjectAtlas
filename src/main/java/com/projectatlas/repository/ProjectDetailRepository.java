package com.projectatlas.repository;

import com.projectatlas.entity.ProjectDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProjectDetailRepository extends JpaRepository<ProjectDetail, Long> {
    Optional<ProjectDetail> findByProject_ProjectId(Long projectId);
}

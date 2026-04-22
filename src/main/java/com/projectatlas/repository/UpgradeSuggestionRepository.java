package com.projectatlas.repository;

import com.projectatlas.entity.UpgradeSuggestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UpgradeSuggestionRepository extends JpaRepository<UpgradeSuggestion, Long> {
    List<UpgradeSuggestion> findByProject_ProjectId(Long projectId);
}

package com.projectatlas.repository;

import com.projectatlas.entity.UserCollection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserCollectionRepository extends JpaRepository<UserCollection, Long> {
    Page<UserCollection> findByUser_UserId(Long userId, Pageable pageable);
    Optional<UserCollection> findByUser_UserIdAndProject_ProjectId(Long userId, Long projectId);
    boolean existsByUser_UserIdAndProject_ProjectId(Long userId, Long projectId);
}

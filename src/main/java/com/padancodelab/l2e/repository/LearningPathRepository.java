package com.padancodelab.l2e.repository;

import com.padancodelab.l2e.domain.LearningPath;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the LearningPath entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LearningPathRepository extends JpaRepository<LearningPath, Long> {}

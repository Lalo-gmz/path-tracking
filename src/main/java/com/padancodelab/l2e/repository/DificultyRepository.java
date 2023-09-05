package com.padancodelab.l2e.repository;

import com.padancodelab.l2e.domain.Dificulty;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Dificulty entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DificultyRepository extends JpaRepository<Dificulty, Long> {}

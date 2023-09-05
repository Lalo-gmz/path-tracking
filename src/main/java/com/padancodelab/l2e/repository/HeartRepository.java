package com.padancodelab.l2e.repository;

import com.padancodelab.l2e.domain.Heart;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Heart entity.
 */
@Repository
public interface HeartRepository extends JpaRepository<Heart, Long> {
    default Optional<Heart> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Heart> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Heart> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct heart from Heart heart left join fetch heart.learningPath",
        countQuery = "select count(distinct heart) from Heart heart"
    )
    Page<Heart> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct heart from Heart heart left join fetch heart.learningPath")
    List<Heart> findAllWithToOneRelationships();

    @Query("select heart from Heart heart left join fetch heart.learningPath where heart.id =:id")
    Optional<Heart> findOneWithToOneRelationships(@Param("id") Long id);
}

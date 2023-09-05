package com.padancodelab.l2e.service;

import com.padancodelab.l2e.domain.Heart;
import com.padancodelab.l2e.repository.HeartRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Heart}.
 */
@Service
@Transactional
public class HeartService {

    private final Logger log = LoggerFactory.getLogger(HeartService.class);

    private final HeartRepository heartRepository;

    public HeartService(HeartRepository heartRepository) {
        this.heartRepository = heartRepository;
    }

    /**
     * Save a heart.
     *
     * @param heart the entity to save.
     * @return the persisted entity.
     */
    public Heart save(Heart heart) {
        log.debug("Request to save Heart : {}", heart);
        return heartRepository.save(heart);
    }

    /**
     * Update a heart.
     *
     * @param heart the entity to save.
     * @return the persisted entity.
     */
    public Heart update(Heart heart) {
        log.debug("Request to update Heart : {}", heart);
        return heartRepository.save(heart);
    }

    /**
     * Partially update a heart.
     *
     * @param heart the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Heart> partialUpdate(Heart heart) {
        log.debug("Request to partially update Heart : {}", heart);

        return heartRepository
            .findById(heart.getId())
            .map(existingHeart -> {
                return existingHeart;
            })
            .map(heartRepository::save);
    }

    /**
     * Get all the hearts.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Heart> findAll(Pageable pageable) {
        log.debug("Request to get all Hearts");
        return heartRepository.findAll(pageable);
    }

    /**
     * Get all the hearts with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<Heart> findAllWithEagerRelationships(Pageable pageable) {
        return heartRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one heart by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Heart> findOne(Long id) {
        log.debug("Request to get Heart : {}", id);
        return heartRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the heart by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Heart : {}", id);
        heartRepository.deleteById(id);
    }
}

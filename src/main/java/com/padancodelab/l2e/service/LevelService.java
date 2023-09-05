package com.padancodelab.l2e.service;

import com.padancodelab.l2e.domain.Level;
import com.padancodelab.l2e.repository.LevelRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Level}.
 */
@Service
@Transactional
public class LevelService {

    private final Logger log = LoggerFactory.getLogger(LevelService.class);

    private final LevelRepository levelRepository;

    public LevelService(LevelRepository levelRepository) {
        this.levelRepository = levelRepository;
    }

    /**
     * Save a level.
     *
     * @param level the entity to save.
     * @return the persisted entity.
     */
    public Level save(Level level) {
        log.debug("Request to save Level : {}", level);
        return levelRepository.save(level);
    }

    /**
     * Update a level.
     *
     * @param level the entity to save.
     * @return the persisted entity.
     */
    public Level update(Level level) {
        log.debug("Request to update Level : {}", level);
        return levelRepository.save(level);
    }

    /**
     * Partially update a level.
     *
     * @param level the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Level> partialUpdate(Level level) {
        log.debug("Request to partially update Level : {}", level);

        return levelRepository
            .findById(level.getId())
            .map(existingLevel -> {
                if (level.getName() != null) {
                    existingLevel.setName(level.getName());
                }
                if (level.getOrder() != null) {
                    existingLevel.setOrder(level.getOrder());
                }
                if (level.getMinExpe() != null) {
                    existingLevel.setMinExpe(level.getMinExpe());
                }

                return existingLevel;
            })
            .map(levelRepository::save);
    }

    /**
     * Get all the levels.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Level> findAll(Pageable pageable) {
        log.debug("Request to get all Levels");
        return levelRepository.findAll(pageable);
    }

    /**
     * Get one level by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Level> findOne(Long id) {
        log.debug("Request to get Level : {}", id);
        return levelRepository.findById(id);
    }

    /**
     * Delete the level by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Level : {}", id);
        levelRepository.deleteById(id);
    }
}

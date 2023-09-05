package com.padancodelab.l2e.service;

import com.padancodelab.l2e.domain.LearningPath;
import com.padancodelab.l2e.repository.LearningPathRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link LearningPath}.
 */
@Service
@Transactional
public class LearningPathService {

    private final Logger log = LoggerFactory.getLogger(LearningPathService.class);

    private final LearningPathRepository learningPathRepository;

    public LearningPathService(LearningPathRepository learningPathRepository) {
        this.learningPathRepository = learningPathRepository;
    }

    /**
     * Save a learningPath.
     *
     * @param learningPath the entity to save.
     * @return the persisted entity.
     */
    public LearningPath save(LearningPath learningPath) {
        log.debug("Request to save LearningPath : {}", learningPath);
        return learningPathRepository.save(learningPath);
    }

    /**
     * Update a learningPath.
     *
     * @param learningPath the entity to save.
     * @return the persisted entity.
     */
    public LearningPath update(LearningPath learningPath) {
        log.debug("Request to update LearningPath : {}", learningPath);
        return learningPathRepository.save(learningPath);
    }

    /**
     * Partially update a learningPath.
     *
     * @param learningPath the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<LearningPath> partialUpdate(LearningPath learningPath) {
        log.debug("Request to partially update LearningPath : {}", learningPath);

        return learningPathRepository
            .findById(learningPath.getId())
            .map(existingLearningPath -> {
                if (learningPath.getName() != null) {
                    existingLearningPath.setName(learningPath.getName());
                }
                if (learningPath.getDescription() != null) {
                    existingLearningPath.setDescription(learningPath.getDescription());
                }

                return existingLearningPath;
            })
            .map(learningPathRepository::save);
    }

    /**
     * Get all the learningPaths.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<LearningPath> findAll(Pageable pageable) {
        log.debug("Request to get all LearningPaths");
        return learningPathRepository.findAll(pageable);
    }

    /**
     * Get one learningPath by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<LearningPath> findOne(Long id) {
        log.debug("Request to get LearningPath : {}", id);
        return learningPathRepository.findById(id);
    }

    /**
     * Delete the learningPath by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete LearningPath : {}", id);
        learningPathRepository.deleteById(id);
    }
}

package com.padancodelab.l2e.service;

import com.padancodelab.l2e.domain.Dificulty;
import com.padancodelab.l2e.repository.DificultyRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Dificulty}.
 */
@Service
@Transactional
public class DificultyService {

    private final Logger log = LoggerFactory.getLogger(DificultyService.class);

    private final DificultyRepository dificultyRepository;

    public DificultyService(DificultyRepository dificultyRepository) {
        this.dificultyRepository = dificultyRepository;
    }

    /**
     * Save a dificulty.
     *
     * @param dificulty the entity to save.
     * @return the persisted entity.
     */
    public Dificulty save(Dificulty dificulty) {
        log.debug("Request to save Dificulty : {}", dificulty);
        return dificultyRepository.save(dificulty);
    }

    /**
     * Update a dificulty.
     *
     * @param dificulty the entity to save.
     * @return the persisted entity.
     */
    public Dificulty update(Dificulty dificulty) {
        log.debug("Request to update Dificulty : {}", dificulty);
        return dificultyRepository.save(dificulty);
    }

    /**
     * Partially update a dificulty.
     *
     * @param dificulty the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Dificulty> partialUpdate(Dificulty dificulty) {
        log.debug("Request to partially update Dificulty : {}", dificulty);

        return dificultyRepository
            .findById(dificulty.getId())
            .map(existingDificulty -> {
                if (dificulty.getName() != null) {
                    existingDificulty.setName(dificulty.getName());
                }
                if (dificulty.getPoints() != null) {
                    existingDificulty.setPoints(dificulty.getPoints());
                }

                return existingDificulty;
            })
            .map(dificultyRepository::save);
    }

    /**
     * Get all the dificulties.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Dificulty> findAll(Pageable pageable) {
        log.debug("Request to get all Dificulties");
        return dificultyRepository.findAll(pageable);
    }

    /**
     * Get one dificulty by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Dificulty> findOne(Long id) {
        log.debug("Request to get Dificulty : {}", id);
        return dificultyRepository.findById(id);
    }

    /**
     * Delete the dificulty by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Dificulty : {}", id);
        dificultyRepository.deleteById(id);
    }
}

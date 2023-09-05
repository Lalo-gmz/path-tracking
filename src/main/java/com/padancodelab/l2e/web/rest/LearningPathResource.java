package com.padancodelab.l2e.web.rest;

import com.padancodelab.l2e.domain.LearningPath;
import com.padancodelab.l2e.repository.LearningPathRepository;
import com.padancodelab.l2e.service.LearningPathService;
import com.padancodelab.l2e.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.padancodelab.l2e.domain.LearningPath}.
 */
@RestController
@RequestMapping("/api")
public class LearningPathResource {

    private final Logger log = LoggerFactory.getLogger(LearningPathResource.class);

    private static final String ENTITY_NAME = "learningPath";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LearningPathService learningPathService;

    private final LearningPathRepository learningPathRepository;

    public LearningPathResource(LearningPathService learningPathService, LearningPathRepository learningPathRepository) {
        this.learningPathService = learningPathService;
        this.learningPathRepository = learningPathRepository;
    }

    /**
     * {@code POST  /learning-paths} : Create a new learningPath.
     *
     * @param learningPath the learningPath to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new learningPath, or with status {@code 400 (Bad Request)} if the learningPath has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/learning-paths")
    public ResponseEntity<LearningPath> createLearningPath(@Valid @RequestBody LearningPath learningPath) throws URISyntaxException {
        log.debug("REST request to save LearningPath : {}", learningPath);
        if (learningPath.getId() != null) {
            throw new BadRequestAlertException("A new learningPath cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LearningPath result = learningPathService.save(learningPath);
        return ResponseEntity
            .created(new URI("/api/learning-paths/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /learning-paths/:id} : Updates an existing learningPath.
     *
     * @param id the id of the learningPath to save.
     * @param learningPath the learningPath to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated learningPath,
     * or with status {@code 400 (Bad Request)} if the learningPath is not valid,
     * or with status {@code 500 (Internal Server Error)} if the learningPath couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/learning-paths/{id}")
    public ResponseEntity<LearningPath> updateLearningPath(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody LearningPath learningPath
    ) throws URISyntaxException {
        log.debug("REST request to update LearningPath : {}, {}", id, learningPath);
        if (learningPath.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, learningPath.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!learningPathRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LearningPath result = learningPathService.update(learningPath);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, learningPath.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /learning-paths/:id} : Partial updates given fields of an existing learningPath, field will ignore if it is null
     *
     * @param id the id of the learningPath to save.
     * @param learningPath the learningPath to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated learningPath,
     * or with status {@code 400 (Bad Request)} if the learningPath is not valid,
     * or with status {@code 404 (Not Found)} if the learningPath is not found,
     * or with status {@code 500 (Internal Server Error)} if the learningPath couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/learning-paths/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LearningPath> partialUpdateLearningPath(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody LearningPath learningPath
    ) throws URISyntaxException {
        log.debug("REST request to partial update LearningPath partially : {}, {}", id, learningPath);
        if (learningPath.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, learningPath.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!learningPathRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LearningPath> result = learningPathService.partialUpdate(learningPath);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, learningPath.getId().toString())
        );
    }

    /**
     * {@code GET  /learning-paths} : get all the learningPaths.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of learningPaths in body.
     */
    @GetMapping("/learning-paths")
    public ResponseEntity<List<LearningPath>> getAllLearningPaths(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of LearningPaths");
        Page<LearningPath> page = learningPathService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /learning-paths/:id} : get the "id" learningPath.
     *
     * @param id the id of the learningPath to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the learningPath, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/learning-paths/{id}")
    public ResponseEntity<LearningPath> getLearningPath(@PathVariable Long id) {
        log.debug("REST request to get LearningPath : {}", id);
        Optional<LearningPath> learningPath = learningPathService.findOne(id);
        return ResponseUtil.wrapOrNotFound(learningPath);
    }

    /**
     * {@code DELETE  /learning-paths/:id} : delete the "id" learningPath.
     *
     * @param id the id of the learningPath to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/learning-paths/{id}")
    public ResponseEntity<Void> deleteLearningPath(@PathVariable Long id) {
        log.debug("REST request to delete LearningPath : {}", id);
        learningPathService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

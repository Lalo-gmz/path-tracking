package com.padancodelab.l2e.web.rest;

import com.padancodelab.l2e.domain.Heart;
import com.padancodelab.l2e.repository.HeartRepository;
import com.padancodelab.l2e.service.HeartService;
import com.padancodelab.l2e.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
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
 * REST controller for managing {@link com.padancodelab.l2e.domain.Heart}.
 */
@RestController
@RequestMapping("/api")
public class HeartResource {

    private final Logger log = LoggerFactory.getLogger(HeartResource.class);

    private static final String ENTITY_NAME = "heart";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HeartService heartService;

    private final HeartRepository heartRepository;

    public HeartResource(HeartService heartService, HeartRepository heartRepository) {
        this.heartService = heartService;
        this.heartRepository = heartRepository;
    }

    /**
     * {@code POST  /hearts} : Create a new heart.
     *
     * @param heart the heart to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new heart, or with status {@code 400 (Bad Request)} if the heart has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/hearts")
    public ResponseEntity<Heart> createHeart(@RequestBody Heart heart) throws URISyntaxException {
        log.debug("REST request to save Heart : {}", heart);
        if (heart.getId() != null) {
            throw new BadRequestAlertException("A new heart cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Heart result = heartService.save(heart);
        return ResponseEntity
            .created(new URI("/api/hearts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /hearts/:id} : Updates an existing heart.
     *
     * @param id the id of the heart to save.
     * @param heart the heart to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated heart,
     * or with status {@code 400 (Bad Request)} if the heart is not valid,
     * or with status {@code 500 (Internal Server Error)} if the heart couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/hearts/{id}")
    public ResponseEntity<Heart> updateHeart(@PathVariable(value = "id", required = false) final Long id, @RequestBody Heart heart)
        throws URISyntaxException {
        log.debug("REST request to update Heart : {}, {}", id, heart);
        if (heart.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, heart.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!heartRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Heart result = heartService.update(heart);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, heart.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /hearts/:id} : Partial updates given fields of an existing heart, field will ignore if it is null
     *
     * @param id the id of the heart to save.
     * @param heart the heart to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated heart,
     * or with status {@code 400 (Bad Request)} if the heart is not valid,
     * or with status {@code 404 (Not Found)} if the heart is not found,
     * or with status {@code 500 (Internal Server Error)} if the heart couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/hearts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Heart> partialUpdateHeart(@PathVariable(value = "id", required = false) final Long id, @RequestBody Heart heart)
        throws URISyntaxException {
        log.debug("REST request to partial update Heart partially : {}, {}", id, heart);
        if (heart.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, heart.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!heartRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Heart> result = heartService.partialUpdate(heart);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, heart.getId().toString())
        );
    }

    /**
     * {@code GET  /hearts} : get all the hearts.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of hearts in body.
     */
    @GetMapping("/hearts")
    public ResponseEntity<List<Heart>> getAllHearts(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get a page of Hearts");
        Page<Heart> page;
        if (eagerload) {
            page = heartService.findAllWithEagerRelationships(pageable);
        } else {
            page = heartService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /hearts/:id} : get the "id" heart.
     *
     * @param id the id of the heart to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the heart, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/hearts/{id}")
    public ResponseEntity<Heart> getHeart(@PathVariable Long id) {
        log.debug("REST request to get Heart : {}", id);
        Optional<Heart> heart = heartService.findOne(id);
        return ResponseUtil.wrapOrNotFound(heart);
    }

    /**
     * {@code DELETE  /hearts/:id} : delete the "id" heart.
     *
     * @param id the id of the heart to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/hearts/{id}")
    public ResponseEntity<Void> deleteHeart(@PathVariable Long id) {
        log.debug("REST request to delete Heart : {}", id);
        heartService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

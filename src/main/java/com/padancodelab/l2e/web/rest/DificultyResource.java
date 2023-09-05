package com.padancodelab.l2e.web.rest;

import com.padancodelab.l2e.domain.Dificulty;
import com.padancodelab.l2e.repository.DificultyRepository;
import com.padancodelab.l2e.service.DificultyService;
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
 * REST controller for managing {@link com.padancodelab.l2e.domain.Dificulty}.
 */
@RestController
@RequestMapping("/api")
public class DificultyResource {

    private final Logger log = LoggerFactory.getLogger(DificultyResource.class);

    private static final String ENTITY_NAME = "dificulty";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DificultyService dificultyService;

    private final DificultyRepository dificultyRepository;

    public DificultyResource(DificultyService dificultyService, DificultyRepository dificultyRepository) {
        this.dificultyService = dificultyService;
        this.dificultyRepository = dificultyRepository;
    }

    /**
     * {@code POST  /dificulties} : Create a new dificulty.
     *
     * @param dificulty the dificulty to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new dificulty, or with status {@code 400 (Bad Request)} if the dificulty has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/dificulties")
    public ResponseEntity<Dificulty> createDificulty(@Valid @RequestBody Dificulty dificulty) throws URISyntaxException {
        log.debug("REST request to save Dificulty : {}", dificulty);
        if (dificulty.getId() != null) {
            throw new BadRequestAlertException("A new dificulty cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Dificulty result = dificultyService.save(dificulty);
        return ResponseEntity
            .created(new URI("/api/dificulties/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /dificulties/:id} : Updates an existing dificulty.
     *
     * @param id the id of the dificulty to save.
     * @param dificulty the dificulty to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dificulty,
     * or with status {@code 400 (Bad Request)} if the dificulty is not valid,
     * or with status {@code 500 (Internal Server Error)} if the dificulty couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/dificulties/{id}")
    public ResponseEntity<Dificulty> updateDificulty(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Dificulty dificulty
    ) throws URISyntaxException {
        log.debug("REST request to update Dificulty : {}, {}", id, dificulty);
        if (dificulty.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dificulty.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dificultyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Dificulty result = dificultyService.update(dificulty);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dificulty.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /dificulties/:id} : Partial updates given fields of an existing dificulty, field will ignore if it is null
     *
     * @param id the id of the dificulty to save.
     * @param dificulty the dificulty to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dificulty,
     * or with status {@code 400 (Bad Request)} if the dificulty is not valid,
     * or with status {@code 404 (Not Found)} if the dificulty is not found,
     * or with status {@code 500 (Internal Server Error)} if the dificulty couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/dificulties/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Dificulty> partialUpdateDificulty(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Dificulty dificulty
    ) throws URISyntaxException {
        log.debug("REST request to partial update Dificulty partially : {}, {}", id, dificulty);
        if (dificulty.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dificulty.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dificultyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Dificulty> result = dificultyService.partialUpdate(dificulty);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dificulty.getId().toString())
        );
    }

    /**
     * {@code GET  /dificulties} : get all the dificulties.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of dificulties in body.
     */
    @GetMapping("/dificulties")
    public ResponseEntity<List<Dificulty>> getAllDificulties(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Dificulties");
        Page<Dificulty> page = dificultyService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /dificulties/:id} : get the "id" dificulty.
     *
     * @param id the id of the dificulty to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the dificulty, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/dificulties/{id}")
    public ResponseEntity<Dificulty> getDificulty(@PathVariable Long id) {
        log.debug("REST request to get Dificulty : {}", id);
        Optional<Dificulty> dificulty = dificultyService.findOne(id);
        return ResponseUtil.wrapOrNotFound(dificulty);
    }

    /**
     * {@code DELETE  /dificulties/:id} : delete the "id" dificulty.
     *
     * @param id the id of the dificulty to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/dificulties/{id}")
    public ResponseEntity<Void> deleteDificulty(@PathVariable Long id) {
        log.debug("REST request to delete Dificulty : {}", id);
        dificultyService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

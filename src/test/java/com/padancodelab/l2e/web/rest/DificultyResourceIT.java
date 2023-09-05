package com.padancodelab.l2e.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.padancodelab.l2e.IntegrationTest;
import com.padancodelab.l2e.domain.Dificulty;
import com.padancodelab.l2e.repository.DificultyRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link DificultyResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DificultyResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_POINTS = 1;
    private static final Integer UPDATED_POINTS = 2;

    private static final String ENTITY_API_URL = "/api/dificulties";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DificultyRepository dificultyRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDificultyMockMvc;

    private Dificulty dificulty;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Dificulty createEntity(EntityManager em) {
        Dificulty dificulty = new Dificulty().name(DEFAULT_NAME).points(DEFAULT_POINTS);
        return dificulty;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Dificulty createUpdatedEntity(EntityManager em) {
        Dificulty dificulty = new Dificulty().name(UPDATED_NAME).points(UPDATED_POINTS);
        return dificulty;
    }

    @BeforeEach
    public void initTest() {
        dificulty = createEntity(em);
    }

    @Test
    @Transactional
    void createDificulty() throws Exception {
        int databaseSizeBeforeCreate = dificultyRepository.findAll().size();
        // Create the Dificulty
        restDificultyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dificulty)))
            .andExpect(status().isCreated());

        // Validate the Dificulty in the database
        List<Dificulty> dificultyList = dificultyRepository.findAll();
        assertThat(dificultyList).hasSize(databaseSizeBeforeCreate + 1);
        Dificulty testDificulty = dificultyList.get(dificultyList.size() - 1);
        assertThat(testDificulty.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testDificulty.getPoints()).isEqualTo(DEFAULT_POINTS);
    }

    @Test
    @Transactional
    void createDificultyWithExistingId() throws Exception {
        // Create the Dificulty with an existing ID
        dificulty.setId(1L);

        int databaseSizeBeforeCreate = dificultyRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDificultyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dificulty)))
            .andExpect(status().isBadRequest());

        // Validate the Dificulty in the database
        List<Dificulty> dificultyList = dificultyRepository.findAll();
        assertThat(dificultyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = dificultyRepository.findAll().size();
        // set the field null
        dificulty.setName(null);

        // Create the Dificulty, which fails.

        restDificultyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dificulty)))
            .andExpect(status().isBadRequest());

        List<Dificulty> dificultyList = dificultyRepository.findAll();
        assertThat(dificultyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDificulties() throws Exception {
        // Initialize the database
        dificultyRepository.saveAndFlush(dificulty);

        // Get all the dificultyList
        restDificultyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dificulty.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].points").value(hasItem(DEFAULT_POINTS)));
    }

    @Test
    @Transactional
    void getDificulty() throws Exception {
        // Initialize the database
        dificultyRepository.saveAndFlush(dificulty);

        // Get the dificulty
        restDificultyMockMvc
            .perform(get(ENTITY_API_URL_ID, dificulty.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(dificulty.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.points").value(DEFAULT_POINTS));
    }

    @Test
    @Transactional
    void getNonExistingDificulty() throws Exception {
        // Get the dificulty
        restDificultyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDificulty() throws Exception {
        // Initialize the database
        dificultyRepository.saveAndFlush(dificulty);

        int databaseSizeBeforeUpdate = dificultyRepository.findAll().size();

        // Update the dificulty
        Dificulty updatedDificulty = dificultyRepository.findById(dificulty.getId()).get();
        // Disconnect from session so that the updates on updatedDificulty are not directly saved in db
        em.detach(updatedDificulty);
        updatedDificulty.name(UPDATED_NAME).points(UPDATED_POINTS);

        restDificultyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDificulty.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDificulty))
            )
            .andExpect(status().isOk());

        // Validate the Dificulty in the database
        List<Dificulty> dificultyList = dificultyRepository.findAll();
        assertThat(dificultyList).hasSize(databaseSizeBeforeUpdate);
        Dificulty testDificulty = dificultyList.get(dificultyList.size() - 1);
        assertThat(testDificulty.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDificulty.getPoints()).isEqualTo(UPDATED_POINTS);
    }

    @Test
    @Transactional
    void putNonExistingDificulty() throws Exception {
        int databaseSizeBeforeUpdate = dificultyRepository.findAll().size();
        dificulty.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDificultyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, dificulty.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dificulty))
            )
            .andExpect(status().isBadRequest());

        // Validate the Dificulty in the database
        List<Dificulty> dificultyList = dificultyRepository.findAll();
        assertThat(dificultyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDificulty() throws Exception {
        int databaseSizeBeforeUpdate = dificultyRepository.findAll().size();
        dificulty.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDificultyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dificulty))
            )
            .andExpect(status().isBadRequest());

        // Validate the Dificulty in the database
        List<Dificulty> dificultyList = dificultyRepository.findAll();
        assertThat(dificultyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDificulty() throws Exception {
        int databaseSizeBeforeUpdate = dificultyRepository.findAll().size();
        dificulty.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDificultyMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dificulty)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Dificulty in the database
        List<Dificulty> dificultyList = dificultyRepository.findAll();
        assertThat(dificultyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDificultyWithPatch() throws Exception {
        // Initialize the database
        dificultyRepository.saveAndFlush(dificulty);

        int databaseSizeBeforeUpdate = dificultyRepository.findAll().size();

        // Update the dificulty using partial update
        Dificulty partialUpdatedDificulty = new Dificulty();
        partialUpdatedDificulty.setId(dificulty.getId());

        partialUpdatedDificulty.name(UPDATED_NAME);

        restDificultyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDificulty.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDificulty))
            )
            .andExpect(status().isOk());

        // Validate the Dificulty in the database
        List<Dificulty> dificultyList = dificultyRepository.findAll();
        assertThat(dificultyList).hasSize(databaseSizeBeforeUpdate);
        Dificulty testDificulty = dificultyList.get(dificultyList.size() - 1);
        assertThat(testDificulty.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDificulty.getPoints()).isEqualTo(DEFAULT_POINTS);
    }

    @Test
    @Transactional
    void fullUpdateDificultyWithPatch() throws Exception {
        // Initialize the database
        dificultyRepository.saveAndFlush(dificulty);

        int databaseSizeBeforeUpdate = dificultyRepository.findAll().size();

        // Update the dificulty using partial update
        Dificulty partialUpdatedDificulty = new Dificulty();
        partialUpdatedDificulty.setId(dificulty.getId());

        partialUpdatedDificulty.name(UPDATED_NAME).points(UPDATED_POINTS);

        restDificultyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDificulty.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDificulty))
            )
            .andExpect(status().isOk());

        // Validate the Dificulty in the database
        List<Dificulty> dificultyList = dificultyRepository.findAll();
        assertThat(dificultyList).hasSize(databaseSizeBeforeUpdate);
        Dificulty testDificulty = dificultyList.get(dificultyList.size() - 1);
        assertThat(testDificulty.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDificulty.getPoints()).isEqualTo(UPDATED_POINTS);
    }

    @Test
    @Transactional
    void patchNonExistingDificulty() throws Exception {
        int databaseSizeBeforeUpdate = dificultyRepository.findAll().size();
        dificulty.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDificultyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, dificulty.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dificulty))
            )
            .andExpect(status().isBadRequest());

        // Validate the Dificulty in the database
        List<Dificulty> dificultyList = dificultyRepository.findAll();
        assertThat(dificultyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDificulty() throws Exception {
        int databaseSizeBeforeUpdate = dificultyRepository.findAll().size();
        dificulty.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDificultyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dificulty))
            )
            .andExpect(status().isBadRequest());

        // Validate the Dificulty in the database
        List<Dificulty> dificultyList = dificultyRepository.findAll();
        assertThat(dificultyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDificulty() throws Exception {
        int databaseSizeBeforeUpdate = dificultyRepository.findAll().size();
        dificulty.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDificultyMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(dificulty))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Dificulty in the database
        List<Dificulty> dificultyList = dificultyRepository.findAll();
        assertThat(dificultyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDificulty() throws Exception {
        // Initialize the database
        dificultyRepository.saveAndFlush(dificulty);

        int databaseSizeBeforeDelete = dificultyRepository.findAll().size();

        // Delete the dificulty
        restDificultyMockMvc
            .perform(delete(ENTITY_API_URL_ID, dificulty.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Dificulty> dificultyList = dificultyRepository.findAll();
        assertThat(dificultyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

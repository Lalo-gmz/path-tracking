package com.padancodelab.l2e.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.padancodelab.l2e.IntegrationTest;
import com.padancodelab.l2e.domain.LearningPath;
import com.padancodelab.l2e.repository.LearningPathRepository;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link LearningPathResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LearningPathResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/learning-paths";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LearningPathRepository learningPathRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLearningPathMockMvc;

    private LearningPath learningPath;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LearningPath createEntity(EntityManager em) {
        LearningPath learningPath = new LearningPath().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION);
        return learningPath;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LearningPath createUpdatedEntity(EntityManager em) {
        LearningPath learningPath = new LearningPath().name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
        return learningPath;
    }

    @BeforeEach
    public void initTest() {
        learningPath = createEntity(em);
    }

    @Test
    @Transactional
    void createLearningPath() throws Exception {
        int databaseSizeBeforeCreate = learningPathRepository.findAll().size();
        // Create the LearningPath
        restLearningPathMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(learningPath)))
            .andExpect(status().isCreated());

        // Validate the LearningPath in the database
        List<LearningPath> learningPathList = learningPathRepository.findAll();
        assertThat(learningPathList).hasSize(databaseSizeBeforeCreate + 1);
        LearningPath testLearningPath = learningPathList.get(learningPathList.size() - 1);
        assertThat(testLearningPath.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testLearningPath.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createLearningPathWithExistingId() throws Exception {
        // Create the LearningPath with an existing ID
        learningPath.setId(1L);

        int databaseSizeBeforeCreate = learningPathRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLearningPathMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(learningPath)))
            .andExpect(status().isBadRequest());

        // Validate the LearningPath in the database
        List<LearningPath> learningPathList = learningPathRepository.findAll();
        assertThat(learningPathList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = learningPathRepository.findAll().size();
        // set the field null
        learningPath.setName(null);

        // Create the LearningPath, which fails.

        restLearningPathMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(learningPath)))
            .andExpect(status().isBadRequest());

        List<LearningPath> learningPathList = learningPathRepository.findAll();
        assertThat(learningPathList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLearningPaths() throws Exception {
        // Initialize the database
        learningPathRepository.saveAndFlush(learningPath);

        // Get all the learningPathList
        restLearningPathMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(learningPath.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }

    @Test
    @Transactional
    void getLearningPath() throws Exception {
        // Initialize the database
        learningPathRepository.saveAndFlush(learningPath);

        // Get the learningPath
        restLearningPathMockMvc
            .perform(get(ENTITY_API_URL_ID, learningPath.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(learningPath.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    void getNonExistingLearningPath() throws Exception {
        // Get the learningPath
        restLearningPathMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLearningPath() throws Exception {
        // Initialize the database
        learningPathRepository.saveAndFlush(learningPath);

        int databaseSizeBeforeUpdate = learningPathRepository.findAll().size();

        // Update the learningPath
        LearningPath updatedLearningPath = learningPathRepository.findById(learningPath.getId()).get();
        // Disconnect from session so that the updates on updatedLearningPath are not directly saved in db
        em.detach(updatedLearningPath);
        updatedLearningPath.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restLearningPathMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLearningPath.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLearningPath))
            )
            .andExpect(status().isOk());

        // Validate the LearningPath in the database
        List<LearningPath> learningPathList = learningPathRepository.findAll();
        assertThat(learningPathList).hasSize(databaseSizeBeforeUpdate);
        LearningPath testLearningPath = learningPathList.get(learningPathList.size() - 1);
        assertThat(testLearningPath.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLearningPath.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingLearningPath() throws Exception {
        int databaseSizeBeforeUpdate = learningPathRepository.findAll().size();
        learningPath.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLearningPathMockMvc
            .perform(
                put(ENTITY_API_URL_ID, learningPath.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(learningPath))
            )
            .andExpect(status().isBadRequest());

        // Validate the LearningPath in the database
        List<LearningPath> learningPathList = learningPathRepository.findAll();
        assertThat(learningPathList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLearningPath() throws Exception {
        int databaseSizeBeforeUpdate = learningPathRepository.findAll().size();
        learningPath.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLearningPathMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(learningPath))
            )
            .andExpect(status().isBadRequest());

        // Validate the LearningPath in the database
        List<LearningPath> learningPathList = learningPathRepository.findAll();
        assertThat(learningPathList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLearningPath() throws Exception {
        int databaseSizeBeforeUpdate = learningPathRepository.findAll().size();
        learningPath.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLearningPathMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(learningPath)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LearningPath in the database
        List<LearningPath> learningPathList = learningPathRepository.findAll();
        assertThat(learningPathList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLearningPathWithPatch() throws Exception {
        // Initialize the database
        learningPathRepository.saveAndFlush(learningPath);

        int databaseSizeBeforeUpdate = learningPathRepository.findAll().size();

        // Update the learningPath using partial update
        LearningPath partialUpdatedLearningPath = new LearningPath();
        partialUpdatedLearningPath.setId(learningPath.getId());

        partialUpdatedLearningPath.name(UPDATED_NAME);

        restLearningPathMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLearningPath.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLearningPath))
            )
            .andExpect(status().isOk());

        // Validate the LearningPath in the database
        List<LearningPath> learningPathList = learningPathRepository.findAll();
        assertThat(learningPathList).hasSize(databaseSizeBeforeUpdate);
        LearningPath testLearningPath = learningPathList.get(learningPathList.size() - 1);
        assertThat(testLearningPath.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLearningPath.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateLearningPathWithPatch() throws Exception {
        // Initialize the database
        learningPathRepository.saveAndFlush(learningPath);

        int databaseSizeBeforeUpdate = learningPathRepository.findAll().size();

        // Update the learningPath using partial update
        LearningPath partialUpdatedLearningPath = new LearningPath();
        partialUpdatedLearningPath.setId(learningPath.getId());

        partialUpdatedLearningPath.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restLearningPathMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLearningPath.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLearningPath))
            )
            .andExpect(status().isOk());

        // Validate the LearningPath in the database
        List<LearningPath> learningPathList = learningPathRepository.findAll();
        assertThat(learningPathList).hasSize(databaseSizeBeforeUpdate);
        LearningPath testLearningPath = learningPathList.get(learningPathList.size() - 1);
        assertThat(testLearningPath.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLearningPath.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingLearningPath() throws Exception {
        int databaseSizeBeforeUpdate = learningPathRepository.findAll().size();
        learningPath.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLearningPathMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, learningPath.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(learningPath))
            )
            .andExpect(status().isBadRequest());

        // Validate the LearningPath in the database
        List<LearningPath> learningPathList = learningPathRepository.findAll();
        assertThat(learningPathList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLearningPath() throws Exception {
        int databaseSizeBeforeUpdate = learningPathRepository.findAll().size();
        learningPath.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLearningPathMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(learningPath))
            )
            .andExpect(status().isBadRequest());

        // Validate the LearningPath in the database
        List<LearningPath> learningPathList = learningPathRepository.findAll();
        assertThat(learningPathList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLearningPath() throws Exception {
        int databaseSizeBeforeUpdate = learningPathRepository.findAll().size();
        learningPath.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLearningPathMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(learningPath))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LearningPath in the database
        List<LearningPath> learningPathList = learningPathRepository.findAll();
        assertThat(learningPathList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLearningPath() throws Exception {
        // Initialize the database
        learningPathRepository.saveAndFlush(learningPath);

        int databaseSizeBeforeDelete = learningPathRepository.findAll().size();

        // Delete the learningPath
        restLearningPathMockMvc
            .perform(delete(ENTITY_API_URL_ID, learningPath.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LearningPath> learningPathList = learningPathRepository.findAll();
        assertThat(learningPathList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

package com.padancodelab.l2e.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.padancodelab.l2e.IntegrationTest;
import com.padancodelab.l2e.domain.Heart;
import com.padancodelab.l2e.repository.HeartRepository;
import com.padancodelab.l2e.service.HeartService;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link HeartResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class HeartResourceIT {

    private static final String ENTITY_API_URL = "/api/hearts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private HeartRepository heartRepository;

    @Mock
    private HeartRepository heartRepositoryMock;

    @Mock
    private HeartService heartServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHeartMockMvc;

    private Heart heart;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Heart createEntity(EntityManager em) {
        Heart heart = new Heart();
        return heart;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Heart createUpdatedEntity(EntityManager em) {
        Heart heart = new Heart();
        return heart;
    }

    @BeforeEach
    public void initTest() {
        heart = createEntity(em);
    }

    @Test
    @Transactional
    void createHeart() throws Exception {
        int databaseSizeBeforeCreate = heartRepository.findAll().size();
        // Create the Heart
        restHeartMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(heart)))
            .andExpect(status().isCreated());

        // Validate the Heart in the database
        List<Heart> heartList = heartRepository.findAll();
        assertThat(heartList).hasSize(databaseSizeBeforeCreate + 1);
        Heart testHeart = heartList.get(heartList.size() - 1);
    }

    @Test
    @Transactional
    void createHeartWithExistingId() throws Exception {
        // Create the Heart with an existing ID
        heart.setId(1L);

        int databaseSizeBeforeCreate = heartRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHeartMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(heart)))
            .andExpect(status().isBadRequest());

        // Validate the Heart in the database
        List<Heart> heartList = heartRepository.findAll();
        assertThat(heartList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllHearts() throws Exception {
        // Initialize the database
        heartRepository.saveAndFlush(heart);

        // Get all the heartList
        restHeartMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(heart.getId().intValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllHeartsWithEagerRelationshipsIsEnabled() throws Exception {
        when(heartServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restHeartMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(heartServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllHeartsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(heartServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restHeartMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(heartRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getHeart() throws Exception {
        // Initialize the database
        heartRepository.saveAndFlush(heart);

        // Get the heart
        restHeartMockMvc
            .perform(get(ENTITY_API_URL_ID, heart.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(heart.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingHeart() throws Exception {
        // Get the heart
        restHeartMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingHeart() throws Exception {
        // Initialize the database
        heartRepository.saveAndFlush(heart);

        int databaseSizeBeforeUpdate = heartRepository.findAll().size();

        // Update the heart
        Heart updatedHeart = heartRepository.findById(heart.getId()).get();
        // Disconnect from session so that the updates on updatedHeart are not directly saved in db
        em.detach(updatedHeart);

        restHeartMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedHeart.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedHeart))
            )
            .andExpect(status().isOk());

        // Validate the Heart in the database
        List<Heart> heartList = heartRepository.findAll();
        assertThat(heartList).hasSize(databaseSizeBeforeUpdate);
        Heart testHeart = heartList.get(heartList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingHeart() throws Exception {
        int databaseSizeBeforeUpdate = heartRepository.findAll().size();
        heart.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHeartMockMvc
            .perform(
                put(ENTITY_API_URL_ID, heart.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(heart))
            )
            .andExpect(status().isBadRequest());

        // Validate the Heart in the database
        List<Heart> heartList = heartRepository.findAll();
        assertThat(heartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchHeart() throws Exception {
        int databaseSizeBeforeUpdate = heartRepository.findAll().size();
        heart.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHeartMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(heart))
            )
            .andExpect(status().isBadRequest());

        // Validate the Heart in the database
        List<Heart> heartList = heartRepository.findAll();
        assertThat(heartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamHeart() throws Exception {
        int databaseSizeBeforeUpdate = heartRepository.findAll().size();
        heart.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHeartMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(heart)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Heart in the database
        List<Heart> heartList = heartRepository.findAll();
        assertThat(heartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateHeartWithPatch() throws Exception {
        // Initialize the database
        heartRepository.saveAndFlush(heart);

        int databaseSizeBeforeUpdate = heartRepository.findAll().size();

        // Update the heart using partial update
        Heart partialUpdatedHeart = new Heart();
        partialUpdatedHeart.setId(heart.getId());

        restHeartMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHeart.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHeart))
            )
            .andExpect(status().isOk());

        // Validate the Heart in the database
        List<Heart> heartList = heartRepository.findAll();
        assertThat(heartList).hasSize(databaseSizeBeforeUpdate);
        Heart testHeart = heartList.get(heartList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateHeartWithPatch() throws Exception {
        // Initialize the database
        heartRepository.saveAndFlush(heart);

        int databaseSizeBeforeUpdate = heartRepository.findAll().size();

        // Update the heart using partial update
        Heart partialUpdatedHeart = new Heart();
        partialUpdatedHeart.setId(heart.getId());

        restHeartMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHeart.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHeart))
            )
            .andExpect(status().isOk());

        // Validate the Heart in the database
        List<Heart> heartList = heartRepository.findAll();
        assertThat(heartList).hasSize(databaseSizeBeforeUpdate);
        Heart testHeart = heartList.get(heartList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingHeart() throws Exception {
        int databaseSizeBeforeUpdate = heartRepository.findAll().size();
        heart.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHeartMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, heart.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(heart))
            )
            .andExpect(status().isBadRequest());

        // Validate the Heart in the database
        List<Heart> heartList = heartRepository.findAll();
        assertThat(heartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchHeart() throws Exception {
        int databaseSizeBeforeUpdate = heartRepository.findAll().size();
        heart.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHeartMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(heart))
            )
            .andExpect(status().isBadRequest());

        // Validate the Heart in the database
        List<Heart> heartList = heartRepository.findAll();
        assertThat(heartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamHeart() throws Exception {
        int databaseSizeBeforeUpdate = heartRepository.findAll().size();
        heart.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHeartMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(heart)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Heart in the database
        List<Heart> heartList = heartRepository.findAll();
        assertThat(heartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteHeart() throws Exception {
        // Initialize the database
        heartRepository.saveAndFlush(heart);

        int databaseSizeBeforeDelete = heartRepository.findAll().size();

        // Delete the heart
        restHeartMockMvc
            .perform(delete(ENTITY_API_URL_ID, heart.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Heart> heartList = heartRepository.findAll();
        assertThat(heartList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

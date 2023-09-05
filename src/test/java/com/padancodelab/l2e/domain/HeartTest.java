package com.padancodelab.l2e.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.padancodelab.l2e.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class HeartTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Heart.class);
        Heart heart1 = new Heart();
        heart1.setId(1L);
        Heart heart2 = new Heart();
        heart2.setId(heart1.getId());
        assertThat(heart1).isEqualTo(heart2);
        heart2.setId(2L);
        assertThat(heart1).isNotEqualTo(heart2);
        heart1.setId(null);
        assertThat(heart1).isNotEqualTo(heart2);
    }
}

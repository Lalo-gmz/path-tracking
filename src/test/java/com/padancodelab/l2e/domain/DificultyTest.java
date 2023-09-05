package com.padancodelab.l2e.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.padancodelab.l2e.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DificultyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Dificulty.class);
        Dificulty dificulty1 = new Dificulty();
        dificulty1.setId(1L);
        Dificulty dificulty2 = new Dificulty();
        dificulty2.setId(dificulty1.getId());
        assertThat(dificulty1).isEqualTo(dificulty2);
        dificulty2.setId(2L);
        assertThat(dificulty1).isNotEqualTo(dificulty2);
        dificulty1.setId(null);
        assertThat(dificulty1).isNotEqualTo(dificulty2);
    }
}

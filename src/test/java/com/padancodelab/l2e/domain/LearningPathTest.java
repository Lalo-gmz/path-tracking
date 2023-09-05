package com.padancodelab.l2e.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.padancodelab.l2e.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LearningPathTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LearningPath.class);
        LearningPath learningPath1 = new LearningPath();
        learningPath1.setId(1L);
        LearningPath learningPath2 = new LearningPath();
        learningPath2.setId(learningPath1.getId());
        assertThat(learningPath1).isEqualTo(learningPath2);
        learningPath2.setId(2L);
        assertThat(learningPath1).isNotEqualTo(learningPath2);
        learningPath1.setId(null);
        assertThat(learningPath1).isNotEqualTo(learningPath2);
    }
}

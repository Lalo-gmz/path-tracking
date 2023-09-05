package com.padancodelab.l2e.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A ApplicationUser.
 */
@Entity
@Table(name = "application_user")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ApplicationUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Min(value = 42)
    @Max(value = 42)
    @Column(name = "additional_field")
    private Integer additionalField;

    @Column(name = "nickname")
    private String nickname;

    @Column(name = "img")
    private String img;

    @Column(name = "experience")
    private Long experience;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "bio")
    private String bio;

    @OneToOne
    @JoinColumn(unique = true)
    private User internalUser;

    @OneToMany(mappedBy = "createdBy")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "comments", "tasks", "applicationUser", "createdBy" }, allowSetters = true)
    private Set<LearningPath> learningPaths = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "applicationUsers" }, allowSetters = true)
    private Level level;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ApplicationUser id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getAdditionalField() {
        return this.additionalField;
    }

    public ApplicationUser additionalField(Integer additionalField) {
        this.setAdditionalField(additionalField);
        return this;
    }

    public void setAdditionalField(Integer additionalField) {
        this.additionalField = additionalField;
    }

    public String getNickname() {
        return this.nickname;
    }

    public ApplicationUser nickname(String nickname) {
        this.setNickname(nickname);
        return this;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getImg() {
        return this.img;
    }

    public ApplicationUser img(String img) {
        this.setImg(img);
        return this;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public Long getExperience() {
        return this.experience;
    }

    public ApplicationUser experience(Long experience) {
        this.setExperience(experience);
        return this;
    }

    public void setExperience(Long experience) {
        this.experience = experience;
    }

    public String getBio() {
        return this.bio;
    }

    public ApplicationUser bio(String bio) {
        this.setBio(bio);
        return this;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public User getInternalUser() {
        return this.internalUser;
    }

    public void setInternalUser(User user) {
        this.internalUser = user;
    }

    public ApplicationUser internalUser(User user) {
        this.setInternalUser(user);
        return this;
    }

    public Set<LearningPath> getLearningPaths() {
        return this.learningPaths;
    }

    public void setLearningPaths(Set<LearningPath> learningPaths) {
        if (this.learningPaths != null) {
            this.learningPaths.forEach(i -> i.setCreatedBy(null));
        }
        if (learningPaths != null) {
            learningPaths.forEach(i -> i.setCreatedBy(this));
        }
        this.learningPaths = learningPaths;
    }

    public ApplicationUser learningPaths(Set<LearningPath> learningPaths) {
        this.setLearningPaths(learningPaths);
        return this;
    }

    public ApplicationUser addLearningPaths(LearningPath learningPath) {
        this.learningPaths.add(learningPath);
        learningPath.setCreatedBy(this);
        return this;
    }

    public ApplicationUser removeLearningPaths(LearningPath learningPath) {
        this.learningPaths.remove(learningPath);
        learningPath.setCreatedBy(null);
        return this;
    }

    public Level getLevel() {
        return this.level;
    }

    public void setLevel(Level level) {
        this.level = level;
    }

    public ApplicationUser level(Level level) {
        this.setLevel(level);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ApplicationUser)) {
            return false;
        }
        return id != null && id.equals(((ApplicationUser) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ApplicationUser{" +
            "id=" + getId() +
            ", additionalField=" + getAdditionalField() +
            ", nickname='" + getNickname() + "'" +
            ", img='" + getImg() + "'" +
            ", experience=" + getExperience() +
            ", bio='" + getBio() + "'" +
            "}";
    }
}

package com.upchaaraayog.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.NaturalId;

/**
 * Reference data for Schemes (PMJAY, CGHS, etc.).
 */
@Entity
@Table(
        name = "schemes",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_scheme_code", columnNames = "code")
        }
)
@Cache(usage = CacheConcurrencyStrategy.READ_ONLY)
public class Scheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NaturalId
    @Column(name = "code", unique = true, nullable = false, length = 20)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    public Scheme() {
    }

    public Scheme(Integer id, String code, String name) {
        this.id = id;
        this.code = code;
        this.name = name;
    }

    public Integer getId() { return id; }
    public String getCode() { return code; }
    public String getName() { return name; }

    public void setId(Integer id) { this.id = id; }
    public void setCode(String code) { this.code = code; }
    public void setName(String name) { this.name = name; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Scheme s)) return false;
        return code != null && code.equals(s.code);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
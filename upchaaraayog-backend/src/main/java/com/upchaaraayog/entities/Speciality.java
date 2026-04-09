package com.upchaaraayog.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.NaturalId;

/**
 * Reference data for hospital specialities (e.g., Cardiology, Orthopaedics, etc.)
 */
@Entity
@Table(
        name = "specialities",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_speciality_code", columnNames = "code")
        }
)
@Cache(usage = CacheConcurrencyStrategy.READ_ONLY)
public class Speciality {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NaturalId
    @Column(name = "code", unique = true, nullable = false, length = 50)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    public Speciality() {}
    public Speciality(Integer id, String code, String name) {
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
        if (!(o instanceof Speciality sp)) return false;
        return code != null && code.equals(sp.code);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Speciality{" +
                "id=" + id +
                ", code='" + code + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}
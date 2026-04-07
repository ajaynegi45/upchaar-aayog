package com.upchaaraayog.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.NaturalId;

/**
 * Reference data — small, stable, frequently read.
 *
 * BUGS FIXED:
 * [1]  Short id → Integer. Short max value is 32,767. While 4 schemes fit now,
 *      Integer is the standard JPA choice and costs nothing extra.
 * [2]  Missing @Column constraints on code and name — no length, no nullable guard
 * [3]  No @UniqueConstraint on code — DB could have duplicate codes
 * [4]  No @Cache annotation — every join query fetches scheme data from DB.
 *      These 4 rows should be permanently in memory (READ_ONLY L2 cache).
 *      Requires a cache provider: EhCache 3 or Caffeine.
 * [5]  No getters/setters
 * [6]  No equals()/hashCode()
 *
 * SPRING BOOT 4 / HIBERNATE 7 NOTE:
 * To enable second-level cache add to application.properties:
 *   spring.jpa.properties.hibernate.cache.use_second_level_cache=true
 *   spring.jpa.properties.hibernate.cache.region.factory_class=jcache
 *   spring.jpa.properties.javax.cache.provider=org.ehcache.jsr107.EhcacheCachingProvider
 * And add dependency: spring-boot-starter-cache + ehcache
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

    // @NaturalId allows Hibernate to resolve Scheme by code from the L2 cache
    // without a DB round-trip (use session.byNaturalId(Scheme.class).using("code","PMJAY").load())
    @NaturalId
    @Column(name = "code", unique = true, nullable = false, length = 20)
    private String code; // e.g., PMJAY, STATE, CGHS, CAPF

    @Column(name = "name", nullable = false)
    private String name;

    public Scheme() {
    }

    public Scheme(Integer id, String code, String name) {
        this.id = id;
        this.code = code;
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setName(String name) {
        this.name = name;
    }

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
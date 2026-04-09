package com.upchaaraayog.service;

import com.upchaaraayog.repository.JanAushadhiRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringJUnitConfig(JanAushadhiServiceCachingTest.Config.class)
class JanAushadhiServiceCachingTest {

    @Configuration
    @EnableCaching
    static class Config {
        @Bean
        CacheManager cacheManager() {
            return new ConcurrentMapCacheManager("states", "districts");
        }

        @Bean
        JanAushadhiService janAushadhiService(JanAushadhiRepository repository) {
            return new JanAushadhiService(repository);
        }
    }

    @Autowired
    private JanAushadhiService janAushadhiService;

    @Autowired
    private CacheManager cacheManager;

    @MockitoBean
    private JanAushadhiRepository janAushadhiRepository;

    @BeforeEach
    void clearCaches() {
        cacheManager.getCacheNames().forEach(cacheName -> {
            var cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                cache.clear();
            }
        });
    }

    @Test
    void getStatesUsesCacheAfterFirstLookup() {
        when(janAushadhiRepository.findAllStates()).thenReturn(List.of("Delhi", "Punjab"));

        assertThat(janAushadhiService.getStates()).containsExactly("Delhi", "Punjab");
        assertThat(janAushadhiService.getStates()).containsExactly("Delhi", "Punjab");

        verify(janAushadhiRepository, times(1)).findAllStates();
    }

    @Test
    void getDistrictsUsesCacheAfterFirstLookup() {
        when(janAushadhiRepository.findDistrictsByStateIgnoreCase("Delhi"))
                .thenReturn(List.of("New Delhi", "South Delhi"));

        assertThat(janAushadhiService.getDistricts("Delhi")).containsExactly("New Delhi", "South Delhi");
        assertThat(janAushadhiService.getDistricts("Delhi")).containsExactly("New Delhi", "South Delhi");

        verify(janAushadhiRepository, times(1)).findDistrictsByStateIgnoreCase("Delhi");
    }
}

package com.upchaaraayog.services;

import com.upchaaraayog.entities.JanAushadhiKendra;
import com.upchaaraayog.repositories.JanAushadhiRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JanAushadhiService {
    private final JanAushadhiRepository janAushadhiRepository;
    public JanAushadhiService(JanAushadhiRepository repository) {
        this.janAushadhiRepository = repository;
    }

    public Page<JanAushadhiKendra> getJanAushadhiKendra(String state, String district, Integer pincode, short pageNumber, short pageSize) {


        if(pincode != null && pincode >= 100000 && pincode <= 999999) {
            return janAushadhiRepository.findByStateAndDistrictAndPincode(state, district, pincode,  PageRequest.of(pageNumber, pageSize));
        }
        return janAushadhiRepository.findByStateAndDistrict(state, district, PageRequest.of(pageNumber, pageSize));
    }


    @Cacheable(value = "states", sync = true)
    public List<String> getStates(){
        return janAushadhiRepository.findAllStates();
    }

    @Cacheable(value = "districts", key = "#stateName.toLowerCase()", sync = true)
    public List<String> getDistricts(String stateName) {
        return janAushadhiRepository.findDistrictsByStateIgnoreCase(stateName);
    }
}

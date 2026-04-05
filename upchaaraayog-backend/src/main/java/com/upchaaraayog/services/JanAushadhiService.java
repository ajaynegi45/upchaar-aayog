package com.upchaaraayog.services;

import com.upchaaraayog.dto.JanAushadhiKendraDTO;
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

    public Page<JanAushadhiKendraDTO> getJanAushadhiKendra(String state, String district, Integer pincode, short pageNumber, short pageSize) {
        Page<JanAushadhiKendra> entities;
        if(pincode != null && pincode >= 100000 && pincode <= 999999) {
            entities = janAushadhiRepository.findByStateAndDistrictAndPincode(state, district, pincode,  PageRequest.of(pageNumber, pageSize));
        } else {
            entities = janAushadhiRepository.findByStateAndDistrict(state, district, PageRequest.of(pageNumber, pageSize));
        }
        return entities.map(this::convertToDTO);
    }

    private JanAushadhiKendraDTO convertToDTO(JanAushadhiKendra entity) {
        JanAushadhiKendraDTO dto = new JanAushadhiKendraDTO();
        dto.setKendraCode(entity.getKendraCode());
        dto.setKendraName(entity.getKendraName());
        dto.setState(entity.getState());
        dto.setDistrict(entity.getDistrict());
        dto.setPincode(entity.getPincode());
        dto.setAddress(entity.getAddress());
        return dto;
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

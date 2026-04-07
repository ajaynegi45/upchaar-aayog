package com.upchaaraayog.service;

import com.upchaaraayog.dto.DropdownResponse;
import com.upchaaraayog.dto.HospitalDTO;
import com.upchaaraayog.dto.HospitalFilterRequest;
import com.upchaaraayog.repository.HospitalReadRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HospitalService {

    private final HospitalReadRepository readRepository;

    public HospitalService(HospitalReadRepository readRepository) {
        this.readRepository = readRepository;
    }

    @Transactional(readOnly = true)
    public Page<HospitalDTO> listHospitals(HospitalFilterRequest filter, Pageable pageable) {
        return readRepository.findHospitals(filter, pageable);
    }

    @Transactional(readOnly = true)
    public List<String> getStates() {
        return readRepository.findAllStates();
    }

    @Transactional(readOnly = true)
    public List<String> getDistricts(String state) {
        return readRepository.findDistrictsByState(state);
    }

    @Transactional(readOnly = true)
    public List<DropdownResponse> getSchemes(String state, String district) {
        return readRepository.findSchemes(state, district);
    }

    @Transactional(readOnly = true)
    public List<DropdownResponse> getSpecialities(String state, String district) {
        return readRepository.findSpecialities(state, district);
    }

    @Transactional(readOnly = true)
    public List<String> getHospitalTypes(String state, String district) {
        return readRepository.findHospitalTypes(state, district);
    }
}
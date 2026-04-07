package com.upchaaraayog.services;

import com.upchaaraayog.dto.HospitalDTO;
import com.upchaaraayog.dto.HospitalFilterRequest;
import com.upchaaraayog.repositories.HospitalReadRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HospitalService {

    private final HospitalReadRepository readRepository;
    public HospitalService(HospitalReadRepository readRepository) {
        this.readRepository = readRepository;
    }


    /**
     * @Transactional(readOnly = true) applies at the DataSourceTransactionManager level:
     *   - readOnly = true tells the DataSourceTransactionManager to use a read-only connection
     *   - HikariCP skips setAutoCommit(false) overhead for connections that don't write
     *   - Allows routing to a read replica if your DataSource is configured for it
     *   - JdbcClient participates in Spring's transaction context automatically
     */
    @Transactional(readOnly = true)
    public Page<HospitalDTO> listHospitals(HospitalFilterRequest filter, Pageable pageable) {
        return readRepository.findHospitals(filter, pageable);
    }
}

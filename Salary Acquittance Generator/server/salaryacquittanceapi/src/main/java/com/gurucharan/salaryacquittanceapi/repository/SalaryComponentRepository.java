package com.gurucharan.salaryacquittanceapi.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.gurucharan.salaryacquittanceapi.model.SalaryComponents;

public interface SalaryComponentRepository extends JpaRepository<SalaryComponents, Long> {

    SalaryComponents findByComponentName(String componentName);

    List<SalaryComponents> findByComponentNameAndEffectiveDateLessThanEqualOrderByEffectiveDateDesc(
            String componentName, LocalDate effectiveDate);

    @Query("SELECT DISTINCT sc.componentName FROM SalaryComponents sc")
    List<String> findDistinctComponentName();
}

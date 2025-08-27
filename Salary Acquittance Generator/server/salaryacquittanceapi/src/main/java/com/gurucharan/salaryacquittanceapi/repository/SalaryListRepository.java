package com.gurucharan.salaryacquittanceapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gurucharan.salaryacquittanceapi.model.SalaryList;

public interface SalaryListRepository extends JpaRepository<SalaryList, Long> {

}

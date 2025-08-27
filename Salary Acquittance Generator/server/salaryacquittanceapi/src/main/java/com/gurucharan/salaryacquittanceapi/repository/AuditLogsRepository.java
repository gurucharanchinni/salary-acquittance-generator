package com.gurucharan.salaryacquittanceapi.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gurucharan.salaryacquittanceapi.model.AuditLogs;

@Repository
public interface AuditLogsRepository extends JpaRepository<AuditLogs, Long> {
    List<AuditLogs> findAllByOrderByCreatedDateDescCreatedTimeDesc();

    default List<AuditLogs> findAllSorted() {
        return findAll(Sort.by(Sort.Direction.DESC, "createdDate", "createdTime"));
    }
}
package com.gurucharan.salaryacquittanceapi.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gurucharan.salaryacquittanceapi.model.Staff;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {

    @Query("SELECT MAX(id) FROM Staff")
    Long findMaxId();

    List<Staff> findAllByJoiningDateAfter(LocalDate date);

    Staff findByStaffName(String staffName);

    Staff findByStaffId(String staffId);

    @Query("SELECT s.id FROM Staff s WHERE s.staffId = :staffId")
    Long findPrimaryKeyByStaffId(@Param("staffId") String staffId);

    Optional<Staff> findByEmail(String email);

    List<Staff> findAllByDepartment(String department);
}
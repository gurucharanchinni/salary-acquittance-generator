package com.gurucharan.salaryacquittanceapi.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gurucharan.salaryacquittanceapi.model.PaySlip;
import com.gurucharan.salaryacquittanceapi.utils.Approval;

@Repository
public interface PaySlipRepository extends JpaRepository<PaySlip, Long> {

        boolean existsByStaffId(String staffId);

        Page<PaySlip> findByStartDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);

        List<PaySlip> findByStaffId(String staffId);

        List<PaySlip> findAllByStaffId(String staffId);

        List<PaySlip> findAllByApproval(Approval approved);

        @Query("SELECT p FROM PaySlip p WHERE p.startDate >= :start AND p.endDate <= :end")
        List<PaySlip> findAllWithinRange(@Param("start") LocalDate start, @Param("end") LocalDate end);

        boolean existsByStaffIdAndStartDateAndEndDate(String staffId, LocalDate startDate, LocalDate endDate);

        Page<PaySlip> findAllByApproval(Approval approved, Pageable page);

        List<PaySlip> findAllByDepartment(String department);

        List<PaySlip> findByStaffIdAndStartDateGreaterThanEqualAndEndDateLessThanEqual(String staffId, LocalDate start,
                        LocalDate end);

        List<PaySlip> findAllByStartDateAndEndDate(LocalDate localDate, LocalDate localDate2);

        Page<PaySlip> findByDepartment(String department, Pageable pageable);

        Page<PaySlip> findByStartDateBetweenAndApproval(LocalDate localDate, LocalDate localDate2, Pageable pageable,
                        Approval approved);

        Page<PaySlip> findByDepartmentAndApproval(String department, Pageable pageable, Approval approved);

        List<PaySlip> findAllByStartDateBetweenAndApproval(LocalDate localDate, LocalDate localDate2,
                        Approval approved);

        List<PaySlip> findAllByDepartmentAndApproval(String department, Approval approved);

}

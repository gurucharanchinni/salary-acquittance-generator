package com.gurucharan.salaryacquittanceapi.model;

import java.time.LocalDate;

import org.springframework.stereotype.Component;

import com.gurucharan.salaryacquittanceapi.utils.Approval;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Component
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaySlip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String staffId;
    private String staffName;
    private Double basicPay;
    private Double hra;
    private Double ta;
    private Double da;
    private Double pf;
    private Double esi;
    private Double it;

    private LocalDate startDate;
    private LocalDate endDate;

    private Double grossSal;
    private Double netSal;

    private Approval approval;

    private String department;

}

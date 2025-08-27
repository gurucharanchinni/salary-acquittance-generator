package com.gurucharan.salaryacquittanceapi.model;

import java.time.LocalDate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gurucharan.salaryacquittanceapi.utils.Status;

import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Component
@Table(name = "staff")
public class Staff {

    @Id
    private Long id;
    @Column(name = "staff_id", unique = true)
    private String staffId;
    private String email;
    private String staffName;
    private String designation;
    private String department;
    private LocalDate joiningDate;
    private Double basicPay;
    @Enumerated(EnumType.STRING)
    private Status status;
    @Column(name = "status_effective_dates", nullable = true)
    private LocalDate statusEffectiveDates;
    @OneToOne(mappedBy = "staff", cascade = CascadeType.ALL)
    @JsonIgnore
    @ToString.Exclude
    private SalaryList salaryList;

    private String bankDetails;
}

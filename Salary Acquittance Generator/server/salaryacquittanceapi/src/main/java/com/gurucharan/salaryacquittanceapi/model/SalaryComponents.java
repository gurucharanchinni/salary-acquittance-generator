package com.gurucharan.salaryacquittanceapi.model;

import java.time.LocalDate;

import com.gurucharan.salaryacquittanceapi.utils.ComponentType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalaryComponents {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Enumerated(EnumType.STRING)
    private ComponentType componentType;
    private String componentName;
    private double percentage;
    private LocalDate effectiveDate;
}

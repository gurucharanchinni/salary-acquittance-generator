package com.gurucharan.salaryacquittanceapi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gurucharan.salaryacquittanceapi.model.SalaryComponents;
import com.gurucharan.salaryacquittanceapi.service.SalaryComponentServices;

@RestController
@RequestMapping("hr")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class HrController {

    private final SalaryComponentServices salaryComponentServices;

    @Autowired
    public HrController(SalaryComponentServices salaryComponentServices) {
        this.salaryComponentServices = salaryComponentServices;
    }

    @GetMapping("/")
    public ResponseEntity<List<SalaryComponents>> getAccounts() {
        List<SalaryComponents> salaryComponents = this.salaryComponentServices.getAllSalaryComponents();
        if (salaryComponents.size() == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(salaryComponents);
    }

    @PostMapping("/create")
    public ResponseEntity<String> createSalaryComponent(@RequestBody SalaryComponents salaryComponents) {

        salaryComponentServices.saveSalaryComponent(salaryComponents);
        return ResponseEntity.ok("Success");
    }
}

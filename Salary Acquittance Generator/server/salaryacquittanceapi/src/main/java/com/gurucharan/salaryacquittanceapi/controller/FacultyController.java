package com.gurucharan.salaryacquittanceapi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.gurucharan.salaryacquittanceapi.model.PaySlip;
import com.gurucharan.salaryacquittanceapi.service.PaySlipService;

@RequestMapping("/faculty")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class FacultyController {

    private final PaySlipService paySlipService;

    @Autowired
    public FacultyController(PaySlipService paySlipService) {
        this.paySlipService = paySlipService;
    }

    @GetMapping("/")
    public List<PaySlip> getAllPaySlip() {
        return paySlipService.getAllPaySlip();
    }
}

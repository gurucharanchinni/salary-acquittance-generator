package com.gurucharan.salaryacquittanceapi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gurucharan.salaryacquittanceapi.model.AuditLogs;
import com.gurucharan.salaryacquittanceapi.service.AuditLogsService;

@RestController
@RequestMapping("/auditLogs")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class AuditLogsController {
    private final AuditLogsService auditLogsService;

    @Autowired
    public AuditLogsController(AuditLogsService auditLogsService) {
        this.auditLogsService = auditLogsService;
    }

    @GetMapping
    public ResponseEntity<List<AuditLogs>> getAllAuditLogs() {
        return ResponseEntity.ok(auditLogsService.getAllAuditLogs());
    }
}

package com.gurucharan.salaryacquittanceapi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class AccountsController {

    @GetMapping("/")
    public ResponseEntity<String> getAccounts() {
        return ResponseEntity.ok("Accounts");
    }
}

package com.gurucharan.salaryacquittanceapi.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gurucharan.salaryacquittanceapi.model.Staff;
import com.gurucharan.salaryacquittanceapi.service.StaffService;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class AdminController {
    private final StaffService staffService;

    @Autowired
    public AdminController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping("/")
    public ResponseEntity<List<Staff>> getAllStaff() {
        List<Staff> staffs = staffService.getAllStaff();
        if (staffs.size() == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(staffs);
    }

    @GetMapping("/getbyid")
    public ResponseEntity<Staff> getStaffById(@RequestParam("staffId") String staffId) {
        Staff staff = staffService.findByStaffId(staffId);
        if (staff == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(staff);
    }

    @PostMapping("/afterDate")
    public ResponseEntity<List<Staff>> getAllStaffAfter(@RequestBody LocalDate date) {
        return ResponseEntity.ok(staffService.getAllStaffAfter(date));
    }

    @PostMapping("staff")
    public ResponseEntity<String> saveStaff(@RequestBody Staff staff) {
        staffService.saveStaff(staff);
        return ResponseEntity.ok("Success");
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateStaff(@RequestBody Staff staff) {
        staffService.updateStaff(staff);
        return ResponseEntity.ok("Success");
    }

    @PostMapping("/getemail")
    public ResponseEntity<String> getEmailByUsername(@RequestParam("username") String username) {
        String email = staffService.getEmailByUsername(username);
        return ResponseEntity.ok(email);
    }

    @PostMapping("/checkemail")
    public ResponseEntity<String> checkStaffByEmail(@RequestParam("email") String email) {
        return ResponseEntity.ok(staffService.findByEmail(email));
    }
}
package com.gurucharan.salaryacquittanceapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gurucharan.salaryacquittanceapi.model.Users;
import com.gurucharan.salaryacquittanceapi.service.UsersService;

@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class ProfileController {
    private final UsersService usersService;

    @Autowired
    public ProfileController(UsersService usersService) {
        this.usersService = usersService;
    }

    @PostMapping("/")
    public ResponseEntity<Users> getProfile(@RequestBody String username) {
        return ResponseEntity.ok(usersService.getProfileByName(username));
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody Users user) {

        String output = usersService.changePassword(user);
        return ResponseEntity.ok(output);
    }
}

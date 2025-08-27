package com.gurucharan.salaryacquittanceapi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gurucharan.salaryacquittanceapi.model.Users;
import com.gurucharan.salaryacquittanceapi.service.UsersService;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class UsersController {

    private final UsersService usersService;

    public UsersController(UsersService usersService) {
        this.usersService = usersService;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody Users user) {
        String output = usersService.saveUser(user);
        if (output.equals("User Exists"))
            return ResponseEntity.badRequest().body("User Already Exists");
        return ResponseEntity.ok("User Creation Success");
    }

}

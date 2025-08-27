package com.gurucharan.salaryacquittanceapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gurucharan.salaryacquittanceapi.model.Users;
import com.gurucharan.salaryacquittanceapi.service.UsersService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = { "http://localhost:5500", "http://127.0.0.1:5500" }, allowCredentials = "true")
public class LoginController {
    private final UsersService usersService;

    @Autowired
    public LoginController(UsersService usersService) {
        this.usersService = usersService;
    }

    @PostMapping("validate")
    public ResponseEntity<String> adminLogin(@RequestBody Users user, HttpSession session) {
        String username = user.getUsername();
        String role = usersService.findRoleByUsername(username);

        if (new BCryptPasswordEncoder().matches(user.getPassword(),
                usersService.getUserByUsername(username).getPassword())) {

            if (role.equals("ADMIN") || role.equals("ACCOUNTS") || role.equals("FACULTY") || role.equals("HR")) {
                session.setAttribute("role", role);
                return ResponseEntity.ok(role);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid Role");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid Password");
        }
    }

    @GetMapping("logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "logout";
    }

    @PostMapping("/forgotpassword")
    public ResponseEntity<String> forgotPassword(@RequestBody Users user) {
        System.out.println(user);
        String output = usersService.changePassword(user);
        return ResponseEntity.ok(output);
    }

}

package com.gurucharan.salaryacquittanceapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.gurucharan.salaryacquittanceapi.annotation.LoggableAction;
import com.gurucharan.salaryacquittanceapi.model.Users;
import com.gurucharan.salaryacquittanceapi.repository.UsersRepository;

@Service
public class UsersService {
    private UsersRepository usersRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

    @Autowired
    public UsersService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @LoggableAction("New User with username ")
    public String saveUser(Users user) {
        if (usersRepository.existsByUsername(user.getUsername()) || usersRepository.existsByEmail(user.getEmail())) {
            return "User Exists";
        }
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        usersRepository.save(user);
        return "User Creation Successfully";
    }

    public Users getUserById(Long id) {
        return usersRepository.findById(id).orElse(null);
    }

    public Users getUserByUsername(String username) {
        return usersRepository.findByUsername(username);
    }

    public String findRoleByUsernameAndPassword(String username, String password) {
        return usersRepository.findRoleByUsernameAndPassword(username, password);
    }

    public String findRoleByUsername(String username) {
        return usersRepository.findRoleByUsername(username);
    }

    public Users getProfileByName(String username) {
        Users user = usersRepository.findByUsername(username);
        return user;
    }

    @LoggableAction("Password Changed for user")
    public String changePassword(Users user) {
        Users dbUser = usersRepository.findByUsername(user.getUsername());
        dbUser.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        usersRepository.save(dbUser);
        return "Password Change Success";
    }

}

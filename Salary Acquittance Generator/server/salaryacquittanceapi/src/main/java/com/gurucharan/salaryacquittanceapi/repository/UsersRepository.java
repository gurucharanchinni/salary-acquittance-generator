package com.gurucharan.salaryacquittanceapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.gurucharan.salaryacquittanceapi.model.Users;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {

    Users findByUsername(String username);

    @Query("SELECT u.role FROM Users u WHERE u.username = :username AND u.password = :password")
    String findRoleByUsernameAndPassword(String username, String password);

    @Query("SELECT u.role FROM Users u WHERE u.username = :username")
    String findRoleByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

}

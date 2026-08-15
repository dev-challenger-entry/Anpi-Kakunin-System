package com.example.demo.mypage;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "employees")
@Getter
@Setter
public class Employee {

    @Id
    @Column(name = "employee_id")
    private String employeeId;

    @Column(name = "name")
    private String name;

    @Column(name = "section_name")
    private String sectionName;

    @Column(name = "safety_status")
    private String safetyStatus;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "role", nullable = false)
    private String role;

    @Column(name = "answered_time")
    private LocalDateTime answeredTime;

    @Column(name = "email")
    private String email;

    @Column(name = "email2")
    private String email2;
}
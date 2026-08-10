package com.example.demo.mypage;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "employee")
public class Employee {
    @Id
    @Column(name = "employee_id")
    private String employeeId;

    // 💡 SQLの項目名（company_name, safety_status）に合わせて追加・修正
    @Column(name = "company_name")
    private String companyName;

    @Column(name = "safety_status")
    private String safetyStatus;

    //パスワード関係
    @Column(name = "password_hash")
    private String passwordHash;

    private String name;

    // ─── ゲッターとセッター（JPAの動作に必須です） ───
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getSafetyStatus() { return safetyStatus; }
    public void setSafetyStatus(String safetyStatus) { this.safetyStatus = safetyStatus; }

    //パスワード関係
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

}

package com.example.demo.DTO;

// 社員新規登録API（POST /api/admin/employees）専用のリクエストDTO
public class EmployeeRegisterRequestDto {

    private String employeeId;
    private String name;
    private String sectionName;
    private String newPassword;

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSectionName() { return sectionName; }
    public void setSectionName(String sectionName) { this.sectionName = sectionName; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
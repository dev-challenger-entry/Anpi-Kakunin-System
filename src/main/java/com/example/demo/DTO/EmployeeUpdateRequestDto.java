package com.example.demo.DTO;

// 社員情報更新API（PUT /api/admin/employees）のリクエスト専用DTO
//更新するとき、データがフロントエンドからやってくる。だからパスポートの記載があってよい
public class EmployeeUpdateRequestDto {

    private String employeeId;
    private String name;
    private String sectionName;
    private String currentPassword;
    private String newPassword;
    private String adminPassword;

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSectionName() { return sectionName; }
    public void setSectionName(String sectionName) { this.sectionName = sectionName; }

    public String getCurrentPassword() { return currentPassword; }
    public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }

    public String getAdminPassword() { return adminPassword; }
    public void setAdminPassword(String adminPassword) { this.adminPassword = adminPassword; }
}
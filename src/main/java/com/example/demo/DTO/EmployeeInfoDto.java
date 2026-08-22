package com.example.demo.DTO;

// 社員情報登録・変更画面（EmployeeManage.jsx）へ返す専用のDTO
// Employeeエンティティをそのまま返すとpasswordHashまでJSONに乗ってしまうので、
// 画面に必要な項目だけをここに詰め替えて返す
public class EmployeeInfoDto {
    private String employeeId;
    private String name;
    private String sectionName;
    private String role;

    public EmployeeInfoDto(String employeeId, String name, String sectionName, String role) {
        this.employeeId = employeeId;
        this.name = name;
        this.sectionName = sectionName;
        this.role=role;
    }

    public String getEmployeeId() { return employeeId; }
    public String getName() { return name; }
    public String getSectionName() { return sectionName; }
    public String getRole() { return role; }
}
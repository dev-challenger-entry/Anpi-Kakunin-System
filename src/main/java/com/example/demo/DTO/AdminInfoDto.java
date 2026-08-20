package com.example.demo.DTO;

// 管理者情報変更画面（AdminSettings.jsx）へ返す専用のDTO
// Employeeエンティティをそのまま返すとpasswordHashまでJSONに乗ってしまうので、
// 画面に必要な項目だけをここに詰め替えて返す
public class AdminInfoDto {
    private String employeeId;
    private String name;
    private String email;
    private String email2;

    public AdminInfoDto(String employeeId, String name, String email, String email2) {
        this.employeeId = employeeId;
        this.name = name;
        this.email = email;
        this.email2 = email2;
    }

    public String getEmployeeId() { return employeeId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getEmail2() { return email2; }
}
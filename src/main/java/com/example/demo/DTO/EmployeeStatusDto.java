package com.example.demo.DTO;

import java.time.LocalDateTime;

public class EmployeeStatusDto {
    private String employeeId;
    private String name;
    private String sectionName;
    private String safetyStatus;
    private String role;
    private LocalDateTime answeredTime;

    public EmployeeStatusDto(String employeeId, String name, String sectionName, String safetyStatus, String role, LocalDateTime answeredTime) {
        this.employeeId = employeeId;
        this.name = name;
        this.sectionName = sectionName;
        // DB上でNULLの社員（未回答）はフロントの選択肢に合わせた初期表示
        this.safetyStatus = (safetyStatus == null) ? "未回答" : safetyStatus;
        this.role = role;
        this.answeredTime = answeredTime;
    }

    public String getEmployeeId() { return employeeId; }
    public String getName() { return name; }
    public String getSectionName() { return sectionName; } // ← getsection_name() から修正
    public String getSafetyStatus() { return safetyStatus; }
    public String getRole() { return role; }
    public LocalDateTime getAnsweredTime() { return answeredTime; }
}
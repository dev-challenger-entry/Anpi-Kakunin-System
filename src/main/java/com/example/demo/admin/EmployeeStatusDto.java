package com.example.demo.admin;

public class EmployeeStatusDto {
    private String employeeId;
    private String name;
    private String sectionName;
    private String safetyStatus;

    public EmployeeStatusDto(String employeeId, String name, String sectionName, String safetyStatus) {
        this.employeeId = employeeId;
        this.name = name;
        this.sectionName = sectionName;
        // DB上でNULLの社員（未回答）はフロントの選択肢に合わせた初期表示
        this.safetyStatus = (safetyStatus == null) ? "未回答" : safetyStatus;
    }

    public String getEmployeeId() { return employeeId; }
    public String getName() { return name; }
    public String getsection_name() { return sectionName; }
    public String getSafetyStatus() { return safetyStatus; }
}
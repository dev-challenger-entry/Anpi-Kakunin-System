package com.example.demo.admin;

public class EmployeeStatusDto {
    private String employeeId;
    private String name;
    private String companyName;
    private String safetyStatus;

    public EmployeeStatusDto(String employeeId, String name, String companyName, String safetyStatus) {
        this.employeeId = employeeId;
        this.name = name;
        this.companyName = companyName;
        // DB上でNULLの社員（未回答）はフロントの選択肢に合わせてUNANSWERED扱いにする
        this.safetyStatus = (safetyStatus == null) ? "UNANSWERED" : safetyStatus;
    }

    public String getEmployeeId() { return employeeId; }
    public String getName() { return name; }
    public String getCompanyName() { return companyName; }
    public String getSafetyStatus() { return safetyStatus; }
}
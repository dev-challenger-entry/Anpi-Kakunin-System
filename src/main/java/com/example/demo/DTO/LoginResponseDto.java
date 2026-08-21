package com.example.demo.DTO;

import com.fasterxml.jackson.annotation.JsonInclude;

// ログインAPI（POST /api/login）専用のレスポンスDTO
// 成功時：employeeId・roleを含む
// 失敗時：messageのみを含む
@JsonInclude(JsonInclude.Include.NON_NULL) // 値がnullの項目はJSONに出力しない
public class LoginResponseDto {

    private final boolean success;
    private final String message;
    private final String employeeId;
    private final String role;

    private LoginResponseDto(boolean success, String message, String employeeId, String role) {
        this.success = success;
        this.message = message;
        this.employeeId = employeeId;
        this.role = role;
    }

    public static LoginResponseDto success(String employeeId, String role) {
        return new LoginResponseDto(true, null, employeeId, role);
    }

    public static LoginResponseDto failure(String message) {
        return new LoginResponseDto(false, message, null, null);
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public String getEmployeeId() { return employeeId; }
    public String getRole() { return role; }
}
package com.example.demo.DTO;

// 社員情報更新処理（Service層）の結果をControllerへ伝えるためのDTO
public class EmployeeUpdateResultDto {

    private final boolean success;
    private final String message;
    private final int httpStatus;

    private EmployeeUpdateResultDto(boolean success, String message, int httpStatus) {
        this.success = success;
        this.message = message;
        this.httpStatus = httpStatus;
    }

    public static EmployeeUpdateResultDto success(String message) {
        return new EmployeeUpdateResultDto(true, message, 200);
    }

    public static EmployeeUpdateResultDto failure(String message, int httpStatus) {
        return new EmployeeUpdateResultDto(false, message, httpStatus);
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public int getHttpStatus() { return httpStatus; }
}
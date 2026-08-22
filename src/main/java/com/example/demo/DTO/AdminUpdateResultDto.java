package com.example.demo.DTO;

// 管理者情報更新処理（Service層）の結果をControllerへ伝えるためのDTO
public class AdminUpdateResultDto {

    private final boolean success;
    private final String message;
    private final int httpStatus;

    private AdminUpdateResultDto(boolean success, String message, int httpStatus) {
        this.success = success;
        this.message = message;
        this.httpStatus = httpStatus;
    }

    public static AdminUpdateResultDto success(String message) {
        return new AdminUpdateResultDto(true, message, 200);
    }

    public static AdminUpdateResultDto failure(String message, int httpStatus) {
        return new AdminUpdateResultDto(false, message, httpStatus);
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public int getHttpStatus() { return httpStatus; }
}
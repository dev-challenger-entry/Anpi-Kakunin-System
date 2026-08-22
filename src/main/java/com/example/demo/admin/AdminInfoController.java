package com.example.demo.admin;

import com.example.demo.DTO.AdminInfoDto;
import com.example.demo.DTO.AdminUpdateRequestDto;
import com.example.demo.DTO.AdminUpdateResultDto;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

// Controllerはリクエストの受付とレスポンスの整形のみを行い、
// Entity（Employee）やビジネスロジックにはいっさい触れない
@RestController
@RequestMapping("/api/admin/me")
public class AdminInfoController {

    private final AdminInfoService adminInfoService;

    public AdminInfoController(AdminInfoService adminInfoService) {
        this.adminInfoService = adminInfoService;
    }

    // 管理者自身の情報を取得するAPI（管理者情報変更画面の初期表示用）
    @GetMapping
    public ResponseEntity<AdminInfoDto> getMe(HttpSession session) {
        String employeeId = (String) session.getAttribute("employeeId");

        return adminInfoService.findAdminInfo(employeeId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 管理者自身の情報を更新するAPI
    @PutMapping
    public ResponseEntity<Map<String, Object>> updateMe(
            @RequestBody AdminUpdateRequestDto request,
            HttpSession session) {

        String employeeId = (String) session.getAttribute("employeeId");

        AdminUpdateResultDto result =
                adminInfoService.updateAdminInfo(employeeId, request);

        Map<String, Object> res = new HashMap<>();
        res.put("success", result.isSuccess());
        res.put("message", result.getMessage());

        return ResponseEntity.status(result.getHttpStatus()).body(res);
    }
}
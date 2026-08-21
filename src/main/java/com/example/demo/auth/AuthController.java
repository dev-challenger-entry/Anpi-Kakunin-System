package com.example.demo.auth;

import com.example.demo.DTO.LoginRequest;
import com.example.demo.DTO.LoginResponseDto;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // 1. ログイン
    @PostMapping("/login")
    public LoginResponseDto login(
            @RequestBody LoginRequest request,
            HttpSession session) {

        return authService.login(request, session);
    }

    // 2. マイページ用データ取得
    @GetMapping("/mypage")
    public ResponseEntity<?> getMypageData(
            @RequestParam("employeeId") String employeeId) {

        return authService.getMyPage(employeeId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> {
                    Map<String, Object> notFound = new HashMap<>();
                    notFound.put("error", "employee not found");
                    return ResponseEntity.ok(notFound);
                });
    }
}
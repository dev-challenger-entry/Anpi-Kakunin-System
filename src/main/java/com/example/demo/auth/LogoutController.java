package com.example.demo.auth;

import java.util.HashMap;
import java.util.Map;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LogoutController {

    @PostMapping("/api/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpSession session) {

        // セッションを破棄
        session.invalidate();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "ログアウトしました");

        return ResponseEntity.ok(response);
    }
}
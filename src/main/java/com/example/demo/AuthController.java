package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.HashMap;

@RestController
public class AuthController {

    // 1. ログイン用の最低限の道
    @PostMapping("/api/login")
    public Map<String, Object> login() {
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        return res;
    }

    // 2. マイページ用の最低限の道（一切の処理を抜いた安全な形）
    @GetMapping("/api/mypage")
    public Map<String, Object> getMypageData() {
        Map<String, Object> res = new HashMap<>();
        res.put("companyName", "テスト株式会社");
        return res;
    }
}

package com.example.demo.auth;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/captcha")
public class CaptchaController {

    // 将来的にGoogle reCAPTCHA等へ置き換える前提の、暫定的な文字列認証
    // 紛らわしい文字（0/O, 1/I等）は除外
    private static final String CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int LENGTH = 4;
    private static final SecureRandom RANDOM = new SecureRandom();

    // 認証コードを生成し、正解はセッションにのみ保持する
    @GetMapping("/generate")
    public Map<String, String> generate(HttpSession session) {
        String code = generateCode();
        session.setAttribute("captchaAnswer", code);

        Map<String, String> res = new HashMap<>();
        res.put("captcha", code);
        return res;
    }

    // フロントから届く回答を受け取るための箱
    public static class CaptchaRequest {
        private String answer;
        public String getAnswer() { return answer; }
        public void setAnswer(String answer) { this.answer = answer; }
    }

    // セッションに保持している正解と照合する（判定はサーバー側でのみ行う）
    @PostMapping("/verify")
    public Map<String, Boolean> verify(
            @RequestBody CaptchaRequest request,
            HttpSession session) {

        String correctAnswer = (String) session.getAttribute("captchaAnswer");
        boolean success = correctAnswer != null && correctAnswer.equals(request.getAnswer());

        Map<String, Boolean> res = new HashMap<>();
        res.put("success", success);
        return res;
    }

    private String generateCode() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < LENGTH; i++) {
            sb.append(CHARS.charAt(RANDOM.nextInt(CHARS.length())));
        }
        return sb.toString();
    }
}
package com.example.demo.auth;

import jakarta.servlet.http.HttpSession;

import lombok.Getter;
import lombok.Setter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/captcha")
public class CaptchaController {

    // .envに設定したシークレットキーを読み込む
    // （StudySpringApplicationがSystem.setPropertyしているので、
    //   @Valueでそのまま読める）
    @Value("${RECAPTCHA_SECRET_KEY}")
    private String recaptchaSecretKey;

    // Googleの検証APIへ問い合わせるための道具
    private final RestTemplate restTemplate = new RestTemplate();

    // フロントから届くreCAPTCHAのトークンを受け取るための箱
    public static class CaptchaRequest {
        private String token;
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
    }

    // Googleのsiteverify APIからのレスポンスを受け取るための箱
    // Jacksonがリフレクションでsetterを呼んでJSONを詰め替えるため、
    // 一見「使われていない」ように見えるがLombokのGetter/Setterで実際は使われている
    @Getter
    @Setter
    private static class GoogleRecaptchaResponse {
        private boolean success;
    }

    // フロントから届いたトークンをGoogleに送って、人間かどうかを判定してもらう
    // （正解の判定はGoogle側で行われるため、こちらでは結果を受け取るだけ）
    @PostMapping("/verify")
    public Map<String, Boolean> verify(
            @RequestBody CaptchaRequest request,
            HttpSession session) {

        Map<String, Boolean> res = new HashMap<>();

        // トークンが空の場合はGoogleに問い合わせるまでもなく失敗
        if (request.getToken() == null || request.getToken().isBlank()) {
            res.put("success", false);
            return res;
        }

        String url = "https://www.google.com/recaptcha/api/siteverify"
                + "?secret=" + recaptchaSecretKey
                + "&response=" + request.getToken();

        GoogleRecaptchaResponse googleResponse =
                restTemplate.postForObject(url, null, GoogleRecaptchaResponse.class);

        boolean success = googleResponse != null && googleResponse.isSuccess();
        // ↑ Lombokの@Getterはboolean型フィールドに対して isSuccess() を生成するので変更不要

        res.put("success", success);
        return res;
    }
}
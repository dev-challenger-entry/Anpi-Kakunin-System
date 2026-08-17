package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SessionAuthInterceptor())
                .addPathPatterns(
                    "/api/mypage",
                    "/api/status/**",
                    "/api/admin/**",   // ← 追加：社員一覧・集計APIを保護(管理者画面保護)
                    "/api/captcha/**"  // ← 追加：認証コード生成・照合APIを保護(管理者画面の一歩手前を保護)
                )
                .excludePathPatterns(
                    "/api/login"
                );
    }
}
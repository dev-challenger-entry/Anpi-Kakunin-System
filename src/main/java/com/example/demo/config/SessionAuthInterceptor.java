package com.example.demo.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.servlet.HandlerInterceptor;

public class SessionAuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler) throws Exception {

           // CORSのPreflight（事前確認）は認証チェックせず通す
    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
        return true;
     }

       HttpSession session = request.getSession(false);

        String employeeId = (session != null)
                ? (String) session.getAttribute("employeeId")
                : null;

        // 未ログイン
        if (employeeId == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write(
                    "{\"success\":false,\"message\":\"ログインしていません\"}"
            );
            return false;
        }

        return true;
    }
}
package com.example.demo.config;

//HTTPリクエスト情報を扱う
import jakarta.servlet.http.HttpServletRequest;
//HTTPレスポンス情報を扱う
import jakarta.servlet.http.HttpServletResponse;
//同一ユーザーの一連の操作（画面遷移など）で、データを保持するための「セッション」を扱う
import jakarta.servlet.http.HttpSession;
//コントローラー（主に@Controllerや@RestController）の処理の前後に割り込むための仕組み
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
        // roleもここでセッションから取り出しておく（②のチェックで使うため）
        String role = (session != null)
                ? (String) session.getAttribute("role")
                : null;

        // 未ログインチェック
        if (employeeId == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write(
                    "{\"success\":false,\"message\":\"ログインしていません\"}"
            );
            return false;
        }

        // 現在ユーザーがアクセスしようとしているURLのパス（ドメイン以降の住所）を文字列として取得する
        String path = request.getRequestURI();

        // ② 管理者専用API
        if (path.startsWith("/api/admin/") && !"ADMIN".equals(role)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"success\":false,\"message\":\"権限がありません\"}");
            return false;
        }

        return true;
    }
}
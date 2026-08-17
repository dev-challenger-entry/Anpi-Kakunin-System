package com.example.demo.config;

//HTTPリクエスト情報を扱う
import jakarta.servlet.http.HttpServletRequest;
//HTTPレスポンス情報を扱う
import jakarta.servlet.http.HttpServletResponse;
//同一ユーザーの一連の操作（画面遷移など）で、データを保持するための「セッション」を扱う
import jakarta.servlet.http.HttpSession;
//コントローラー（主に@Controllerや@RestController）の処理の前後に割り込むための仕組み
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;

import java.util.Map;

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


        // ③ 他のアカウント保持者のマイページを覗けないようにする
        // 自分のアカウント以外のマイページへのアクセスを禁止する
         @SuppressWarnings("unchecked")//Javaに警告出るのは開発者は分かっているから無視してというアノテーション
          Map<String, String> uriVars =
                   (Map<String, String>) request.getAttribute(
                           HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE
                   );
        // uriVars = 「APIエンドポイントのパスに含まれる変数を格納したもの」
        // uriVarsが存在し、かつ「userId」というパス変数がある場合
        if (uriVars != null
                && uriVars.containsKey("userId")){

            String targetId = uriVars.get("userId");
              //「ログインしている本人のIDと、アクセスしようとしている対象者のIDが違うなら403を返す」
            if (!employeeId.equals(targetId)) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write(
                        "{\"success\":false,\"message\":\"アクセス権がありません\"}"
                );
                return false;
            }
        }

        return true;
    }
}
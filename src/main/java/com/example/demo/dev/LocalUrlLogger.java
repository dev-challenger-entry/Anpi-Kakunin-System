package com.example.demo.dev;

import org.springframework.boot.web.server.context.WebServerInitializedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class LocalUrlLogger implements ApplicationListener<WebServerInitializedEvent> {

    @Override
    public void onApplicationEvent(WebServerInitializedEvent event) {
        int port = event.getWebServer().getPort();
        
        // 開発環境のコンテキストパスを取得（設定がなければ空文字）
        String contextPath = event.getApplicationContext().getEnvironment()
                .getProperty("server.servlet.context-path", "");
        
        // ターミナルに見やすくURLを出力
        System.out.println("\n----------------------------------------------------------");
        System.out.println("  Application is running locally!");
        System.out.println("  Local URL: http://localhost:" + port + contextPath);
        System.out.println("----------------------------------------------------------\n");
    }
}

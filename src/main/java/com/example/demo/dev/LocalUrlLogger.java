package com.example.demo.dev;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationContext;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class LocalUrlLogger {

    private static final Logger log = LoggerFactory.getLogger(LocalUrlLogger.class);

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady(ApplicationReadyEvent event) {
        ApplicationContext context = event.getApplicationContext();
        Environment environment = context.getEnvironment();

        // 1. ベースURLの作成
        String port = environment.getProperty("local.server.port", "8080");
        String contextPath = environment.getProperty("server.servlet.context-path", "");
        if (!contextPath.isEmpty() && !contextPath.startsWith("/")) {
            contextPath = "/" + contextPath;
        }
        String baseUrl = "http://localhost:" + port + contextPath;

        // 2. 登録されているURLをすべて取得して、見やすく改行で繋ぐ
        String urlListString = "";
        try {
            RequestMappingHandlerMapping mappingHandler = context.getBean(RequestMappingHandlerMapping.class);

            // 全てのマッピングをループしてリスト化
            List<String> paths = mappingHandler.getHandlerMethods().keySet().stream()
                    .flatMap(info -> info.getPatternValues().stream())
                    .filter(path -> !path.equals("/error")) // エラー用は除外
                    .distinct() // 重複を削る
                    .sorted()   // 見やすく並び替え
                    .map(path -> "\t-> " + baseUrl + (path.startsWith("/") ? path : "/" + path))
                    .collect(Collectors.toList());

            // 箇条書きにするために改行で合体させる
            urlListString = String.join("\n", paths);

        } catch (Exception e) {
            urlListString = "\tURLの自動検出に失敗しました。";
        }

        // 3. ログに出力
        log.info("""
                
                ----------------------------------------------------------
                \tApplication is running locally!
                \tAvailable Controller URLs:
                {}
                ----------------------------------------------------------""",
                urlListString);
    }
}

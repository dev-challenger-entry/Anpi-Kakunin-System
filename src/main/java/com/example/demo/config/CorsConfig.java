package com.example.demo.config;

// Spring Bootは起動時にこのアノテーションが付いたクラスを読み込み、アプリケーションの設定としてシステムに反映させます。
import org.springframework.context.annotation.Configuration;

// CORSの設定情報を登録・管理する（Registry）ためのクラス
// 「どのURLパスに対して」「どのドメイン（オリジン）からのアクセスを」「どのHTTPメソッド（GET/POSTなど）で許可するか」を指定する役割
import org.springframework.web.servlet.config.annotation.CorsRegistry;

// Spring MVCのカスタマイズを行うためのインターフェース
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// 許可するオリジン（アクセス元URL）を動的に管理するためのリストを使用する
import java.util.ArrayList;
import java.util.List;

// このクラスが設定用のクラスであることを Spring に教えるアノテーション
@Configuration

// CorsConfig クラスは、WebMvcConfigurer（Webの仕組みを設定する人）という役割・機能を具体的に実装（担当）します
public class CorsConfig implements WebMvcConfigurer {

    // WebMvcConfigurer.classの中にあるaddCorsMappingsという仕組みを上書きする
    @Override
    // CorsRegistry registry：Springbootから渡された「CORSの許可ルール登録帳」
    // ⇒ この登録帳（registry）に、この後「/**」や「localhost:5173」などの具体的なルールを書き込んでいく。
    public void addCorsMappings(CorsRegistry registry) {

        // 許可するアクセス元（オリジン）を格納するリストを作成する
        // 固定のlocalhostだけでなく、実機テスト用のIPアドレスも後から追加できるようにする
        List<String> allowedOrigins = new ArrayList<>();

        // 開発用PC（localhost）は常に許可
        // PC上のブラウザからReact（Vite）へアクセスする場合に使用する
        allowedOrigins.add("http://localhost:5173");

        // 実機（スマホ等）からのアクセス用に、開発用PCのLAN内IPを.envから読み込む
        // .envに書かれていない場合は追加しない（＝GitHubには一切IPが残らない）
        // System.getProperty()を使用して、環境変数・起動時に渡された設定値からIPアドレスを取得する
        String localNetworkIp = System.getProperty("LOCAL_NETWORK_IP");

        // IPアドレスが設定されていて、空白だけの値でもない場合のみ許可対象に追加する
        if (localNetworkIp != null && !localNetworkIp.isBlank()) {
            // 例：192.168.1.10 が設定されていた場合
            // 「http://192.168.1.10:5173」をCORSの許可対象に追加する
            allowedOrigins.add("http://" + localNetworkIp + ":5173");
        }

        // 「どのURLパスに対して」「どのオリジンからのアクセスを」「どのHTTPメソッドで許可するか」を設定する
        registry.addMapping("/**")
                // 本番環境に移行する際は、以下のhttp://は修正が必要
                // なお複数追加するときは、.allowedOrigins("http://localhost:5173", "https://本番URL")
                // allowedOriginsに登録したURLをまとめてCORSの許可対象にする
                .allowedOrigins(allowedOrigins.toArray(new String[0]))

                // 作成、読み取り、更新、操作に関するやり取りをフロントエンドと許可する
                .allowedMethods("GET", "POST", "PUT", "DELETE")

                // どんなリクエストヘッダー（Content-Type、Authorizationなど）でも許可する
                .allowedHeaders("*")

                // フロントエンドとバックエンドの間で「クッキー（Cookie）やログイン認証情報のやり取りを許可する」というセキュリティ設定
                .allowCredentials(true);
    }
}
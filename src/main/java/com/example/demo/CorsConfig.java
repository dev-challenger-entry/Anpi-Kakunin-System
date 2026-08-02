package com.example.demo;
//Spring Bootは起動時にこのアノテーションが付いたクラスを読み込み、アプリケーションの設定としてシステムに反映させます。
import org.springframework.context.annotation.Configuration;
//CORSの設定情報を登録・管理する（Registry）ためのクラス
//「どのURLパスに対して」「どのドメイン（オリジン）からのアクセスを」「どのHTTPメソッド（GET/POSTなど）で許可するか」を指定する役割
import org.springframework.web.servlet.config.annotation.CorsRegistry;
//Spring MVCのカスタマイズを行うためのインターフェース
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//このクラスが設定用のクラスであることを Spring に教えるアノテーション
@Configuration
//CorsConfig クラスは、WebMvcConfigurer（Webの仕組みを設定する人）という役割・機能を具体的に実装（担当）します
public class CorsConfig implements WebMvcConfigurer {

    //WebMvcConfigurer.classの中にあるaddCorsMappingsという仕組みを上書きする
    @Override
    //CorsRegistry registry：Springbootから渡された「CORSの許可ルール登録帳」
   // ⇒ この登録帳（registry）に、この後「/**」や「localhost:5173」などの具体的なルールを書き込んでいく。
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                //本番環境に移行する際は、以下のhttp://は修正が必要
                //なお複数追加するときは、.allowedOrigins("http://localhost:5173", "https://本番URL")
                .allowedOrigins("http://localhost:5173")
                //作成、読み取り、更新、操作に関するやり取りをフロントエンドと許可する
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                //どんなリクエストヘッダー（Content-Type、Authorizationなど）でも許可する
                .allowedHeaders("*")
                //フロントエンドとバックエンドの間で「クッキー（Cookie）やログイン認証情報のやり取りを許可する」というセキュリティ設定
                .allowCredentials(true);
    }
}
package com.example.demo.config;

import com.example.demo.mypage.EmployeeRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.CommandLineRunner;

@Configuration
// クラス名：ログインパスワードの初期化を担当する設定クラス
public class SetupDefaultPasswords {

    @Bean
    //開発中だけ作動するようなアノテーション
    @Profile("dev")
    //メソッド名：デフォルトパスワードをセットアップする
    CommandLineRunner initDefaultPasswords(EmployeeRepository repo, PasswordEncoder encoder) {
        return args -> {
// 修正後（.envに未定義ならエラーにする、または警告を出すなど）
String defaultPassword = System.getProperty("SEED_PASSWORD");
if (defaultPassword == null) {
    // .envに書き忘れている場合は、安全のために起動を止めるか、分かりやすい警告ログを出す
    throw new IllegalStateException(".env ファイルに SEED_PASSWORD が設定されていません！");
}
        };
    }
}

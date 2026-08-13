package com.example.demo.config;

import com.example.demo.mypage.Employee;
import com.example.demo.mypage.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SetupDefaultPasswords {

    /*
     * 開発環境(dev)でのみ実行する。
     *
     * 本番環境では初期パスワードを自動設定しない。
     */
    @Bean
    @Profile("dev")
    CommandLineRunner initDefaultPasswords(
            EmployeeRepository repo,
            PasswordEncoder encoder) {

        return args -> {

            /*
             * 管理者用の初期パスワード。
             *
             * 環境変数 ADMIN_PASSWORD から取得する。
             * ソースコードにはパスワードそのものを書かない。
             */
            String defaultPassword =
                    System.getProperty("ADMIN_PASSWORD");

            if (defaultPassword == null || defaultPassword.isBlank()) {
                throw new IllegalStateException(
                        "ログインIDまたはパスワードが正しくありません");
            }

            /*
             * 管理者アカウント
             *
             * IDは ADMIN001 に固定。
             */
            repo.findById("ADMIN001").ifPresent(admin -> {

                admin.setPasswordHash(
                        encoder.encode(defaultPassword)
                );

                repo.save(admin);
            });

            /*
             * サンプル社員
             *
             * 開発用なので、サンプル社員には
             * 管理者とは別の初期パスワードを設定する。
             */
            setSamplePassword(
                    repo,
                    encoder,
                    "E001",
                    "employee"
            );

            setSamplePassword(
                    repo,
                    encoder,
                    "E002",
                    "employee"
            );
        };
    }

    private void setSamplePassword(
            EmployeeRepository repo,
            PasswordEncoder encoder,
            String employeeId,
            String password) {

        repo.findById(employeeId).ifPresent(employee -> {

            employee.setPasswordHash(
                    encoder.encode(password)
            );

            repo.save(employee);
        });
    }
}
package com.example.demo.config;

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
     *
     * 【重要】パスワードが既に設定されている（password_hashがnullでない）場合は
     * 上書きしない。これにより、一度パスワードを変更したアカウントは
     * Javaの再起動をまたいでも変更内容が保持される。
     * あくまで「まだ一度もパスワードが設定されていないアカウントへの初期投入」専用とする。
     */
    @Bean
    @Profile("dev")
    CommandLineRunner initDefaultPasswords(
            EmployeeRepository repo,
            PasswordEncoder encoder) {

        return args -> {

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
             * password_hashが未設定の場合のみ初期化する。
             */
            repo.findById("ADMIN001").ifPresent(admin -> {

                if (admin.getPasswordHash() == null
                        || admin.getPasswordHash().isBlank()) {

                    admin.setPasswordHash(
                            encoder.encode(defaultPassword)
                    );

                    repo.save(admin);
                }
            });

            /*
             * サンプル社員
             *
             * password_hashが未設定の場合のみ初期化する。
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

            if (employee.getPasswordHash() == null
                    || employee.getPasswordHash().isBlank()) {

                employee.setPasswordHash(
                        encoder.encode(password)
                );

                repo.save(employee);
            }
        });
    }
}
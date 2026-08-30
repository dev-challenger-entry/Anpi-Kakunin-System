package com.example.demo.config;

import com.example.demo.mypage.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
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
            PasswordEncoder encoder,
            Environment environment) {

        return args -> {

            String defaultPassword = environment.getProperty("ADMIN_PASSWORD");

            if (defaultPassword == null || defaultPassword.isBlank()) {
                throw new IllegalStateException(
                        "ADMIN_PASSWORDが設定されていません。");
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
                            encoder.encode(defaultPassword));

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
                    "employee");

            setSamplePassword(
                    repo,
                    encoder,
                    "E002",
                    "employee");
        };
    }

    /*
     * ADMIN001のパスワードを強制的に初期化する。
     *
     * 通常のdev起動では実行されない。
     * --spring.profiles.active=reset-password
     * を指定した場合のみ実行される。
     */

    @Bean
    @Profile("reset-password")
    CommandLineRunner forceResetAdminPassword(
            EmployeeRepository repo,
            PasswordEncoder encoder,
            Environment environment) {

        return args -> {

            String defaultPassword = environment.getProperty("ADMIN_PASSWORD");

            if (defaultPassword == null || defaultPassword.isBlank()) {
                throw new IllegalStateException(
                        "ADMIN_PASSWORDが設定されていません。復旧できません。");
            }

            repo.findById("ADMIN001").ifPresent(admin -> {

                admin.setPasswordHash(
                        encoder.encode(defaultPassword));

                repo.save(admin);

                System.out.println(
                        "【復旧】ADMIN001のパスワードを初期化しました。");
            });
        };
    }

    /*
     * 社員のパスワードを初期設定する。
     *
     * password_hashが未設定の場合のみ設定する。
     * 既にパスワードが存在する場合は何もしない。
     */

    private void setSamplePassword(
            EmployeeRepository repo,
            PasswordEncoder encoder,
            String employeeId,
            String password) {

        repo.findById(employeeId).ifPresent(employee -> {

            if (employee.getPasswordHash() == null
                    || employee.getPasswordHash().isBlank()) {

                employee.setPasswordHash(
                        encoder.encode(password));

                repo.save(employee);
            }
        });
    }
}
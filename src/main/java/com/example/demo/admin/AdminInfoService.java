package com.example.demo.admin;

import com.example.demo.DTO.AdminInfoDto;
import com.example.demo.DTO.AdminUpdateRequestDto;
import com.example.demo.DTO.AdminUpdateResultDto;
import com.example.demo.Entity.Employee;
import com.example.demo.mypage.EmployeeRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

// 管理者自身の情報取得・更新に関するビジネスロジックをここに集約する
// Entity（Employee）を扱ってよいのはこの層まで。Controllerには渡さない。
@Service
public class AdminInfoService {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminInfoService(
            EmployeeRepository employeeRepository,
            PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ログイン中の管理者自身の情報を取得する
    // EmployeeエンティティをそのままDTOに詰め替えてから返す（passwordHash漏洩防止）
    public Optional<AdminInfoDto> findAdminInfo(String employeeId) {
        return employeeRepository.findById(employeeId)
                .map(admin -> new AdminInfoDto(
                        admin.getEmployeeId(),
                        admin.getName(),
                        admin.getEmail(),
                        admin.getEmail2()
                ));
    }

    // ログイン中の管理者自身の情報を更新する
    // 現在のパスワードを照合できた場合のみ、メールアドレス・パスワードを更新する
    public AdminUpdateResultDto updateAdminInfo(
            String employeeId,
            AdminUpdateRequestDto request) {

        Optional<Employee> adminOpt = employeeRepository.findById(employeeId);

        if (adminOpt.isEmpty()) {
            return AdminUpdateResultDto.failure("管理者情報が見つかりません", 404);
        }

        Employee admin = adminOpt.get();

        // ========================================
        // 本人確認
        // ========================================

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                admin.getPasswordHash())) {

            return AdminUpdateResultDto.failure("現在のパスワードが正しくありません", 401);
        }

        // ========================================
        // 更新内容の反映
        // ========================================

        admin.setEmail(request.getEmail());

        String newPassword = request.getNewPassword();

        if (newPassword != null && !newPassword.isBlank()) {
            admin.setPasswordHash(passwordEncoder.encode(newPassword));
        }

        employeeRepository.save(admin);

        return AdminUpdateResultDto.success("更新に成功しました");
    }
}
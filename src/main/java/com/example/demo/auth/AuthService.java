package com.example.demo.auth;

import com.example.demo.DTO.EmployeeStatusDto;
import com.example.demo.DTO.LoginRequest;
import com.example.demo.DTO.LoginResponseDto;
import com.example.demo.Entity.Employee;
import com.example.demo.mypage.EmployeeRepository;

import jakarta.servlet.http.HttpSession;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

// 認証・マイページ取得に関するビジネスロジックをここに集約する
// Entity（Employee）を扱ってよいのはこの層まで。Controllerには渡さない。
@Service
public class AuthService {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            EmployeeRepository employeeRepository,
            PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ログイン処理
    // 成功時はセッションにemployeeIdとroleを保存し、結果をDTOに詰めて返す
    public LoginResponseDto login(LoginRequest request, HttpSession session) {

        // IDから社員を検索
        Employee employee = employeeRepository
                .findById(request.getEmployeeId())
                .orElse(null);

        // 社員が存在しない
        if (employee == null) {
            return LoginResponseDto.failure("IDまたはパスワードが違います");
        }

        // パスワード未設定 or 不一致
        if (employee.getPasswordHash() == null
                || !passwordEncoder.matches(request.getPassword(), employee.getPasswordHash())) {
            return LoginResponseDto.failure("IDまたはパスワードが違います");
        }

        // 認証成功：セッションに保存
        session.setAttribute("employeeId", employee.getEmployeeId());
        session.setAttribute("role", employee.getRole());

        return LoginResponseDto.success(employee.getEmployeeId(), employee.getRole());
    }

    // マイページ表示用データを取得する
    // Entity（Employee）はここで受け取り、EmployeeStatusDtoに詰め替えてから返す
    // → passwordHashがControllerやフロントに渡ることはない
    public Optional<EmployeeStatusDto> getMyPage(String employeeId) {
        return employeeRepository.findById(employeeId)
                .map(employee -> new EmployeeStatusDto(
                        employee.getEmployeeId(),
                        employee.getName(),
                        employee.getSectionName(),
                        employee.getSafetyStatus(),
                        employee.getRole(),
                        employee.getAnsweredTime()
                ));
    }
}
package com.example.demo.admin;

import com.example.demo.DTO.EmployeeInfoDto;
import com.example.demo.DTO.EmployeeRegisterRequestDto;
import com.example.demo.DTO.EmployeeUpdateRequestDto;
import com.example.demo.DTO.EmployeeUpdateResultDto;
import com.example.demo.Entity.Employee;
import com.example.demo.mypage.EmployeeRepository;

import jakarta.servlet.http.HttpSession;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

// 社員情報の検索・登録・更新・削除に関するビジネスロジックをここに集約する
// Entity（Employee）を扱ってよいのはこの層まで。Controllerには渡さない。
@Service
public class EmployeeInfoService {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeInfoService(
            EmployeeRepository employeeRepository,
            PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 社員IDを1件だけ検索する
    // EmployeeエンティティをそのままDTOに詰め替えてから返す（passwordHash漏洩防止）
    public Optional<EmployeeInfoDto> findEmployeeInfo(String employeeId) {
        return employeeRepository.findById(employeeId)
                .map(employee -> new EmployeeInfoDto(
                        employee.getEmployeeId(),
                        employee.getName(),
                        employee.getSectionName(),
                        employee.getRole()));
    }

    // ========================================
    // 新規登録
    // ========================================
    // この画面（EmployeeManage.jsx）経由の登録は、常に一般社員（USER）として登録する
    // 管理者アカウントの新規作成はこの画面の対象外
    public EmployeeUpdateResultDto registerEmployee(EmployeeRegisterRequestDto request) {

        // 二重登録防止
        if (employeeRepository.existsById(request.getEmployeeId())) {
            return EmployeeUpdateResultDto.failure("そのIDは既に使用されています", 409);
        }

        Employee employee = new Employee();
        employee.setEmployeeId(request.getEmployeeId());
        employee.setName(request.getName());
        employee.setSectionName(request.getSectionName());
        employee.setSafetyStatus("未回答");
        employee.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        employee.setRole("USER");

        employeeRepository.save(employee);

        return EmployeeUpdateResultDto.success("登録に成功しました");
    }

    // 社員情報を更新する
    // 本人確認の方法は2通り：
    // ① currentPassword（対象社員自身のパスワード）が入力されていれば、それで照合する
    // ② currentPasswordが空欄の場合、代わりにadminPassword
    // （ログイン中の管理者自身のパスワード）で照合する
    public EmployeeUpdateResultDto updateEmployee(
            EmployeeUpdateRequestDto request,
            HttpSession session) {

        Optional<Employee> employeeOpt = employeeRepository.findById(request.getEmployeeId());

        // 対象の社員情報が存在しない場合
        if (employeeOpt.isEmpty()) {
            return EmployeeUpdateResultDto.failure("対象の社員情報が見つかりません", 404);
        }

        Employee employee = employeeOpt.get();
        // ========================================
        // ロール判定
        // ========================================
        // 管理者アカウントは社員情報変更の対象外
        if ("ADMIN".equals(employee.getRole())) {
            return EmployeeUpdateResultDto.failure(
                    "管理者アカウントは編集できません",
                    403);
        }
        String currentPassword = request.getCurrentPassword();
        String adminPassword = request.getAdminPassword();

        // ========================================
        // 本人確認
        // ========================================

        if (currentPassword != null && !currentPassword.isBlank()) {

            // ① 対象社員自身のパスワードで照合
            boolean verified = employee.getPasswordHash() != null
                    && passwordEncoder.matches(currentPassword, employee.getPasswordHash());

            if (!verified) {
                return EmployeeUpdateResultDto.failure("現在のパスワードが正しくありません", 401);
            }

        } else if (adminPassword != null && !adminPassword.isBlank()) {

            // ② ログイン中の管理者自身のパスワードで照合
            String adminId = (String) session.getAttribute("employeeId");

            Optional<Employee> adminOpt = employeeRepository.findById(adminId);

            boolean verified = adminOpt.isPresent()
                    && adminOpt.get().getPasswordHash() != null
                    && passwordEncoder.matches(adminPassword, adminOpt.get().getPasswordHash());

            if (!verified) {
                return EmployeeUpdateResultDto.failure("管理者アカウントのパスワードが正しくありません", 401);
            }

        } else {

            // どちらのパスワードも入力されていない
            return EmployeeUpdateResultDto.failure("本人確認のためのパスワードが入力されていません", 400);
        }

        // ========================================
        // 更新内容の反映
        // ========================================

        if (request.getName() != null) {
            employee.setName(request.getName());
        }

        if (request.getSectionName() != null) {
            employee.setSectionName(request.getSectionName());
        }

        String newPassword = request.getNewPassword();

        // 新しいパスワードが入力されている場合のみ更新
        if (newPassword != null && !newPassword.isBlank()) {
            employee.setPasswordHash(passwordEncoder.encode(newPassword));
        }

        employeeRepository.save(employee);

        return EmployeeUpdateResultDto.success("社員情報を更新しました");
    }

    // ========================================
    // 削除
    // ========================================
    public EmployeeUpdateResultDto deleteEmployee(String employeeId) {

        Optional<Employee> employeeOpt = employeeRepository.findById(employeeId);

        // 指定された社員が存在しない場合
        if (employeeOpt.isEmpty()) {
            return EmployeeUpdateResultDto.failure(
                    "指定されたIDの社員が見つかりません",
                    404);
        }

        Employee employee = employeeOpt.get();

        // 管理者アカウントは削除対象外
        if ("ADMIN".equals(employee.getRole())) {
            return EmployeeUpdateResultDto.failure(
                    "管理者アカウントは削除できません",
                    403);
        }

        employeeRepository.deleteById(employeeId);

        return EmployeeUpdateResultDto.success("削除しました");
    }
}
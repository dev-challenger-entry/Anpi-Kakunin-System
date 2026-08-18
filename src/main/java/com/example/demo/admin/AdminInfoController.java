package com.example.demo.admin;

import com.example.demo.mypage.Employee;
import com.example.demo.mypage.EmployeeRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminInfoController {

    private final EmployeeRepository employeeRepository;

    public AdminInfoController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // 管理者自身の情報を取得するAPI（管理者情報変更画面の初期表示用）
    @GetMapping("/me")
    public ResponseEntity<?> getMe(HttpSession session) {
        String employeeId = (String) session.getAttribute("employeeId");

        Optional<Employee> adminOpt = employeeRepository.findById(employeeId);
        if (adminOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Employee admin = adminOpt.get();
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("employeeId", admin.getEmployeeId());
        res.put("name", admin.getName());
        res.put("email", admin.getEmail());
        res.put("email2", admin.getEmail2());

        return ResponseEntity.ok(res);
    }
}
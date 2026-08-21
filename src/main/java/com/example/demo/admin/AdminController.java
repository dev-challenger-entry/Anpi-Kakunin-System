package com.example.demo.admin;

import com.example.demo.Entity.Employee;
import com.example.demo.mypage.EmployeeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final EmployeeRepository employeeRepository;

    public AdminController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // 1. 社員一覧を取得するAPI（URL: /api/admin/employees）
    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> list = employeeRepository.findAll();
        return ResponseEntity.ok(list);
    }

    // 2. ステータスごとの集計を取得するAPI（URL: /api/admin/status-summary）
    @GetMapping("/status-summary")
    public ResponseEntity<Map<String, Long>> getStatusSummary() {
        // フロントのSTATUS_OPTIONSと完全一致させる
        String[] allStatuses = { "未回答", "無事です", "避難しました", "出勤困難" };
        Map<String, Long> summary = new LinkedHashMap<>();
        for (String s : allStatuses) {
            summary.put(s, 0L); // 0人のステータスも表示されるように初期化
        }
        for (Employee e : employeeRepository.findAll()) {
            // ただし、管理者アカウントは安否確認の対象外なので集計から除外する
            if ("ADMIN".equals(e.getRole())) {
            continue;
          }

            String status = (e.getSafetyStatus() == null) ? "未回答" : e.getSafetyStatus();
            Long current = summary.getOrDefault(status, 0L);
            summary.put(status, current + 1L);
        }
        return ResponseEntity.ok(summary);
    }
}
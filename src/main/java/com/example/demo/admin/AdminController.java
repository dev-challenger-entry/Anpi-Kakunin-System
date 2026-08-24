package com.example.demo.admin;

import com.example.demo.DTO.EmployeeInfoDto;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// Controllerはリクエストの受付とレスポンスの整形のみを行い、
// Entity（Employee）やビジネスロジックにはいっさい触れない
@RestController
@RequestMapping("/api/admin")
public class AdminController {

        private final AdminSummaryService adminSummaryService;

        public AdminController(AdminSummaryService adminSummaryService) {
                this.adminSummaryService = adminSummaryService;
        }

        // 1. 社員一覧を取得するAPI
        // URL: /api/admin/employees
        @GetMapping("/employees")
        public ResponseEntity<List<EmployeeInfoDto>> getAllEmployees() {

                return ResponseEntity.ok(adminSummaryService.getAllEmployees());
        }

        // 2. ステータスごとの集計を取得するAPI
        // URL: /api/admin/status-summary
        @GetMapping("/status-summary")
        public ResponseEntity<Map<String, Object>> getStatusSummary() {

                return ResponseEntity.ok(adminSummaryService.getStatusSummary());
        }
}
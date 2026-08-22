package com.example.demo.admin;

import com.example.demo.DTO.EmployeeInfoDto;
import com.example.demo.DTO.EmployeeStatusDto;
import com.example.demo.mypage.EmployeeRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

        private final EmployeeRepository employeeRepository;

        public AdminController(EmployeeRepository employeeRepository) {
                this.employeeRepository = employeeRepository;
        }

        // 1. 社員一覧を取得するAPI
        // URL: /api/admin/employees
        @GetMapping("/employees")
        public ResponseEntity<List<EmployeeInfoDto>> getAllEmployees() {

                List<EmployeeInfoDto> list = employeeRepository.findAll()
                                .stream()
                                .map(employee -> new EmployeeInfoDto(
                                                employee.getEmployeeId(),
                                                employee.getName(),
                                                employee.getSectionName(),
                                                employee.getRole()))
                                .collect(Collectors.toList());

                return ResponseEntity.ok(list);
        }

        // 2. ステータスごとの集計を取得するAPI
        // URL: /api/admin/status-summary
        @GetMapping("/status-summary")
        public ResponseEntity<Map<String, Object>> getStatusSummary() {

                // 管理者を除外して、一般社員だけを取得
                List<EmployeeStatusDto> employees = employeeRepository.findAll()
                                .stream()
                                .filter(employee -> !"ADMIN".equals(employee.getRole()))
                                .map(employee -> new EmployeeStatusDto(
                                                employee.getEmployeeId(),
                                                employee.getName(),
                                                employee.getSectionName(),
                                                employee.getSafetyStatus(),
                                                employee.getRole(),
                                                employee.getAnsweredTime()))
                                .collect(Collectors.toList());

                // ステータスごとに社員を分類
                // メソッド参照ではなくラムダ式にして
                // Null Type Safety警告を回避
                Map<String, List<EmployeeStatusDto>> grouped = employees.stream()
                                .collect(Collectors.groupingBy(
                                                employee -> employee.getSafetyStatus(),
                                                LinkedHashMap::new,
                                                Collectors.toList()));

                // フロントへ返すデータ
                Map<String, Object> result = new LinkedHashMap<>();

                result.put(
                                "無事です",
                                createStatusData(grouped.get("無事です")));

                result.put(
                                "避難しました",
                                createStatusData(grouped.get("避難しました")));

                result.put(
                                "出勤困難",
                                createStatusData(grouped.get("出勤困難")));

                result.put(
                                "未回答",
                                createStatusData(grouped.get("未回答")));

                return ResponseEntity.ok(result);
        }

        // ステータスごとの社員データを作成
        private Map<String, Object> createStatusData(
                        List<EmployeeStatusDto> employees) {

                // 該当者がいない場合は空のリストにする
                if (employees == null) {
                        employees = List.of();
                }

                Map<String, Object> data = new LinkedHashMap<>();

                // 人数
                data.put("count", employees.size());

                // 社員情報
                data.put(
                                "employees",
                                employees.stream()
                                                .map(employee -> {
                                                        Map<String, Object> person = new LinkedHashMap<>();

                                                        person.put(
                                                                        "employeeId",
                                                                        employee.getEmployeeId());

                                                        person.put(
                                                                        "name",
                                                                        employee.getName());

                                                        person.put(
                                                                        "answeredTime",
                                                                        employee.getAnsweredTime());

                                                        return person;
                                                })
                                                .collect(Collectors.toList()));

                return data;
        }
}
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
                        employee.getSectionName()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(list);
    }

    // 2. ステータスごとの集計を取得するAPI
    // URL: /api/admin/status-summary
    @GetMapping("/status-summary")
    public ResponseEntity<Map<String, Long>> getStatusSummary() {

        // 社員全員をEmployeeStatusDtoに変換
        List<EmployeeStatusDto> employees = employeeRepository.findAll()
                .stream()
                .map(employee -> new EmployeeStatusDto(
                        employee.getEmployeeId(),
                        employee.getName(),
                        employee.getSectionName(),
                        employee.getSafetyStatus(),
                        employee.getRole(),
                        employee.getAnsweredTime()
                ))
                .collect(Collectors.toList());

        // safetyStatusごとに人数を集計
        // メソッド参照をラムダ式に変更してNull Type Safety警告を回避
        Map<String, Long> summary = employees.stream()
                .collect(Collectors.groupingBy(
                        dto -> dto.getSafetyStatus(),
                        LinkedHashMap::new,
                        Collectors.counting()
                ));

        return ResponseEntity.ok(summary);
    }
}
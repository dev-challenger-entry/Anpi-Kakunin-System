package com.example.demo.admin;

import com.example.demo.DTO.EmployeeInfoDto;
import com.example.demo.DTO.EmployeeUpdateRequestDto;
import com.example.demo.DTO.EmployeeUpdateResultDto;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

// 社員情報登録・変更画面（管理者操作）専用のコントローラー
// AdminControllerは「集計・一覧の閲覧」担当、こちらは「個別社員の検索・登録・変更・削除」担当として役割を分ける
//   Controllerはリクエストの受付とレスポンスの整形のみを行い、
//   Entity（Employee）やビジネスロジックにはいっさい触れない
@RestController
@RequestMapping("/api/admin/employees")
public class EmployeeInfoController {

    private final EmployeeInfoService employeeInfoService;

    public EmployeeInfoController(EmployeeInfoService employeeInfoService) {
        this.employeeInfoService = employeeInfoService;
    }

    // 社員IDを1件だけ検索するAPI（URL: /api/admin/employees/{employeeId}）
    // IDを入力した瞬間に、他の入力欄をこのデータで埋めるために使う
    @GetMapping("/{employeeId}")
    public ResponseEntity<EmployeeInfoDto> getEmployeeById(
            @PathVariable("employeeId") String employeeId) {

        return employeeInfoService.findEmployeeInfo(employeeId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 社員情報を変更するAPI（URL: /api/admin/employees）
    @PutMapping
    public ResponseEntity<Map<String, Object>> updateEmployee(
            @RequestBody EmployeeUpdateRequestDto request,
            HttpSession session) {

        EmployeeUpdateResultDto result = employeeInfoService.updateEmployee(request, session);

        Map<String, Object> res = new HashMap<>();
        res.put("success", result.isSuccess());
        res.put("message", result.getMessage());

        return ResponseEntity.status(result.getHttpStatus()).body(res);
    }
}
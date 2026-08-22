package com.example.demo.admin;

import com.example.demo.DTO.EmployeeInfoDto;
import com.example.demo.DTO.EmployeeRegisterRequestDto;
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

    // 社員を新規登録するAPI（URL: /api/admin/employees）
    @PostMapping
    public ResponseEntity<Map<String, Object>> registerEmployee(
            @RequestBody EmployeeRegisterRequestDto request) {

        EmployeeUpdateResultDto result = employeeInfoService.registerEmployee(request);

        return toResponse(result);
    }

    // 社員情報を変更するAPI（URL: /api/admin/employees）
    @PutMapping
    public ResponseEntity<Map<String, Object>> updateEmployee(
            @RequestBody EmployeeUpdateRequestDto request,
            HttpSession session) {

        EmployeeUpdateResultDto result = employeeInfoService.updateEmployee(request, session);

        return toResponse(result);
    }

    // 社員を削除するAPI（URL: /api/admin/employees/{employeeId}）
    @DeleteMapping("/{employeeId}")
    public ResponseEntity<Map<String, Object>> deleteEmployee(
            @PathVariable("employeeId") String employeeId) {

        EmployeeUpdateResultDto result = employeeInfoService.deleteEmployee(employeeId);

        return toResponse(result);
    }

    // EmployeeUpdateResultDto → レスポンス整形（success/messageのMapに詰め替え）
    // 登録・更新・削除すべてで結果の形が共通のため、ここに1本化する
    private ResponseEntity<Map<String, Object>> toResponse(EmployeeUpdateResultDto result) {

        Map<String, Object> res = new HashMap<>();
        res.put("success", result.isSuccess());
        res.put("message", result.getMessage());

        return ResponseEntity.status(result.getHttpStatus()).body(res);
    }
}
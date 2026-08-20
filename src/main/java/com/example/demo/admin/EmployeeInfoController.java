package com.example.demo.admin;

import com.example.demo.mypage.Employee;
import com.example.demo.mypage.EmployeeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// 社員情報登録・変更画面（管理者操作）専用のコントローラー
// AdminControllerは「集計・一覧の閲覧」担当、こちらは「個別社員の検索・登録・変更・削除」担当として役割を分ける
@RestController
@RequestMapping("/api/admin/employees")
public class EmployeeInfoController {

    private final EmployeeRepository employeeRepository;

    public EmployeeInfoController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // 社員IDを1件だけ検索するAPI（URL: /api/admin/employees/{employeeId}）
    // IDを入力した瞬間に、他の入力欄をこのデータで埋めるために使う
    @GetMapping("/{employeeId}")
    public ResponseEntity<Employee> getEmployeeById(
            @PathVariable("employeeId") String employeeId) {
        return employeeRepository.findById(employeeId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
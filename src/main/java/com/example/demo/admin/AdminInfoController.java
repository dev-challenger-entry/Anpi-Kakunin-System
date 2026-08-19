package com.example.demo.admin;

import com.example.demo.mypage.Employee;
import com.example.demo.mypage.EmployeeRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.HashMap;
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

      // 管理者自身の情報を更新するAPI
    @PutMapping("/me")
        public ResponseEntity<Map<String, Object>> updateMe(
        // Reactから送られてくるリクエスト
        @RequestBody Map<String, String> request,
        HttpSession session) {

        String employeeId = (String) session.getAttribute("employeeId");
        Map<String, Object> res = new HashMap<>();

        Optional<Employee> adminOpt = employeeRepository.findById(employeeId);

        if (adminOpt.isEmpty()) {
            res.put("success", false);
            return ResponseEntity.status(404).body(res);
           }

         Employee admin = adminOpt.get();

        // リクエストから新しいメールアドレスを取得
        String email = request.get("email");

         // メールアドレスを更新
         admin.setEmail(email);

        // DBに保存
         employeeRepository.save(admin);
 
        // 更新成功
         res.put("success", true);

         return ResponseEntity.ok(res);
    } 
}
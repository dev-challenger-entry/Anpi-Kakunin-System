package com.example.demo.mypage;

import lombok.RequiredArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/status")
@RequiredArgsConstructor
public class StatusController {

    private final JdbcTemplate jdbcTemplate;

    // マイページを開いたときの初期表示用
    @GetMapping("/{userId}")
    public ResponseEntity<String> getStatus(@PathVariable("userId") String userId) {
        String status = jdbcTemplate.queryForObject(
            "SELECT safety_status FROM employees WHERE employee_id = ?",
            String.class,
            userId
        );
        return ResponseEntity.ok(status);
    }

    // フロントから届くstatusを受け取るための箱。static必須（非staticだとJacksonがインスタンス化できない）
    @Getter
    @Setter
    public static class StatusRequest {
        private String status;
    }

    //社員が安否状況を更新したことをマイページへ記憶する
    @PutMapping("/{userId}")   // クラスの@RequestMappingで既に/api/statusが付いているので、ここは{userId}だけでOK
    public ResponseEntity<String> updateStatus(
            @PathVariable("userId") String userId,   // employee_idはVARCHARなのでStringで受ける
            @RequestBody StatusRequest request) {
       // 回答日時を記録するため、現在日時を取得
            LocalDateTime answeredTime = LocalDateTime.now();
       
            jdbcTemplate.update(
            "UPDATE employees" + "SET safety_status = ?, answered_time = ? " +
            "WHERE employee_id = ?",
            request.getStatus(),
            userId
        );
        return ResponseEntity.ok(request.getStatus());
    }
}
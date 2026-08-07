package com.example.demo.mypage;

import lombok.RequiredArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/status")
@RequiredArgsConstructor
public class StatusController {

    private final JdbcTemplate jdbcTemplate;

    // マイページを開いたときの初期表示用
    @GetMapping("/{userId}")
    public ResponseEntity<String> getStatus(@PathVariable("userId") String userId) {
        String status = jdbcTemplate.queryForObject(
            "SELECT safety_status FROM employee WHERE employee_id = ?",
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

    @PutMapping("/{userId}")   // クラスの@RequestMappingで既に/api/statusが付いているので、ここは{userId}だけでOK
    public ResponseEntity<String> updateStatus(
            @PathVariable("userId") String userId,   // employee_idはVARCHARなのでStringで受ける
            @RequestBody StatusRequest request) {
        jdbcTemplate.update(
            "UPDATE employee SET safety_status = ? WHERE employee_id = ?",
            request.getStatus(),
            userId
        );
        return ResponseEntity.ok(request.getStatus());
    }
}
package com.example.demo.mypage;

import lombok.RequiredArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/status/{userId}")
@RequiredArgsConstructor
public class StatusController {

    private final JdbcTemplate jdbcTemplate;

    // マイページを開いたときの初期表示用
    @GetMapping
    public ResponseEntity<String> getStatus(
            @PathVariable("userId") String userId) {

        String status = jdbcTemplate.queryForObject(
                "SELECT safety_status FROM employees WHERE employee_id = ?",
                String.class,
                userId
        );

        return ResponseEntity.ok(status);
    }

    // フロントから届くstatusを受け取るための箱
    @Getter
    @Setter
    public static class StatusRequest {
        private String status;
    }

    // 更新結果と回答日時をフロントへ返すためのレスポンス
    public record StatusUpdateResponse(
            String status,
            LocalDateTime answeredTime
    ) {}

    // 社員が安否状況を更新した日時と内容をDBへ保存する
    @PutMapping
    public ResponseEntity<StatusUpdateResponse> updateStatus(
            @PathVariable("userId") String userId,
            @RequestBody StatusRequest request) {

        // 回答日時として現在日時を取得（ナノ秒は切り捨て）
        LocalDateTime answeredTime = LocalDateTime.now().withNano(0);

        jdbcTemplate.update(
                "UPDATE employees SET safety_status = ?, answered_time = ? " +
                "WHERE employee_id = ?",
                request.getStatus(),
                answeredTime,
                userId
        );

        return ResponseEntity.ok(
                new StatusUpdateResponse(
                        request.getStatus(),
                        answeredTime
                )
        );
    }
}
package com.example.demo.auth;

import com.example.demo.mypage.Employee;
import com.example.demo.mypage.EmployeeRepository;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
public class AuthController {

    // 1.JPAのリポジトリを定義（finalをつける）
    private final EmployeeRepository employeeRepository;

    // 2. コンストラクタでインジェクションする（警告が出なくなります）
    public AuthController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // 1. ログイン用の最低限の道（変更なし）
    @PostMapping("/api/login")
    public Map<String, Object> login() {
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        return res;
    }

    // 2. マイページ用の最低限の道（Spring Data JPAで書き換え）
    @GetMapping("/api/mypage")
    public Object getMypageData(@RequestParam("employeeId") String employeeId) {
        // SQLを書かずに、リポジトリのfindByIdメソッドを使う
        //現在、手動でマイページの切り替えテストをする予定のため、カラでも使えるOptional仕様が望ましい
        Optional<Employee> employeeOpt = employeeRepository.findById(employeeId);

        //データが見つからなかった場合。まずはエラーが起きたらどうなるかを書く。
        //これは先にエラーを処理してしまったほうが望ましいという実務上のやり方としてガード節というもの。
        if (employeeOpt.isEmpty()) {
            Map<String, Object> notFound = new HashMap<>();
            notFound.put("error", "employee not found");
            return notFound;
        }

        // 見つかった場合は、データ（Employeeオブジェクト）をそのまま返す
        // Springが自動的にきれいなJSON形式に変換してくれます
        return employeeOpt.get();
    }
}

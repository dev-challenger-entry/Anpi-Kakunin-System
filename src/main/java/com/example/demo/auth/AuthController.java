package com.example.demo.auth;

import com.example.demo.mypage.Employee;
import com.example.demo.mypage.EmployeeRepository;

import jakarta.servlet.http.HttpSession;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
public class AuthController {

    // JPAのリポジトリを定義（finalをつける）
    private final EmployeeRepository employeeRepository;
    //ユーザーが入力したパスワードを暗号化（ハッシュ化）するための道具を、
    // クラスの中でいつでも使えるように準備している一文
    private final PasswordEncoder passwordEncoder;

    // AuthControllerが動くために絶対に必要な2つの道具
    // 社員データと暗号化を、起動時に外から受け取って
    // セッティングするための仕組み
    public AuthController(
        EmployeeRepository employeeRepository,
        PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 1. ログイン用の最低限の道（変更なし）
    @PostMapping("/api/login")
    public Map<String, Object> login(
    @RequestBody LoginRequest request,
         HttpSession session) {

        Map<String, Object> res = new HashMap<>();

    // IDから社員を検索
    Employee employee = employeeRepository
     .findById(request.getEmployeeId())
     .orElse(null);

    // 社員が存在しない
    if (employee == null) {
        res.put("success", false);
        res.put("message", "IDまたはパスワードが違います");
        return res;
    }

        // パスワードチェック
        //データベースにパスワードが登録されていない（値が null である）不完全なアカウントを使って、
        // 不正にログインされたりシステムがクラッシュしたりするのを防ぐ部分を追加
    if (employee.getPasswordHash() == null ||!passwordEncoder.matches(
            request.getPassword(),
            employee.getPasswordHash())) {

        res.put("success", false);
        res.put("message", "IDまたはパスワードが違います");
        return res;
    }

    // 認証成功
    session.setAttribute("employeeId", employee.getEmployeeId());
    session.setAttribute("role", employee.getRole());

    res.put("success", true);
    res.put("employeeId", employee.getEmployeeId());
    res.put("role", employee.getRole());

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

package com.example.demo.mypage; 

import com.example.demo.Entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, String> {
    // 中身には何も書かなくてOKです！
    // JpaRepositoryを継承（extends）するだけで、自動的にID検索機能（findById）などが使えるようになります。
}

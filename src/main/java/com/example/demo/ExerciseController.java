package com.example.demo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@CrossOrigin(origins = "http://localhost:5173")

@RestController
public class ExerciseController {

    @GetMapping("/学習中")
    public String getDepartments() {
        return "部署一覧（仮）"; 
}

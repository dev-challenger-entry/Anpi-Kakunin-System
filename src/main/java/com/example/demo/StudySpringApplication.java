package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@SpringBootApplication
public class StudySpringApplication {

	public static void main(String[] args) {
		// Spring起動前に.envを読み込む
		loadDotenv();
		SpringApplication.run(StudySpringApplication.class, args);
	}

	private static void loadDotenv() {
		try {
			if (Files.exists(Paths.get(".env"))) {
				Files.lines(Paths.get(".env"))
					.map(line -> line.trim())
					.filter(line -> !line.isEmpty() && !line.startsWith("#"))
					.forEach(line -> {
						String[] parts = line.split("=", 2);
						if (parts.length == 2) {
							System.setProperty(parts[0].trim(), parts[1].trim());
						}
					});
			}
		} catch (IOException e) {
			// ログ出力など
		}
	}

}
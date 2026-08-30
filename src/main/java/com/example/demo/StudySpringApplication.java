package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StudySpringApplication {

	public static void main(String[] args) {
		// .envの読み込みはspring-dotenvライブラリに一本化。
		// （以前あった自作loadDotenv()は削除。
		//   自作パーサーが行末インラインコメント "# ..." を除去できず、
		//   かつspring-dotenvと二重読み込みになって競合していたため）
		// Docker環境では.env自体を使わず、docker-compose.ymlのenvironmentから
		// 直接システム環境変数として注入する運用にする。
		SpringApplication.run(StudySpringApplication.class, args);
	}

}
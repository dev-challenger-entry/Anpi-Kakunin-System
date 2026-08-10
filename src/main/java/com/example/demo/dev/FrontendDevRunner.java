package com.example.demo.dev;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;

// バックエンド起動（devプロファイル時）に合わせてフロントエンド（npm run dev）も起動する
@Component
@Profile("dev")
public class FrontendDevRunner implements CommandLineRunner {

    @Override
    public void run(String... args) {
        try {
            // .envはプロジェクトルート（user.dir）にあるが、
            // package.jsonはその中の my-react-app フォルダにあるので、
            // npmコマンドの作業ディレクトリは my-react-app を指定する
            File frontendDir = new File(System.getProperty("user.dir"), "my-react-app");

            boolean isWindows = System.getProperty("os.name").toLowerCase().contains("win");
            ProcessBuilder pb = isWindows
                ? new ProcessBuilder("cmd", "/c", "npm run dev")
                : new ProcessBuilder("npm", "run", "dev");

            pb.directory(frontendDir);
            pb.redirectOutput(ProcessBuilder.Redirect.INHERIT);
            pb.redirectError(ProcessBuilder.Redirect.INHERIT);

            Process frontendProcess = pb.start();

            // バックエンドを止めたときにフロントエンドも一緒に落とす
            Runtime.getRuntime().addShutdownHook(new Thread(frontendProcess::destroy));
        } catch (IOException e) {
            System.err.println("フロントエンドの起動に失敗しました: " + e.getMessage());
        }
    }
}
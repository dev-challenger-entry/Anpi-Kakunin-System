import java.awt.Desktop;
import java.net.URI;
import java.util.Scanner;

/*
 * コンソール入力でブラウザを起動するプログラム
 *
 * ■コマンド仕様
 * g: Googleを開く
 * y: YouTubeを開く
 * その他: 無効入力としてエラーメッセージを表示
 * 1回切りで終了するプログラム
 * 
 *
 * ■前提
 * Desktop APIが利用可能な環境で動作
 *
 * ■制約
 * ・入力は1文字のみ想定
 * ・大文字入力には未対応
 * ・小文字のみ対応
 */

/* =========================
 * エントリーポイント
 * ========================= */
public class BrowserCLI { // ここをBrowserCLIという名前にしました
    public static void main(String[] args) throws Exception {
        System.out.println("メインの入り口です。g(Google) または y(YouTube) を入力してください。");

        /* =========================
         *      安全チェック
         * ========================= 
         * ブラウザ起動が可能な環境かを事前に確認するif文
         *
         * ・Desktop API自体が利用可能か
         * ・BROWSE（ブラウザ起動機能）がサポートされているか
         *
         * どちらかが非対応の場合は処理を中断する
         * （実行時エラー防止）
         *
         * 「この環境がブラウザ起動に対応してるか確認する 2 段階チェック」
         */
        if (!Desktop.isDesktopSupported() ||
            !Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
  
            System.out.println("この環境ではブラウザ起動がサポートされていません。");
            return;
        }

        // ここからユーザーから1単語の入力を受け取る流れ（コマンド取得）
        // キーボード入力を監視するScannerクラス（標準ライブラリ）を使用
        // Javaではクラス（設計図）からnew演算子でインスタンス（実体）を生成する必要があるため、
        // ここで変数を用意してnewによる実体化処理を行う
        try (Scanner sc = new Scanner(System.in)) {
 
            //cmdは独自に作った変数名で、そこにキーボードから文字を読み取る処理の結果を代入して保存する
            // sc.next() = キーボードから次の 1 単語を取得
            String cmd = sc.next();
            
            // コマンド（命令）による分岐
            /*
             * 文字列比較はequalsを使う(==を使うと参照比較になるから使用できない。
             * メモリ上の住所が同じかどうかの問いかけをすることになってしまう)
             * この場合は、入力したｇがGoogleを起動させるためのｇと同じかどうかを確認したい。
             */
            if ("g".equals(cmd)) {
                Desktop.getDesktop().browse(new URI("https://google.com"));
            } else if ("y".equals(cmd)) {
                Desktop.getDesktop().browse(new URI("https://youtube.com"));
            } else {
                System.out.println("メインの辞書にそのコマンドはありません。");
            }
        }
    }
}
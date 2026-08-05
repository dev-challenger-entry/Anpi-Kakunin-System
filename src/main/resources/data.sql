--テーブルがなければ作成する
CREATE TABLE IF NOT EXISTS employee (
    employee_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100),
    company_name VARCHAR(100),
    safety_status VARCHAR(50)
);

-- 既存のデータを一度消す（エラー防止）
DELETE FROM employee;

-- サンプル社員データの登録
INSERT INTO employee (employee_id, name, company_name, safety_status) 
VALUES ('E001', '山田 太郎', 'テスト株式会社（開発部）', '未回答');

INSERT INTO employee (employee_id, name, company_name, safety_status) 
VALUES ('E002', '佐藤 美咲', 'サンプルシステムズ（営業部）', '無事');

INSERT INTO employee (employee_id, name, company_name, safety_status) 
VALUES ('E003', '鈴木 一郎', 'デモテクノロジー（人事部）', '未回答');

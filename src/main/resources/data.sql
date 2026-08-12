SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS employee (
    employee_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100),
    company_name VARCHAR(100),
    safety_status VARCHAR(50),
    password_hash VARCHAR(255),
    role VARCHAR(20) DEFAULT 'EMPLOYEE'
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM employee;

-- サンプル社員データの登録
INSERT INTO employee (employee_id, name, company_name, safety_status, password_hash)
VALUES ('E001', '山田 太郎', 'テスト株式会社（開発部）', '未回答', NULL);
INSERT INTO employee (employee_id, name, company_name, safety_status, password_hash)
VALUES ('E002', '佐藤 美咲', 'サンプルシステムズ（営業部）', '無事', NULL);
INSERT INTO employee (employee_id, name, company_name, safety_status, password_hash)
VALUES ('E003', '鈴木 一郎', 'デモテクノロジー（人事部）', '未回答', NULL);

-- 管理者専用データ
INSERT INTO employee (employee_id, name, company_name, safety_status, password_hash, role)
VALUES ('ADMIN001', '管理者', '運営事務局', NULL, NULL, 'ADMIN');
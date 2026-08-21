SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS employees (
    employee_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100),
    section_name VARCHAR(100),
    safety_status VARCHAR(50),
    password_hash VARCHAR(255),
    role VARCHAR(20) NOT NULL,
    answered_time DATETIME,
    email VARCHAR(255),
    email2 VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 【重要】以前はここで DELETE FROM employees; を実行していたが、
-- これが原因で起動のたびに全データが初期状態へリセットされていた。
-- そのため削除した。
-- 代わりに、以下のINSERTは「INSERT IGNORE」にすることで、
-- 既にそのemployee_idが存在する場合は何もしない（＝重複エラーで起動失敗しない）ようにしている。
-- これにより、初回起動時のみサンプルデータが投入され、2回目以降は既存データがそのまま保持される。

-- サンプル社員データの登録（初回起動時のみ）
INSERT IGNORE INTO employees (
    employee_id,
    name,
    section_name,
    safety_status,
    password_hash,
    role,
    answered_time,
    email,
    email2
)
VALUES (
    'E001',
    '山田 太郎',
    '開発部',
    '未回答',
    NULL,
    'USER',
    NULL,
    NULL,
    NULL
);

INSERT IGNORE INTO employees (
    employee_id,
    name,
    section_name,
    safety_status,
    password_hash,
    role,
    answered_time,
    email,
    email2
)
VALUES (
    'E002',
    '佐藤 美咲',
    '営業部',
    '無事です',
    NULL,
    'USER',
    NULL,
    NULL,
    NULL
);

INSERT IGNORE INTO employees (
    employee_id,
    name,
    section_name,
    safety_status,
    password_hash,
    role,
    answered_time,
    email,
    email2
)
VALUES (
    'E003',
    '鈴木 一郎',
    '人事部',
    '未回答',
    NULL,
    'USER',
    NULL,
    NULL,
    NULL
);


-- 管理者専用データ（初回起動時のみ）
INSERT IGNORE INTO employees (
    employee_id,
    name,
    section_name,
    safety_status,
    password_hash,
    role,
    answered_time,
    email,
    email2
)
VALUES (
    'ADMIN001',
    '管理者サンプル',
    '運営事務局',
    NULL,
    NULL,
    'ADMIN',
    NULL,
    NULL,
    NULL
);
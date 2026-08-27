// バックエンドAPIのベースURLを一元管理する
// .envのVITE_API_BASE_URLが未設定の場合は、開発PC単体での動作を想定してlocalhostにフォールバックする
// .env に VITE_API_BASE_URL が設定されていれば、それを使う。
// 設定されていなければ http://localhost:8080 を使う。
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
import './EmployeeManage.css'

function EmployeeManage({ onBack, onLogout }) {
  return (
    <div className="employee-manage-container">

      {/* 管理者画面の見出し */}
      <div className="employee-manage-header">
        <div>管理者画面</div>
      </div>

      {/* 画面タイトル */}
      <h2 className="employee-manage-title">
        社員情報登録・更新
      </h2>

      {/* 社員情報 */}
      <div className="employee-manage-form">

        {/* 社員ID */}
        <label className="employee-manage-label">
          社員ID
        </label>

        <input
          type="text"
          className="employee-manage-input"
          placeholder="設定したいIDを入力"
        />

        {/* 社員名 */}
        <label className="employee-manage-label">
          社員名
        </label>

        <input
          type="text"
          className="employee-manage-input"
          defaultValue="社員子"
        />

        {/* 部署名 */}
        <label className="employee-manage-label">
          部署名
        </label>

        <input
          type="text"
          className="employee-manage-input"
          defaultValue="はなまる部署"
        />

        {/* 現在のパスワード */}
        <label className="employee-manage-label">
          現在のパスワード
        </label>

        <input
          type="password"
          className="employee-manage-input"
        />

        {/* 新しいパスワード */}
        <label className="employee-manage-label">
          新しいパスワード
        </label>

        <input
          type="password"
          className="employee-manage-input"
        />

        {/* 変更する */}
        <button
          type="button"
          className="employee-manage-change-button"
        >
          変更する
        </button>

        {/* 削除する */}
        <button
          type="button"
          className="employee-manage-delete-button"
        >
          削除する
        </button>

        {/* キャンセル */}
        <button
          type="button"
          className="employee-manage-cancel-button"
          onClick={onBack}
        >
          キャンセル
        </button>

        {/* ログアウト */}
        <button
          type="button"
          className="employee-manage-logout-button"
          onClick={onLogout}
        >
          ここからログアウトする
        </button>

      </div>

    </div>
  )
}

export default EmployeeManage
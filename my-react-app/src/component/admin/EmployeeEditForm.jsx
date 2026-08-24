// 社員情報の編集フォーム（検索でヒットした社員の変更・削除に使う部分）
// EmployeeManage.jsxから、状態（useState）と処理関数をpropsとして受け取って表示するだけの子コンポーネント
function EmployeeEditForm({
  name,
  setName,
  sectionName,
  setSectionName,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onSubmit,   // 「変更する」ボタン押下時の処理（親から渡ってくる）
  onDelete    // 「削除する」ボタン押下時の処理（親から渡ってくる）
}) {
  return (
    <>
      {/* 社員名の入力欄 */}
      <label className="employee-manage-label">
        社員名
      </label>
      <input
        type="text"
        className="employee-manage-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* 部署名の入力欄 */}
      <label className="employee-manage-label">
        部署名
      </label>
      <input
        type="text"
        className="employee-manage-input"
        value={sectionName}
        onChange={(e) => setSectionName(e.target.value)}
      />

      {/* 現在のパスワード
          ※本人確認用。分からない場合は空欄でもOK
          （空欄の場合は、管理者パスワードでの本人確認に切り替わる想定） */}
      <label className="employee-manage-label">
        現在のパスワード
        <span className="password-note">
          ※分からない場合は空欄でも、<br />新しいパスワードを再発行できます。
        </span>
      </label>
      <input
        type="password"
        className="employee-manage-input"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />

      {/* 新しいパスワード
          ※未入力の場合はパスワード変更なしとして扱われる */}
      <label className="employee-manage-label">
        新しいパスワード
      </label>
      <input
        type="password"
        className="employee-manage-input"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      {/* 確認用パスワード
          ※newPasswordと一致しているかは親側（EmployeeManage.jsx）でチェックする */}
      <label className="employee-manage-label">
        確認用パスワード
      </label>
      <input
        type="password"
        className="employee-manage-input"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {/* 変更するボタン
          押下後、差分チェック→確認ポップアップ表示の流れに入る（親側の処理） */}
      <button
        type="button"
        className="employee-manage-change-button"
        onClick={onSubmit}
      >
        変更する
      </button>

      {/* 削除するボタン
          押下後、確認ダイアログを経て削除APIを呼び出す（親側の処理） */}
      <button
        type="button"
        className="employee-manage-delete-button"
        onClick={onDelete}
      >
        削除する
      </button>
    </>
  )
}

export default EmployeeEditForm
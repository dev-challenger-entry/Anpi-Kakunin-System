
function RegisterFormModal({
  regEmployeeId, setRegEmployeeId,
  regName, setRegName,
  regSectionName, setRegSectionName,
  regNewPassword, setRegNewPassword,
  regConfirmPassword, setRegConfirmPassword,
  errorMsg,
  onRegister,
  onCancel
}) {
  return (
    <div className="employee-manage-modal-overlay">
      <div className="employee-manage-modal employee-manage-register-modal">
        <h3 className="employee-manage-modal-title">
          社員情報の新規登録
        </h3>

        <label className="employee-manage-label">社員ID</label>
        <input
          type="text"
          className="employee-manage-input"
          value={regEmployeeId}
          onChange={(e) => setRegEmployeeId(e.target.value)}
        />

        <label className="employee-manage-label">社員名</label>
        <input
          type="text"
          className="employee-manage-input"
          value={regName}
          onChange={(e) => setRegName(e.target.value)}
        />

        <label className="employee-manage-label">部署名</label>
        <input
          type="text"
          className="employee-manage-input"
          value={regSectionName}
          onChange={(e) => setRegSectionName(e.target.value)}
        />

        <label className="employee-manage-label">新しいパスワード</label>
        <input
          type="password"
          className="employee-manage-input"
          value={regNewPassword}
          onChange={(e) => setRegNewPassword(e.target.value)}
        />

        <label className="employee-manage-label">確認用パスワード</label>
        <input
          type="password"
          className="employee-manage-input"
          value={regConfirmPassword}
          onChange={(e) => setRegConfirmPassword(e.target.value)}
        />

        {errorMsg && (
          <p className="employee-manage-error">
            {errorMsg}
          </p>
        )}

        <button
          type="button"
          className="employee-manage-change-button"
          onClick={onRegister}
        >
          登録する
        </button>

        <button
          type="button"
          className="employee-manage-cancel-button"
          onClick={onCancel}
        >
          キャンセル
        </button>
      </div>
    </div>
  )
}

export default RegisterFormModal
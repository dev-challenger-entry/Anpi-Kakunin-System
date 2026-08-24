function ChangeConfirmModal({
  changeItems,
  currentPassword,
  adminPassword,
  setAdminPassword,
  onCancel,
  onConfirm
}) {
  return (
    <div className="employee-manage-modal-overlay">
      <div className="employee-manage-modal">
        <h3 className="employee-manage-modal-title">
          変更確認
        </h3>

        {changeItems.length > 0 ? (
          <>
            <p className="employee-manage-modal-message">
              以下の項目を変更しますか？
            </p>
            <ul className="employee-manage-modal-list">
              {changeItems.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="employee-manage-modal-message">
            変更内容がありません。
          </p>
        )}

        {!currentPassword && (
          <>
            <p className="employee-manage-modal-note">
              現在のパスワードが入力されていませんので、
              管理者アカウントのパスワードをご入力ください
            </p>
            <input
              type="password"
              className="employee-manage-input"
              placeholder="管理者アカウントのパスワード"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
          </>
        )}

        <div className="employee-manage-modal-buttons">
          <button
            type="button"
            className="employee-manage-modal-cancel"
            onClick={onCancel}
          >
            キャンセル
          </button>
          <button
            type="button"
            className="employee-manage-modal-confirm"
            onClick={onConfirm}
          >
            変更する
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChangeConfirmModal
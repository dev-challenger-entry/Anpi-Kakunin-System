function NotFoundConfirmModal({ onNo, onYes }) {
  return (
    <div className="employee-manage-modal-overlay">
      <div className="employee-manage-modal">
        <h3 className="employee-manage-modal-title">
          確認
        </h3>

        <p className="employee-manage-modal-message">
          存在しないアカウントIDです。<br />
          新規登録に進みますか？
        </p>

        <div className="employee-manage-modal-buttons">
          <button
            type="button"
            className="employee-manage-modal-cancel"
            onClick={onNo}
          >
            いいえ
          </button>
          <button
            type="button"
            className="employee-manage-modal-confirm"
            onClick={onYes}
          >
            はい
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundConfirmModal
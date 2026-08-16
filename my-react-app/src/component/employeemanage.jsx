function EmployeeManage({ onBack }) {
  return (
    <div className="admin-card">
      <h2 className="admin-title">社員情報登録・更新</h2>
      <p>（ここに検索・登録・変更の機能を今後実装）</p>
      <button onClick={onBack}>管理者画面に戻る</button>
    </div>
  )
}

export default EmployeeManage
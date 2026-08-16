function AdminSettings({ onBack }) {
  return (
    <div className="admin-card">
      <h2 className="admin-title">管理者情報変更</h2>
      <p>（ここにパスワード変更等の機能を今後実装）</p>
      <button onClick={onBack}>管理者画面に戻る</button>
    </div>
  )
}

export default AdminSettings
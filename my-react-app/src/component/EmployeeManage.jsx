import './EmployeeManage.css'
import { useState } from 'react'

function EmployeeManage({ onBack, onLogout }) {

  // 検索用（入力中のID）
  const [searchId, setSearchId] = useState('')

  // 検索結果として画面に表示する項目
  const [employeeId, setEmployeeId] = useState('')
  const [name, setName] = useState('')
  const [sectionName, setSectionName] = useState('')

  // パスワード
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // 検索結果が見つかったか
  const [employeeFound, setEmployeeFound] = useState(false)

  // エラーメッセージ
  const [errorMsg, setErrorMsg] = useState('')

  // 社員ID検索：入力されたIDでバックエンドに問い合わせる
  const handleSearch = async () => {
    setErrorMsg('')
    setEmployeeFound(false)

    // 空欄のままEnterやフォーカス外れを防ぐ
    if (!searchId) {
      setErrorMsg('ID入力欄が未記入です')
      return
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/employees/${searchId}`,
        { credentials: 'include' }
      )

      if (res.status === 404) {
        setErrorMsg('存在しないアカウントIDです')

        // 前回の検索結果が残らないようにクリア
        setEmployeeId('')
        setName('')
        setSectionName('')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')

        return
      }

      if (!res.ok) {
        setErrorMsg('データの取得に失敗しました')
        return
      }

      const data = await res.json()

      setEmployeeId(data.employeeId)
      setName(data.name)
      setSectionName(data.sectionName)

      // 社員情報が見つかったので入力欄を表示
      setEmployeeFound(true)

    } catch (err) {
      console.error(err)
      setErrorMsg('サーバーに接続できませんでした')
    }
  }

  // パスワード変更
  const handlePasswordChange = () => {
    setErrorMsg('')

    // 新しいパスワードと確認用パスワードが一致しているか確認
    if (newPassword !== confirmPassword) {
      setErrorMsg('新しいパスワードと確認用パスワードが一致していません')
      return
    }

    // ここまで来たらパスワードが一致している
    console.log('パスワードが一致しています')

    // TODO:
    // ここにバックエンドへパスワード変更リクエストを送る処理を追加する
  }

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

        {/* 社員ID検索欄 */}
        <label className="employee-manage-label">
          社員ID
        </label>

        <input
          type="text"
          className="employee-manage-input"
          placeholder="設定したいIDを入力"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          onBlur={handleSearch}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch()
          }}
        />

        {errorMsg && (
          <p className="employee-manage-error">
            {errorMsg}
          </p>
        )}

        {/* 検索結果が見つかった場合のみ表示 */}
        {employeeFound && (
          <>
            {/* 社員名 */}
            <label className="employee-manage-label">
              社員名
            </label>

            <input
              type="text"
              className="employee-manage-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* 部署名 */}
            <label className="employee-manage-label">
              部署名
            </label>

            <input
              type="text"
              className="employee-manage-input"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
            />

            {/* 現在のパスワード */}
            <label className="employee-manage-label">
              現在のパスワード
            </label>

            <input
              type="password"
              className="employee-manage-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            {/* 新しいパスワード */}
            <label className="employee-manage-label">
              新しいパスワード
            </label>

            <input
              type="password"
              className="employee-manage-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            {/* 確認用パスワード */}
            <label className="employee-manage-label">
              確認用パスワード
            </label>

            <input
              type="password"
              className="employee-manage-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* 変更する */}
            <button
              type="button"
              className="employee-manage-change-button"
              onClick={handlePasswordChange}
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
          </>
        )}

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
import './AdminSettings.css'
import Logout from './Logout'

import { useState, useEffect } from 'react'

function AdminSettings({ onBack, onLogout }) {

  // 初期表示専用（変更不可）
  const [employeeId, setEmployeeId] = useState('')

  // 編集可能な項目
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [email2, setEmail2] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')

  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

// 初期表示：現在の管理者情報を取得
useEffect(() => {
  fetch('http://localhost:8080/api/admin/me', {
    credentials: 'include'
  })
    .then(res => res.json())
    .then(data => {
      setEmployeeId(data.employeeId)
      setName(data.name)
      setEmail(data.email)
    })
}, [])
      

  return (

     <div className="admin-settings-container">

      {/* 管理者画面の見出し */}
      <div className="admin-settings-header">
        <div>管理者画面</div>
      </div>

      {/* 画面タイトル */}
      <h2 className="admin-settings-title">
        管理者情報変更
      </h2>

      {/* 管理者情報 */}
      <div className="admin-settings-form">

        {/* 管理者ID */}
        <label className="admin-settings-label">
          管理者ID
        </label>

        <div className="admin-settings-input disabled">
          Admin001　※変更不可
        </div>

        {/* 管理者名 */}
        <label className="admin-settings-label">
          管理者名
        </label>

        <input
          type="text"
          className="admin-settings-input"
          value={name}
          // value を渡すと編集不能になるが、以下のコードで編集可能に
          onChange={(e) => setName(e.target.value)}
        />

        {/* メールアドレス */}
        <label className="admin-settings-label">
          メールアドレス
        </label>

        <input
          type="email"
          className="admin-settings-input"
          defaultValue="admin@example.com"
        />

        {/* 現在のパスワード */}
        <label className="admin-settings-label">
          現在のパスワード
        </label>

        <input
          type="password"
          className="admin-settings-input"
        />

        {/* 新しいパスワード */}
        <label className="admin-settings-label">
          新しいパスワード
        </label>

        <input
          type="password"
          className="admin-settings-input"
        />

        {/* 新しいパスワード確認 */}
        <label className="admin-settings-label">
          新しいパスワード（確認）
        </label>

        <input
          type="password"
          className="admin-settings-input"
        />

        {/* 変更ボタン */}
        <button className="admin-settings-change-button">
          変更する
        </button>

        {/* キャンセル */}
        <button
          className="admin-settings-cancel-button"
          onClick={onBack}
        >
          キャンセル
        </button>

        {/* ログアウト */}
           <button
              type="button"
              className="admin-settings-logout-button"
              onClick={onLogout}>
             ここからログアウトする
           </button>

      </div>

    </div>
  )
}

export default AdminSettings
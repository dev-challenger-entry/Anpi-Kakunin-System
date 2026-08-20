import './AdminSettings.css'
import Logout from './Logout'

import { useState, useEffect } from 'react'

function AdminSettings({ onBack, onLogout }) {

  // ================================
  // 管理者情報
  // ================================

  // 管理者ID
  // 今は初期表示のみで使用し、変更できないようにする
  const [employeeId, setEmployeeId] = useState('')

  // 管理者名
  // 画面上で変更可能
  const [name, setName] = useState('')

  // メールアドレス
  // 画面上で変更可能
  const [email, setEmail] = useState('')

  // メールアドレス確認用
  // 現在は入力欄のみ用意されている
  const [email2, setEmail2] = useState('')


  // ================================
  // パスワード変更用
  // ================================

  // 現在設定されているパスワード
  // パスワード変更時に本人確認のため入力する
  const [currentPassword, setCurrentPassword] = useState('')

  // 変更後に設定する新しいパスワード
  const [newPassword, setNewPassword] = useState('')

  // 新しいパスワードの確認入力
  // newPasswordと一致しているか確認するために使用する
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')


  // ================================
  // メッセージ表示用
  // ================================

  // エラーメッセージ
  const [errorMsg, setErrorMsg] = useState('')

  // 更新成功時のメッセージ
  const [successMsg, setSuccessMsg] = useState('')

  // ================================
  // 変更確認ポップアップ用
  // ================================

  // 確認ポップアップを表示するか
  const [showConfirm, setShowConfirm] = useState(false)

  // 実際に変更する項目
  const [changeItems, setChangeItems] = useState([])

  // ================================
  // 送信日時表示用
  // ================================

  // 最後に変更処理を送信した時刻
  const [lastSendTime, setLastSendTime] = useState('')

  // ================================
  // 初期表示処理
  // ================================
  // 初期表示：現在の管理者情報を取得
  useEffect(() => {

    // 管理者自身の情報を取得するAPIを呼び出す
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
  // ================================
  // 変更ボタンを押したときの処理
  // ================================
  // 入力チェックをして、確認ポップアップを表示する
  const handleSubmit = () => {

    // 前回表示されていたエラーメッセージを消す
    setErrorMsg('')

    // 前回表示されていた成功メッセージを消す
    setSuccessMsg('')

    // ================================
    // メールアドレスの入力チェック
    // ================================

    // メールアドレスに@がちょうど1個あるかチェック
    if ((email.match(/@/g) || []).length !== 1) {
      setErrorMsg('@を1つだけ入力してください')
      return
    }

    // ================================
    // パスワードの入力チェック
    // ================================

    // 新しいパスワードを入力した場合のみ、
    // 確認用パスワードと一致しているかチェック
    if (newPassword && newPassword !== newPasswordConfirm) {
      setErrorMsg('新しいパスワードと確認用パスワードが一致しません')
      return
    }

    // ================================
    // 変更する項目を確認
    // ================================

    const items = []

    // メールアドレス
    if (email) {
      items.push('メールアドレス')
    }

    // パスワード
    if (newPassword) {
      items.push('パスワード')
    }

    // 変更項目を保存
    setChangeItems(items)

    // 確認ポップアップを表示
    setShowConfirm(true)
  }


  // ================================
  // 確認後の実際の更新処理
  // ================================
  const handleConfirmChange = async () => {

    // ポップアップを閉じる
    setShowConfirm(false)

    // 送信した現在時刻を取得する
    const sendTime = new Date().toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })

    // 最終送信日時として画面に表示する
    setLastSendTime(sendTime)

    try {

      const res = await fetch('http://localhost:8080/api/admin/me', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          currentPassword,
          newPassword
        }),
      })

      const data = await res.json()

      // ================================
      // 更新結果の処理
      // ================================

      if (data.success) {
        setSuccessMsg(data.message || '更新に成功しました')
      } else {
        setErrorMsg(data.message || '更新に失敗しました')
      }

    } catch (err) {
      console.error(err)
      setErrorMsg('サーバーに接続できませんでした')
    }
  }
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
          {employeeId}　※変更不可
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="admin-settings-manual">
          ※パスワード変更のみの場合も、<br />
          メールアドレスの入力が必要です。
        </label>

        {/* 現在のパスワード */}
        <label className="admin-settings-label">
          現在のパスワード
        </label>

        <input
          type="password"
          className="admin-settings-input"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        {/* 新しいパスワード */}
        <label className="admin-settings-label">
          新しいパスワード
        </label>


        <input
          type="password"
          className="admin-settings-input"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        {/* 新しいパスワード確認 */}
        <label className="admin-settings-label">
          新しいパスワード（確認）
        </label>

        <input
          type="password"
          className="admin-settings-input"
          value={newPasswordConfirm}
          onChange={(e) => setNewPasswordConfirm(e.target.value)}
        />

        {/* エラーメッセージ */}
        {errorMsg && (
          <div className="admin-settings-error">
            {errorMsg}
          </div>
        )}

        {/* 成功メッセージ */}
        {successMsg && (
          <div className="admin-settings-success">
            {successMsg}
          </div>
        )}

        {/* 最終送信日時 */}
        {lastSendTime && (
          <div className="admin-settings-send-time">
            最終送信日時：{lastSendTime}
          </div>
        )}

        {/* 変更ボタン */}
        <button className="admin-settings-change-button" onClick={handleSubmit}>
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

        {/* ================================
                変更確認ポップアップ
        ================================ */}

        {showConfirm && (
          <div className="admin-settings-modal-overlay">

            <div className="admin-settings-modal">

              <h3 className="admin-settings-modal-title">
                変更確認
              </h3>

              {changeItems.length === 1 && changeItems[0] === 'メールアドレス' ? (
                <>
                  <p className="admin-settings-modal-message">
                    メールアドレスを変更しますか？
                  </p>

                  <div className="admin-settings-modal-email">
                    変更後：<br />
                    {email}
                  </div>
                </>
              ) : (
                <>
                  <p className="admin-settings-modal-message">
                    以下の情報を変更しますか？
                  </p>

                  <ul className="admin-settings-modal-list">
                    {changeItems.includes('メールアドレス') && (
                      <li>メールアドレス</li>
                    )}

                    {changeItems.includes('パスワード') && (
                      <li>パスワード</li>
                    )}
                  </ul>

                  {changeItems.includes('パスワード') && (
                    <p className="admin-settings-modal-note">
                      ※パスワードは入力した新しいパスワードに変更されます。
                    </p>
                  )}
                </>
              )}

              <div className="admin-settings-modal-buttons">

                {/* ポップアップを閉じる */}
                <button
                  type="button"
                  className="admin-settings-modal-cancel"
                  onClick={() => setShowConfirm(false)}
                >
                  キャンセル
                </button>

                {/* 実際に変更する */}
                <button
                  type="button"
                  className="admin-settings-modal-confirm"
                  onClick={handleConfirmChange}
                >
                  変更する
                </button>

              </div>

            </div>

          </div>
        )}


      </div>

    </div>
  )
}

export default AdminSettings
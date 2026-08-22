import './EmployeeManage.css'
import { useState } from 'react'

function EmployeeManage({ onBack, onLogout }) {

  // 検索用（入力中のID）
  const [searchId, setSearchId] = useState('')

  // 検索結果として画面に表示する項目
  const [employeeId, setEmployeeId] = useState('')
  const [name, setName] = useState('')
  const [sectionName, setSectionName] = useState('')

  // 検索直後の元データ（変更する項目の差分比較に使う）
  const [originalData, setOriginalData] = useState(null)

  // パスワード
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // 現在のパスワードが未入力の場合に、代わりに入力してもらう
  // ログイン中の管理者自身のパスワード（本人確認用）
  const [adminPassword, setAdminPassword] = useState('')

  // 検索結果が見つかったか
  const [employeeFound, setEmployeeFound] = useState(false)

  // エラーメッセージ
  const [errorMsg, setErrorMsg] = useState('')

  // ================================
  // 変更確認ポップアップ用
  // ================================

  // 確認ポップアップを表示するか
  const [showConfirm, setShowConfirm] = useState(false)

  // 実際に変更する項目（元データとの差分）
  const [changeItems, setChangeItems] = useState([])


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
        setOriginalData(null)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setAdminPassword('')

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

      // 変更前の状態として保存しておく（あとで差分比較に使う）
      setOriginalData({
        employeeId: data.employeeId,
        name: data.name,
        sectionName: data.sectionName,
      })

      // 社員情報が見つかったので入力欄を表示
      setEmployeeFound(true)

    } catch (err) {
      console.error(err)
      setErrorMsg('サーバーに接続できませんでした')
    }
  }


  // 「変更する」ボタン押下時の処理
  // 入力チェックと変更差分の洗い出しを行い、確認ポップアップを表示する
  const handleSubmit = () => {

    setErrorMsg('')

    // 新しいパスワードと確認用パスワードが一致しているかチェック
    // （新しいパスワードを入力した場合のみチェックする）
    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg('新しいパスワードと確認用パスワードが一致していません')
      return
    }

    // ================================
    // 元データとの差分を洗い出す
    // ================================
    const items = []

    if (originalData) {
      if (name !== originalData.name) {
        items.push('社員名')
      }
      if (sectionName !== originalData.sectionName) {
        items.push('部署名')
      }
    }

    if (newPassword) {
      items.push('パスワード')
    }

    // 変更項目を保存
    setChangeItems(items)

    // 確認ポップアップを表示
    // （現在のパスワードが未入力の場合は、ポップアップ内で
    //   管理者自身のパスワード入力を追加で求める）
    setShowConfirm(true)
  }


  // ================================
  // 確認後の実際の更新処理
  // ================================
  const handleConfirmChange = async () => {

    // 現在のパスワードが未入力の場合、代わりに
    // 管理者自身のパスワードが入力されているか確認する
    if (!currentPassword && !adminPassword) {
      setErrorMsg('管理者アカウントのパスワードを入力してください')
      return
    }

    // ポップアップを閉じる
    setShowConfirm(false)
    setErrorMsg('')

    try {
      const res = await fetch('http://localhost:8080/api/admin/employees', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId,
          name,
          sectionName,
          currentPassword,
          newPassword,
          // 現在のパスワードが未入力だった場合の本人確認用
          adminPassword,
        }),
      })

      const data = await res.json()

      if (data.success) {
        // 更新成功後は元データを最新化しておく
        setOriginalData({ employeeId, name, sectionName })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setAdminPassword('')
      } else {
        setErrorMsg(data.message || '更新に失敗しました')
      }

    } catch (err) {
      console.error(err)
      setErrorMsg('サーバーに接続できませんでした')
    }
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
              onClick={handleSubmit}
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

        {/* ================================
                変更確認ポップアップ
                （AdminSettings.jsxと同じデザイン構成）
        ================================ */}
        {showConfirm && (
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

              {/* 現在のパスワードが未入力のときだけ表示 */}
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

                {/* ポップアップを閉じる */}
                <button
                  type="button"
                  className="employee-manage-modal-cancel"
                  onClick={() => setShowConfirm(false)}
                >
                  キャンセル
                </button>

                {/* 実際に変更する */}
                <button
                  type="button"
                  className="employee-manage-modal-confirm"
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

export default EmployeeManage
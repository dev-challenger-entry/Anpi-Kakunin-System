import { useState, useEffect } from 'react'

// 各画面のコンポーネントを読み込む
import Login from './component/Auth/Login'
import MyPage from './component/mypage/MyPage'
import AdminStatusSummary from './component/admin/Admin'
import Recaptcha from './component/Auth/ReCaptcha'
import EmployeeManage from './component/admin/EmployeeManage'
import AdminSettings from './component/admin/AdminSettings'

// App.jsx用のCSS
import './App.css'

function App() {

  // ログインした社員のIDを保持する
  // nullの場合は、まだログインしていない
  const [loggedInEmployeeId, setLoggedInEmployeeId] = useState(null)

  // ログインした社員の権限を保持する
  // 例：'ADMIN'、'USER'
  const [role, setRole] = useState(null)

  // 管理者が、確認画面(CAPTCHA）を突破したかどうか
  const [captchaVerified, setCaptchaVerified] = useState(false)

  // 管理者画面内でどの画面を表示するかを管理する
  // 'summary'（集計結果） | 'employeeManage'（社員情報登録・変更） | 'adminSettings'（管理者情報変更）
  const [adminView, setAdminView] = useState('summary')

  // 管理者画面を切り替えたとき、スクロール位置を先頭に戻す
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [adminView])

  // ログアウト完了メッセージを保持する
  const [logoutMessage, setLogoutMessage] = useState('')

  // Loginコンポーネントから呼び出される
  // ログイン成功時に社員IDと権限を受け取る
  const handleLoginSuccess = (employeeId, role) => {
    setLoggedInEmployeeId(employeeId)
    setRole(role)
  }

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/api/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('ログアウトエラー:', error)
    }

    setLoggedInEmployeeId(null)
    setRole(null)
    setCaptchaVerified(false)
    setAdminView('summary')
    setLogoutMessage('ログアウトしました。ブラウザを再読み込みしてください。')
  }

  // ログイン後に認証状態を保持
  const handleCaptchaSuccess = () => {
    setCaptchaVerified(true)
  }

  const renderMainContent = () => {
    // ① 未ログイン
    // → ここは「ログインしているかどうか」という単発の条件なので、switch化はしない
    if (!loggedInEmployeeId) {
      return <Login onLoginSuccess={handleLoginSuccess} />
    }

    // ② ログイン済み・一般社員
    // → roleが'ADMIN'かどうかの単発条件。switchにする意味がない
    if (role !== 'ADMIN') {
      return <MyPage employeeId={loggedInEmployeeId} onLogout={handleLogout} />
    }

    // ③ ログイン済み・管理者・CAPTCHA未認証
    // → captcha認証済みかどうかの単発条件。これもswitch向きではない
    if (!captchaVerified) {
      return <Recaptcha onSuccess={handleCaptchaSuccess} />
    }

    // ④ ログイン済み・管理者・CAPTCHA認証済み
    // → adminViewの値で管理者画面を切り替える
    switch (adminView) {
      case 'employeeManage':
        return (
          <EmployeeManage
            onBack={() => setAdminView('summary')}
            onLogout={handleLogout}
          />
        )

      case 'adminSettings':
        return (
          <AdminSettings
            onBack={() => setAdminView('summary')}
            onLogout={handleLogout}
          />
        )

      // 管理者集計画面および想定外の値の場合はここに落ちる
      default:
        return (
          <AdminStatusSummary
            onNavigateToEmployeeManage={() => setAdminView('employeeManage')}
            onNavigateToAdminSettings={() => setAdminView('adminSettings')}
            onLogout={handleLogout}
          />
        )
    }
  }

  // ログアウト画面を描画する
  const renderAppContent = () => {
    // ログアウト直後
    if (logoutMessage) {
      return (
        <p className="logout-message">
          {logoutMessage}
        </p>
      )
    }

    return (
      <>
        <div className="system-header">
          <h1 className="system-title">
            安否確認システム
          </h1>

          <div className="company-name">
            サンプル企業
          </div>
        </div>

        {/* 現在の状態に応じて「どのコンポーネントを表示するか」を決定し、その結果を画面に描画する */}
        {renderMainContent()}

      </>
    )
  }
  // アプリ全体を表示する
  return renderAppContent()
}

export default App
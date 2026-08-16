import { useState } from 'react'

// 各画面のコンポーネントを読み込む
import Login from './component/login'
import MyPage from './component/mypage'
import AdminStatusSummary from './component/admin'
import Recaptcha from './component/recaptcha'
import EmployeeManage from './component/employeeManage'
import AdminSettings from './component/adminSettings'

// App.jsx用のCSS
import './App.css'

function App() {

  // ログインした社員のIDを保持する
  // nullの場合は、まだログインしていない
  const [loggedInEmployeeId, setLoggedInEmployeeId] = useState(null)

  // ログインした社員の権限を保持する
  // 例：'ADMIN'、'USER'
  const [role, setRole] = useState(null)

  //管理者が、確認画面(CAPTCHA）を突破したかどうか
  const [captchaVerified, setCaptchaVerified] = useState(false)

  // 管理者画面内でどの画面を表示するかを管理する
  // 'summary'（集計結果） | 'employeeManage'（社員情報登録・変更） | 'adminSettings'（管理者情報変更）
  const [adminView, setAdminView] = useState('summary')

  // Loginコンポーネントから呼び出される
  // ログイン成功時に社員IDと権限を受け取る
  const handleLoginSuccess = (employeeId, role) => {
    setLoggedInEmployeeId(employeeId)
    setRole(role)
  }

   //ログイン後に認証状態を保持
  const handleCaptchaSuccess = () => {
    setCaptchaVerified(true)
  }

   // 三項演算子のネストは読みにくいのでifにした
  const renderMainContent = () => {
    // ① 未ログイン
    if (!loggedInEmployeeId) {
      return <Login onLoginSuccess={handleLoginSuccess} />
    }

    // ② ログイン済み・一般社員
    if (role !== 'ADMIN') {
      return <MyPage employeeId={loggedInEmployeeId} />
    }

    // ③ ログイン済み・管理者・CAPTCHA未認証
    if (!captchaVerified) {
      return <Recaptcha onSuccess={handleCaptchaSuccess} />
    }

    // ④ ログイン済み・管理者・CAPTCHA認証済み → adminView で画面切り替え
    if (adminView === 'employeeManage') {
      return <EmployeeManage onBack={() => setAdminView('summary')} />
    }
    if (adminView === 'adminSettings') {
      return <AdminSettings onBack={() => setAdminView('summary')} />
    }
    return (
      <AdminStatusSummary
        onNavigateToEmployeeManage={() => setAdminView('employeeManage')}
        onNavigateToAdminSettings={() => setAdminView('adminSettings')}
      />
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

export default App
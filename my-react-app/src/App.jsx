import { useState } from 'react'

// 各画面のコンポーネントを読み込む
import Login from './component/Login'
import MyPage from './component/MyPage'
import AdminStatusSummary from './component/Admin'
import Recaptcha from './component/ReCaptcha'
import EmployeeManage from './component/EmployeeManage'
import AdminSettings from './component/AdminSettings'

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

    const handleLogout = () => {
    setLoggedInEmployeeId(null)
    setRole(null)
    setCaptchaVerified(false)
    setAdminView('summary')
  }

   //ログイン後に認証状態を保持
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
    return <MyPage employeeId={loggedInEmployeeId}  onLogout={handleLogout} />
  }

  // ③ ログイン済み・管理者・CAPTCHA未認証
  // → captcha認証済みかどうかの単発条件。これもswitch向きではない
  if (!captchaVerified) {
    return <Recaptcha onSuccess={handleCaptchaSuccess} />
  }

  // ④ ログイン済み・管理者・CAPTCHA認証済み → adminViewの値で管理者画面を切り替える
  // → ここは「adminViewという1つの変数の値」による分岐なので、switchに向いている
  switch (adminView) {
    case 'employeeManage':
      return <EmployeeManage onBack={() => setAdminView('summary')} />
              onLogout={handleLogout}
    case 'adminSettings':
      return <AdminSettings onBack={() => setAdminView('summary')} 
              onLogout={handleLogout}
      />

    // 'summary'および想定外の値の場合はここに落ちる
    default:
      return (
        <AdminStatusSummary
          onNavigateToEmployeeManage={() => setAdminView('employeeManage')}
          onNavigateToAdminSettings={() => setAdminView('adminSettings')}
        />
      )
  }
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
import { useState, useEffect } from 'react'

// 各画面のコンポーネントを読み込む
import Login from './component/Auth/Login'
import MyPage from './component/mypage/MyPage'
import AdminStatusSummary from './component/admin/Admin'
import Recaptcha from './component/Auth/ReCaptcha'
import EmployeeManage from './component/admin/EmployeeManage'
import AdminSettings from './component/admin/AdminSettings'
import { API_BASE_URL } from './config/api'

// App.jsx用のCSS
import './App.css'

function App() {

  const [loggedInEmployeeId, setLoggedInEmployeeId] = useState(null)
  const [role, setRole] = useState(null)
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [adminView, setAdminView] = useState('summary')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [adminView])

  const [logoutMessage, setLogoutMessage] = useState('')

  const handleLoginSuccess = (employeeId, role) => {
    setLoggedInEmployeeId(employeeId)
    setRole(role)
  }

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/logout`, {
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

  const handleCaptchaSuccess = () => {
    setCaptchaVerified(true)
  }

  const renderMainContent = () => {
    if (!loggedInEmployeeId) {
      return <Login onLoginSuccess={handleLoginSuccess} />
    }

    if (role !== 'ADMIN') {
      return <MyPage employeeId={loggedInEmployeeId} onLogout={handleLogout} />
    }

    if (!captchaVerified) {
      return <Recaptcha onSuccess={handleCaptchaSuccess} />
    }

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

  const renderAppContent = () => {
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

        {renderMainContent()}

      </>
    )
  }
  return renderAppContent()
}

export default App
import { useState } from 'react'

import Login from './component/login'
import MyPage from './component/mypage'
import AdminStatusSummary from './component/admin'
import './App.css'

function App() {
  const [loggedInEmployeeId, setLoggedInEmployeeId] = useState(null)
  const [role, setRole] = useState(null)

  const handleLoginSuccess = (employeeId, role) => {
    setLoggedInEmployeeId(employeeId)
    setRole(role)
  }

  return (
    <>
      <div className="system-header">
        <h1 className="system-title">安否確認システム</h1>
        <div className="company-name">サンプル企業</div>
      </div>

      <div>
        {!loggedInEmployeeId ? (
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : role === 'ADMIN' ? (
          <AdminStatusSummary />
        ) : (
          <MyPage employeeId={loggedInEmployeeId} />
        )}
      </div>
    </>
  )
}

export default App
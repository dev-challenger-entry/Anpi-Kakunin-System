import { useState, useEffect, useRef } from 'react'

import Login from './component/Login'
import MyPage from './component/MyPage'
import './App.css'

function App() {
  const [loggedInEmployeeId, setLoggedInEmployeeId] = useState(null);

  return (
  <>

    <div className="system-header">
      <h1 className="system-title">安否確認システム</h1>
      <div className="company-name">サンプル企業</div>
    </div>

    <div>  
      {!loggedInEmployeeId ? (
        <Login onLoginSuccess={(employeeId) => setLoggedInEmployeeId(employeeId)} />
      ) : (
        <MyPage employeeId={loggedInEmployeeId} />
      )}
    </div>
  
  </>

  )
}

export default App
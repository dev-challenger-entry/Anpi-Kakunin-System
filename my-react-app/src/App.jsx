import { useState, useEffect, useRef } from 'react'
//今は中身がないが、今後作る予定だからインポート宣言は残す

import Login from './component/Login'
import MyPage from './component/MyPage'
import './App.css'

function App() {
  const [loggedInEmployeeId, setLoggedInEmployeeId] = useState(null);

  return (
    <div>
      {!loggedInEmployeeId ? (
        <Login onLoginSuccess={(employeeId) => setLoggedInEmployeeId(employeeId)} />
      ) : (
        <MyPage employeeId={loggedInEmployeeId} />
      )}
    </div>
  )
}

export default App
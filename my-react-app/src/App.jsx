import { useState, useEffect, useRef } from 'react'

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
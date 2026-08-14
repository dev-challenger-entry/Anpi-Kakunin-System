import { useState } from 'react'

// 各画面のコンポーネントを読み込む
import Login from './component/login'
import MyPage from './component/mypage'
import AdminStatusSummary from './component/admin'
import Recaptcha from './component/recaptcha'

// App.jsx用のCSS
import './App.css'

function App() {

  // ログインした社員のIDを保持する
  // nullの場合は、まだログインしていない
  const [loggedInEmployeeId, setLoggedInEmployeeId] = useState(null)

  // ログインした社員の権限を保持する
  // 例：'ADMIN'、'USER'
  const [role, setRole] = useState(null)


  // Loginコンポーネントから呼び出される
  // ログイン成功時に社員IDと権限を受け取る
  const handleLoginSuccess = (employeeId, role) => {
    setLoggedInEmployeeId(employeeId)
    setRole(role)
  }


  return (
    <>

      {/* システム共通ヘッダー */}
      <div className="system-header">
        <h1 className="system-title">
          安否確認システム
        </h1>

        <div className="company-name">
          サンプル企業
        </div>
      </div>


      {/* ログイン状態・権限によって表示する画面を切り替える */}
      <div>

        {/* まだログインしていない場合 → ログイン画面 */}
        {!loggedInEmployeeId ? (

          <Login onLoginSuccess={handleLoginSuccess} />

        ) : role === 'ADMIN' ? (

          /* ADMINの場合 → 管理者画面 */
          <Recaptcha />

        ) : (

          /* ADMIN以外の場合 → マイページ */
          <MyPage employeeId={loggedInEmployeeId} />

        )}

      </div>

    </>
  )
}

export default App
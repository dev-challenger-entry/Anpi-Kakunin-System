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


      {/* ログイン状態・権限によって表示する画面を切り替える */}
      <div>

        {/* まだログインしていない場合 → ログイン画面 */} 

         {!loggedInEmployeeId ? (
          <Login onLoginSuccess={handleLoginSuccess} />
          /* ログイン済み ＋ ADMINの場合 → CAPTCHA認証を確認 */
          ) : role === 'ADMIN' ? (
          captchaVerified ? (
          /* CAPTCHA認証済み → 管理者画面 */
          <AdminStatusSummary />
          ) : (
           /* CAPTCHA未認証 → CAPTCHA画面 */
          <Recaptcha onSuccess={handleCaptchaSuccess} />
          )
          ) : (
            /* ADMINではない場合 → マイページ */
          <MyPage employeeId={loggedInEmployeeId} />
          )}

      </div>

    </>
  )
}

export default App
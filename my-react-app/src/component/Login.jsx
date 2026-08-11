import './Login.css'

function Login({ onLoginSuccess }) {
  return (
    <div className="login-card">
      <h1 className="system-title">安否確認システム</h1>
      <div className="company-name">サンプル企業</div>
      <button className="login-button" onClick={() => onLoginSuccess('test-employee-id')}>
        ログイン（仮）
      </button>
    </div>
  )
}

export default Login
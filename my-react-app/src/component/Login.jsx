import { useState } from 'react'
import './Login.css'

function Login({ onLoginSuccess }) {
const [id, setId] = useState('')
const [password, setPassword] = useState('') 

  return (
    <div className="login-card">
      <h1 className="system-title">安否確認システム</h1>
      <div className="company-name">サンプル企業</div>

      <div className="form-group">
        <label htmlFor="id">ID</label>
        <input
          id="id"
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">PASS</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="login-button" onClick={() => onLoginSuccess('test-employee-id')}>
        ログイン（仮）
      </button>
    </div>
  )
}
export default Login
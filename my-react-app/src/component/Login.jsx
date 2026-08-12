import { useState } from 'react'
import './Login.css'

function Login({ onLoginSuccess }) {
const [id, setId] = useState('')
const [password, setPassword] = useState('') 
// エラーメッセージを画面に表示するための「変数」と「それを更新する関数」
const [errorMsg, setErrorMsg] = useState('')
// ユーザーがログインボタンを押したときに実行する、非同期の関数を定義
const handleLogin = async () => {
      setErrorMsg('')
//サーバーにログインリクエストを送信
      try {
      //処理が来るまで待機
      const res = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        //実際に送るデータの中身がこれ
        body: JSON.stringify({ employeeId: id, password: password }),
      })
      //サーバーから来たデータをジャバスクリプトに使えるデータへ変換する
　　　 const data = await res.json()

     //ログインの合否（結果）に応じて、画面の表示を切り替える条件分岐とエラー処理
    if (data.success) {
        onLoginSuccess(data.employeeId)
      } else {
        setErrorMsg(data.message || 'ログインに失敗しました')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('サーバーに接続できませんでした')
    }
  }


  return (
    <>
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
          onKeyDown={(e) => { if (e.key === 'Enter') handleLogin()}}
        />
      </div>

      <button className="login-button" onClick={handleLogin}>
        ログイン（仮）
      </button>
    
    </>
  )
}
export default Login
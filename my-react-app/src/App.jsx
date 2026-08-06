import { useState, useEffect } from 'react'
//今は中身がないが、今後作る予定だからインポート宣言は残す
import './App.css'

function App() {
  const [employee, setEmployee] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  // マイページ取得（動作確認用：サンプル社員E001で固定）
  useEffect(() => {
    fetch('http://localhost:8080/api/mypage?employeeId=E001', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          setEmployee(data);
        }
      });
  }, []);

  return (
    <div>
      {errorMsg && <p>{errorMsg}</p>}
      {employee && (
        <div>
          <p>社員ID：{employee.employeeId}</p>
          <p>名前：{employee.name}</p>
          <p>所属企業：{employee.companyName}</p>
          <p>安否状況：{employee.safetyStatus}</p>
        </div>
      )}
    </div>
  )
}

export default App
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

// ① プルダウンの選択肢を追加
const STATUS_OPTIONS = [
  { value: 'UNANSWERED', label: '未回答' },
  { value: 'SAFE', label: '無事です' },
  { value: 'EVACUATED', label: '避難しました' },
  { value: 'UNABLE_TO_COMMUTE', label: '出勤困難' },
];

// ② プルダウンが変更されたら反応する処理
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    
    try {
    const res = await fetch(`http://localhost:8080/api/status/${employee.employeeId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

      if (!res.ok) {
     throw new Error('更新に失敗しました');
    }

    const updatedStatus = await res.text();

    // 返ってきた値でstateを更新→これが次の表示のデフォルトになる
    setEmployee(prev => ({ ...prev, safetyStatus: updatedStatus }));

   } catch (err) {
      console.error(err);
      setErrorMsg('安否状況の更新に失敗しました。');
   }

  };



  return (
    <div>
      {errorMsg && <p>{errorMsg}</p>}
      {employee && (
        <div>
          <p>社員ID：{employee.employeeId}</p>
          <p>名前：{employee.name}</p>
          <p>所属企業：{employee.companyName}</p>
          <p>安否状況：{employee.safetyStatus}</p>
        
        <select value={employee.safetyStatus} onChange={handleStatusChange}>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        </div>
      )}
    </div>
  )
}

export default App
import { useState, useEffect } from 'react'
import './MyPage.css'

const STATUS_OPTIONS = [
  { value: 'UNANSWERED', label: '未回答' },
  { value: 'SAFE', label: '無事です' },
  { value: 'EVACUATED', label: '避難しました' },
  { value: 'UNABLE_TO_COMMUTE', label: '出勤困難' },
];

const getLabel = (value) => STATUS_OPTIONS.find(opt => opt.value === value)?.label ?? value;

function MyPage({ employeeId }) {
  const [employee, setEmployee] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [screen, setScreen] = useState('mypage'); // 'mypage' | 'complete'

  useEffect(() => {
    fetch(`http://localhost:8080/api/mypage?employeeId=${employeeId}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          setEmployee(data);
          setSelectedStatus(data.safetyStatus);
        }
      });
  }, [employeeId]);

  const handleSelectChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/status/${employee.employeeId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (!res.ok) throw new Error('更新に失敗しました');

      const updatedStatus = await res.text();
      setEmployee(prev => ({ ...prev, safetyStatus: updatedStatus }));
      setScreen('complete');
    } catch (err) {
      console.error(err);
      setErrorMsg('安否状況の更新に失敗しました。');
    }
  };

  return (
    <div>
      {errorMsg && <p>{errorMsg}</p>}

      {employee && screen === 'mypage' && (
        <div className="mypage-card">
          <p>【{employee.companyName}】</p>
          <p>社員名：{employee.name}</p>

          <label>現在の状況</label>
          <select value={selectedStatus} onChange={handleSelectChange}>
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button onClick={handleSubmit}>送信</button>
        </div>
      )}

      {employee && screen === 'complete' && (
        <div className="complete-card">
          <p>安否確認報告終了です。</p>
          <p>送信内容</p>
          <p>{getLabel(employee.safetyStatus)}</p>
        </div>
      )}
    </div>
  )
}

export default MyPage
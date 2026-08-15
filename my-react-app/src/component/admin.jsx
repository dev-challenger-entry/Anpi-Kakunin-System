import { useState, useEffect } from 'react'
import './admin.css'

const STATUS_META = [
  { value: '無事です', className: 'status-safe' },
  { value: '避難しました', className: 'status-evacuated' },
  { value: '出勤困難', className: 'status-unable' },
  { value: '未回答', className: 'status-unanswered' },
]

function AdminStatusSummary() {
  const [summary, setSummary] = useState({})
  const [employeesByStatus, setEmployeesByStatus] = useState({})
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8080/api/admin/status-summary', { credentials: 'include' }).then(res => res.json()),
      fetch('http://localhost:8080/api/admin/employees', { credentials: 'include' }).then(res => res.json()),
    ])
      .then(([summaryData, employeesData]) => {
        setSummary(summaryData)

        // 管理者アカウントは集計対象から除外し、ステータスごとに社員名をまとめる
        const grouped = {}
        employeesData
          .filter(emp => emp.role !== 'ADMIN')
          .forEach(emp => {
            const status = emp.safetyStatus || 'UNANSWERED'
            if (!grouped[status]) grouped[status] = []
            grouped[status].push(emp.name)
          })
        setEmployeesByStatus(grouped)
      })
      .catch(err => {
        console.error(err)
        setErrorMsg('データの取得に失敗しました')
      })
  }, [])

  return (
    <div className="admin-card">
      <h2 className="admin-title">集計結果</h2>
      {errorMsg && <p className="admin-error">{errorMsg}</p>}

      <div className="admin-table">
        <div className="admin-table-header">
          <div className="admin-col-status">回答状況</div>
          <div className="admin-col-people">回答者</div>
        </div>

        {STATUS_META.map(({ value, label, className }) => (
          <div className="admin-table-row" key={value}>
            <div className={`admin-status-cell ${className}`}>{label}</div>
            <div className="admin-people-cell">
              回答者{summary[value] ?? 0}名
              {(employeesByStatus[value] || []).length > 0 && (
                <div className="admin-people-list">
                  {employeesByStatus[value].join('、')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default AdminStatusSummary;

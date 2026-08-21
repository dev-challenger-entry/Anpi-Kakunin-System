import { useState, useEffect } from 'react'
import './Admin.css'

// ステータスの値（DBの値）と、画面表示用のラベル・CSSクラス名をセットにした配列
// ここに書かれている順番がそのまま画面での表示順になる
const STATUS_META = [
  { value: '無事です', label: '無事です', className: 'status-safe' },
  { value: '避難しました', label: '避難しました', className: 'status-evacuated' },
  { value: '出勤困難', label: '出勤困難', className: 'status-unable' },
  { value: '未回答', label: '未回答', className: 'status-unanswered' },
]

// 社員情報登録・変更画面、管理者情報変更画面への遷移用に、
// 親コンポーネント（App.jsx）から遷移関数を props として受け取る
function AdminStatusSummary({
  onNavigateToEmployeeManage,
  onNavigateToAdminSettings,
  onLogout
}) {

  // ステータスごとの集計人数を保持する
  const [summary, setSummary] = useState({})

  // ステータスごとの社員一覧を保持する
  const [employeesByStatus, setEmployeesByStatus] = useState({})

  // エラーメッセージを保持する
  const [errorMsg, setErrorMsg] = useState('')

  // 画面表示時にAPIからデータを取得
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8080/api/admin/status-summary', {
        credentials: 'include'
      }),
      fetch('http://localhost:8080/api/admin/employees', {
        credentials: 'include'
      }),
    ])
      .then(async ([summaryRes, employeesRes]) => {

        // 401（未ログイン）をチェック
        if (summaryRes.status === 401 || employeesRes.status === 401) {
          alert('ログインしていません。ログイン画面に戻ります。')
          window.location.reload()
          return null
        }

        // JSONに変換
        const summaryData = await summaryRes.json()
        const employeesData = await employeesRes.json()

        return [summaryData, employeesData]
      })
      .then((result) => {

        // 401で処理済みの場合
        if (!result) return

        const [summaryData, employeesData] = result

        // 集計結果を保存
        setSummary(summaryData)

        // ステータスごとに社員を分類
        const grouped = {}

        STATUS_META.forEach(({ value }) => {
          grouped[value] = (summaryData[value]?.employees || [])
            .map(employee => ({
              name: employee.name,
              answeredTime: employee.answeredTime
            }))
        })

        // 分類した社員一覧を保存
        setEmployeesByStatus(grouped)
      })
      .catch(err => {
        console.error(err)
        setErrorMsg('データの取得に失敗しました')
      })
  }, [])

  // 回答日時を「YYYY/MM/DD HH:mm」の形式で表示する
  const formatAnsweredTime = (answeredTime) => {
    if (!answeredTime) return '未回答'

    const date = new Date(answeredTime)

    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  // 画面表示
  return (
    <div className="admin-card">

      {/* 見出し */}
      <h2 className="admin-title">集計結果</h2>

      {/* エラーメッセージ */}
      {errorMsg && <p className="admin-error">{errorMsg}</p>}

      <div className="admin-table">

        {/* テーブルのヘッダー行 */}
        <div className="admin-table-header">
          <div className="admin-col-status">回答状況</div>
          <div className="admin-col-people">回答者</div>
        </div>

        {/* ステータスごとの行 */}
        {STATUS_META.map(({ value, label, className }) => (
          <div className="admin-table-row" key={value}>

            {/* ステータス名 */}
            <div className={`admin-status-cell ${className}`}>
              {label}
            </div>

            {/* 回答者 */}
            <div className="admin-people-cell">

              回答者{summary[value]?.count ?? 0}名

              {/* 社員が1人以上いる場合だけ表示 */}
              {(employeesByStatus[value] || []).length > 0 && (
                <div className="admin-people-list">

                  {employeesByStatus[value].map((employee, index) => (
                    <div key={index}>
                      {employee.name}
                      <br />
                      （回答日時：{formatAnsweredTime(employee.answeredTime)}）
                    </div>
                  ))}

                </div>
              )}

            </div>
          </div>
        ))}

      </div>

      {/* 画面遷移用のボタン群 */}
      <div className="navigation-buttons">

        {/* 社員情報登録・変更画面へ遷移 */}
        <button
          type="button"
          className="navigation-button employee-manage-button mt-large"
          onClick={onNavigateToEmployeeManage}
        >
          社員情報の登録・変更はこちらへ
        </button>

        {/* 管理者情報変更画面へ遷移 */}
        <button
          type="button"
          className="navigation-button admin-settings-button mt-large"
          onClick={onNavigateToAdminSettings}
        >
          管理者情報変更はこちらへ
        </button>

        {/* ログアウト */}
        <button
          type="button"
          className="admin-logout-button"
          onClick={onLogout}
        >
          ここからログアウトする
        </button>

      </div>

    </div>
  )
}

export default AdminStatusSummary
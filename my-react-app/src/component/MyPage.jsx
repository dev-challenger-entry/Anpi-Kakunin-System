import { useState, useEffect } from 'react'
import './mypage.css'
import Logout from './LogOut'


// 安否状況の選択肢一覧
// value：DBやAPIとやり取りする値
// label：画面に表示する文字
const STATUS_OPTIONS = [
  { value: '未回答', label: '未回答' },
  { value: '無事です', label: '無事です' },
  { value: '避難しました', label: '避難しました' },
  { value: '出勤困難', label: '出勤困難' },
]


// safetyStatusの値から画面表示用のlabelを取得する
const getLabel = (value) => {
  return STATUS_OPTIONS.find(option => option.value === value)?.label ?? value
}


function MyPage({ employeeId, onLogout }) {

  // 社員情報
  const [employee, setEmployee] = useState(null)

  // エラーメッセージ
  const [errorMsg, setErrorMsg] = useState('')

  // 選択中の安否状況
  const [selectedStatus, setSelectedStatus] = useState('')

  // 画面状態
  // mypage：安否状況入力画面
  // complete：送信完了画面
  const [screen, setScreen] = useState('mypage')


  // 社員情報を取得
  useEffect(() => {

    fetch(
      `http://localhost:8080/api/mypage?employeeId=${employeeId}`,
      {
        credentials: 'include'
      }
    )
      .then(res => {

        // セッション切れ
        if (res.status === 401) {
          alert('ログインしていません。ログイン画面に戻ります。')
          window.location.reload()
          return null
        }

        return res.json()
      })
      .then(data => {

        if (!data) {
          return
        }

        if (data.error) {
          setErrorMsg(data.error)
          return
        }

        // 社員情報を保存
        setEmployee(data)

        // 現在の安否状況を初期値として設定
        setSelectedStatus(data.safetyStatus)
      })
      .catch(error => {
        console.error(error)
        setErrorMsg('社員情報の取得に失敗しました。')
      })

  }, [employeeId])


  // 安否状況の選択変更
  const handleSelectChange = (event) => {
    setSelectedStatus(event.target.value)
  }


  // 安否状況の送信
  const handleSubmit = async () => {

    try {

      const response = await fetch(
        `http://localhost:8080/api/status/${employee.employeeId}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: selectedStatus
          })
        }
      )


      // セッション切れ
      if (response.status === 401) {
        alert('セッションが切れました。ログイン画面に戻ります。')
        window.location.reload()
        return
      }


      // 更新失敗
      if (!response.ok) {
        throw new Error('更新に失敗しました')
      }


      // 更新後の安否状況
      const updatedStatus = await response.text()


      setEmployee(previousEmployee => ({
        ...previousEmployee,
        safetyStatus: updatedStatus
      }))


      // 送信完了画面へ
      setScreen('complete')

    } catch (error) {

      console.error(error)
      setErrorMsg('安否状況の更新に失敗しました。')
    }
  }


  return (
    <div className="mypage-container">

      {/* エラーメッセージ */}
      {errorMsg && (
        <p className="mypage-error">
          {errorMsg}
        </p>
      )}


      {/* ================================
          安否状況入力画面
          ================================ */}
      {employee && screen === 'mypage' && (

        <div className="mypage-card">

          {/* 社員情報 */}
          <div className="employee-info">

            <p className="employee-section">
              【{employee.sectionName}】
            </p>

            <p className="employee-name">
              社員名：{employee.name}
            </p>

          </div>


          {/* 安否状況 */}
          <div className="safety-status">

            <label
              htmlFor="safety-status-select"
              className="safety-status-label"
            >
              現在の状況
            </label>

            <select
              id="safety-status-select"
              className="safety-status-select"
              value={selectedStatus}
              onChange={handleSelectChange}
            >

              {STATUS_OPTIONS.map(option => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}

            </select>

          </div>


          {/* 送信ボタン */}
          <button
            type="button"
            className="submit-button"
            onClick={handleSubmit}
          >
            送信
          </button>


            {/* ログアウト */}
           <button
              type="button"
              className="mypage-logout-button"
              onClick={onLogout}>
             ここからログアウトする
           </button>
        
        </div>
      )}


      {/* ================================
          送信完了画面
          ================================ */}
      {employee && screen === 'complete' && (

        <div className="complete-card">

          <p className="complete-message">
            安否確認報告終了です。
          </p>

          <p className="complete-title">
            送信内容
          </p>

          <p className="complete-status">
            {getLabel(employee.safetyStatus)}
          </p>


            {/* ログアウト */}
           <button
              type="button"
              className="mypage-logout-button"
              onClick={onLogout}>
             ここからログアウトする
           </button>

        </div>
      )}

    </div>
  )
}


export default MyPage
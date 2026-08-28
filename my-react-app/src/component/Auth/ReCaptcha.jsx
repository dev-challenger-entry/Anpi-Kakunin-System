import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../config/api'

function Captcha({ onSuccess }) {
  const [answer, setAnswer] = useState('')
  const [captcha, setCaptcha] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // 画面表示時にバックエンドから認証コードを取得する
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/captcha/generate`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setCaptcha(data.captcha))
      .catch(err => {
        console.error(err)
        setErrorMsg('認証コードの取得に失敗しました')
      })
  }, [])

  const handleCheck = async () => {
    setErrorMsg('')
    try {
      const res = await fetch(`${API_BASE_URL}/api/captcha/verify`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer }),
      })
      const data = await res.json()

      if (data.success) {
        onSuccess()
      } else {
        alert('認証コードが違います')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('サーバーに接続できませんでした')
    }
  }

  return (
    <>
      <div>{captcha}</div>
      {errorMsg && <p>{errorMsg}</p>}

      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <button onClick={handleCheck}>
        認証
      </button>
    </>
  )
}

export default Captcha
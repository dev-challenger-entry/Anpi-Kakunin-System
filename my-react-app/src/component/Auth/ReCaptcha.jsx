import { useEffect, useRef, useState } from 'react'

// Viteの環境変数からサイトキーを読み込む（VITE_から始まる名前のみ有効）
const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY

function Captcha({ onSuccess }) {

  // チェックボックスを描画するための場所
  const captchaRef = useRef(null)

  // grecaptcha.render()が返すウィジェットID（reset用に保持しておく）
  const widgetIdRef = useRef(null)

  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  // 画面表示時にGoogleのreCAPTCHAスクリプトを読み込み、チェックボックスを描画する
  useEffect(() => {

    const renderCaptcha = () => {
      if (window.grecaptcha && captchaRef.current && widgetIdRef.current === null) {
        widgetIdRef.current = window.grecaptcha.render(captchaRef.current, {
          sitekey: SITE_KEY,
        })
      }
    }

    // 別画面から戻ってきた場合など、既にスクリプトが読み込み済みなら即描画
    if (window.grecaptcha && window.grecaptcha.render) {
      renderCaptcha()
      return
    }

    // スクリプトをまだ読み込んでいない場合、読み込む
    const script = document.createElement('script')

    // スクリプト読み込み完了後にチェックボックスを描画する
    window.onRecaptchaLoad = renderCaptcha
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit'
    script.async = true
    script.defer = true

    document.body.appendChild(script)

    // 画面を離れるときにスクリプトタグとグローバル関数を片付ける
    return () => {
      document.body.removeChild(script)
      delete window.onRecaptchaLoad
    }
  }, [])

  const handleCheck = async () => {
    setErrorMsg('')

    // ユーザーが取得したトークンをウィジェットから取り出す
    const token = window.grecaptcha?.getResponse(widgetIdRef.current)

    // チェックが入っていない状態では送信させない
    if (!token) {
      setErrorMsg('チェックボックスにチェックを入れてください')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('http://localhost:8080/api/captcha/verify', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      const data = await res.json()

      if (data.success) {
        onSuccess()
      } else {
        setErrorMsg('確認に失敗しました。もう一度お試しください。')
        // 失敗時はウィジェットをリセットして、再チェックできるようにする
        window.grecaptcha?.reset(widgetIdRef.current)
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('サーバーに接続できませんでした')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div ref={captchaRef}></div>

      {errorMsg && <p>{errorMsg}</p>}

      <button onClick={handleCheck} disabled={loading}>
        続行
      </button>
    </>
  )
}

export default Captcha

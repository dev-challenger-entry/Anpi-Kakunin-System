import { useState, useEffect } from 'react'
//今は中身がないが、今後作る予定だからインポート宣言は残す
import './App.css'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('http://localhost:8080/学習中')
      .then(res => res.text())
      .then(data => setMessage(data))
  }, [])

  return (
    // 現在は、ExerciseControllerでの文字だけ見れる構造
    <div>
      <p>{message}</p>
    </div>
  )
}

export default App
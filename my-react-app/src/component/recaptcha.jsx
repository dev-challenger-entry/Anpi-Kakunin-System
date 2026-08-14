import { useState } from 'react'

function Captcha({ onSuccess }) {
    const [answer, setAnswer] = useState('')
    const [captcha] = useState('A7K9')

    const handleCheck = () => {
        if (answer === captcha) {
            onSuccess()
        } else {
            alert('認証コードが違います')
        }
    }

    return (
        <>
            <div>{captcha}</div>

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
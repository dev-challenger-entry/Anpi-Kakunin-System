import { useState } from 'react';

function Logout() {
    const [message, setMessage] = useState('');

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                setMessage('ログアウトしました');
            } else {
                setMessage('ログアウトに失敗しました');
            }

        } catch (error) {
            console.error('ログアウトエラー:', error);
            setMessage('ログアウトに失敗しました');
        }
    };

    return (
        <div>
            <button onClick={handleLogout}>
                ログアウト
            </button>

            {message && (
                <p>{message}</p>
            )}
        </div>
    );
}

export default Logout;
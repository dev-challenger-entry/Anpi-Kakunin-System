
function Login({ onLoginSuccess }) {
  return (
    <div>
      <button onClick={() => onLoginSuccess('test-employee-id')}>
        ログイン（仮）
      </button>
    </div>
  )
}

export default Login
import { useState, useEffect } from 'react'
import './mypage.css'

// 安否状況の選択肢一覧
// value: DBやAPIとやり取りする実際の値（日本語文字列で統一）
// label: 画面に表示するテキスト（今はvalueと同じだが、将来表示だけ変えたい場合に備えて分けてある）
const STATUS_OPTIONS = [
  { value: '未回答', label: '未回答' },
  { value: '無事です', label: '無事です' },
  { value: '避難しました', label: '避難しました' },
  { value: '出勤困難', label: '出勤困難' },
];

// safetyStatusの値（value）から、対応するlabelを取り出すヘルパー関数
// 万が一STATUS_OPTIONSに存在しない値が来た場合は、そのままvalueを表示する（?? value）
const getLabel = (value) => STATUS_OPTIONS.find(opt => opt.value === value)?.label ?? value;

function MyPage({ employeeId }) {
  // マイページ取得APIから返ってきた社員情報（name, sectionName, safetyStatusなど）を保持する
  // 初期値はnull＝まだ何も取得できていない状態
  const [employee, setEmployee] = useState(null);

  // 画面上部に表示するエラーメッセージ
  const [errorMsg, setErrorMsg] = useState('');

  // プルダウンで選択中の安否状況（送信前の一時的な入力値）
  const [selectedStatus, setSelectedStatus] = useState('');

  // 画面の表示切り替え用のstate
  // 'mypage'：安否状況の入力・送信画面
  // 'complete'：送信完了画面
  const [screen, setScreen] = useState('mypage');


useEffect(() => {
    // 指定したURLに対してHTTPリクエストを送る。
    // ただし、'include' を指定することで、「同じサイトだろうが別のサイトだろうが、常にクッキーなどの認証情報を一緒に送る」ように
    fetch(`http://localhost:8080/api/mypage?employeeId=${employeeId}`, { credentials: 'include' })
      .then(res => {
        // 未ログイン・セッション切れの場合はここで止める
        if (res.status === 401) {
          alert('ログインしていません。ログイン画面に戻ります。');
          // App.jsxのstate（loggedInEmployeeIdなど）はリロードで消える仕様のため、
          // リロードすることで結果的にログイン画面に戻せる
          window.location.reload();
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (!data) return; // 401で既に処理済みなのでここで終了
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          setEmployee(data);
          setSelectedStatus(data.safetyStatus);
        }
      });
  }, [employeeId]);

  // プルダウンの選択が変わるたびに、選択中の値をstateへ反映する
  const handleSelectChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  // 「送信」ボタン押下時の処理
  // 安否状況更新API（PUT /api/status/{employeeId}）を呼び出す
const handleSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/status/${employee.employeeId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus }),
      });

      // 送信時にセッションが切れていた場合も同様に対処
      if (res.status === 401) {
        alert('セッションが切れました。ログイン画面に戻ります。');
        window.location.reload();
        return;
      }

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
      {/* データ取得・送信失敗時のエラーメッセージ表示 */}
      {errorMsg && <p>{errorMsg}</p>}

      {/* 安否状況の入力・送信画面（employee取得済み かつ screen === 'mypage' のときだけ表示） */}
      {employee && screen === 'mypage' && (
        <div className="mypage-card">
          <p>【{employee.sectionName}】</p>
          <p>社員名：{employee.name}</p>

          <label>現在の状況</label>
          {/* 安否状況をプルダウンで選択させる */}
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

      {/* 送信完了画面（送信成功後、screen === 'complete' になったら表示） */}
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
import { useState, useEffect } from 'react'
import './admin.css'

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
function AdminStatusSummary({ onNavigateToEmployeeManage, onNavigateToAdminSettings }) {

  // ステータスごとの集計人数（例：{ "無事です": 2, "未回答": 1, ... }）を保持する
  // 初期値は空のオブジェクト（＝まだ何も取得できていない状態）
  const [summary, setSummary] = useState({})

  // ステータスごとに、該当する社員名の一覧をまとめて保持する
  // 例：{ "無事です": ["山田 太郎", "佐藤 美咲"], "未回答": ["鈴木 一郎"] }
  const [employeesByStatus, setEmployeesByStatus] = useState({})

  // データ取得（集計API・社員一覧API）が失敗した場合に、
  // 画面へ表示するエラーメッセージを保持する
  // 初期値は空文字（＝エラーなし）
  const [errorMsg, setErrorMsg] = useState('')

  // 画面が表示された直後（初回レンダリング時）に1回だけ実行される処理
  // 第2引数が空配列[]なので、依存する値の変化では再実行されない
  useEffect(() => {
    // 集計API と 社員一覧API を「同時に」呼び出す
    // Promise.allを使うことで、2つのfetchが両方終わるまで待ってから次の処理に進める
    Promise.all([
      fetch('http://localhost:8080/api/admin/status-summary', { credentials: 'include' }),
      fetch('http://localhost:8080/api/admin/employees', { credentials: 'include' }),
    ])
      .then(async ([summaryRes, employeesRes]) => {
        // まず両方のレスポンス（json化前）の時点で401（未ログイン）をチェックする
        // json()に変換する前にチェックしないと、401のレスポンスをjson()しようとしてエラーになることがあるため
        if (summaryRes.status === 401 || employeesRes.status === 401) {
          alert('ログインしていません。ログイン画面に戻ります。');
          // App.jsxのstate（loggedInEmployeeIdなど）はリロードで消える仕様のため、
          // リロードすることで結果的にログイン画面に戻せる
          window.location.reload();
          return null; // ここで処理を打ち切る（このあとのthenにnullが渡る）
        }

        // 401じゃなければ、ここで初めてレスポンスの中身をJSON（JS上で扱えるデータ）に変換する
        const summaryData = await summaryRes.json();
        const employeesData = await employeesRes.json();
        // 2つのデータをまとめて次のthenに渡す
        return [summaryData, employeesData];
      })
      .then((result) => {
        // 直前のthenでnullが返ってきた場合（＝401で既に処理済み）は、ここで終了する
        if (!result) return;

        // 配列を分割代入で、それぞれの変数に入れ直す
        const [summaryData, employeesData] = result;
        // 集計人数をstateに保存 → 画面が再描画される
        setSummary(summaryData)

        // ステータスごとに社員名を仕分けするための、空のオブジェクトを用意
        const grouped = {}
        employeesData
          // 管理者(ADMIN)は安否確認の対象外なので、一覧から除外する
          .filter(emp => emp.role !== 'ADMIN')
          .forEach(emp => {
            // その社員の安否状況を取り出す。値がない（null/undefined）場合は'未回答'扱いにする
            const status = emp.safetyStatus || '未回答'
            // groupedの中にそのステータスのキーがまだなければ、空配列を用意する
            if (!grouped[status]) grouped[status] = []
            // そのステータスの配列に、社員名を追加する
            grouped[status].push(emp.name)
          })
        // 仕分けが終わったオブジェクトをstateに保存 → 画面が再描画される
        setEmployeesByStatus(grouped)
      })
      .catch(err => {
        // fetch自体が失敗した場合（サーバーに繋がらない等）の処理
        console.error(err)
        setErrorMsg('データの取得に失敗しました')
      })
  }, [])

  // ここから実際に画面に表示される内容（JSX）
  return (
    <div className="admin-card">
      {/* 見出し */}
      <h2 className="admin-title">集計結果</h2>

      {/* errorMsgに何か文字列が入っているときだけ、エラーメッセージを表示する */}
      {errorMsg && <p className="admin-error">{errorMsg}</p>}

      <div className="admin-table">
        {/* テーブルのヘッダー行（見出し行） */}
        <div className="admin-table-header">
          <div className="admin-col-status">回答状況</div>
          <div className="admin-col-people">回答者</div>
        </div>

        {/* STATUS_META配列の要素数だけ、行を繰り返し生成する（map） */}
        {STATUS_META.map(({ value, label, className }) => (
          // key属性はReactがリストの各要素を区別するために必須
          <div className="admin-table-row" key={value}>
            {/* ステータス名のセル。classNameでステータスごとの色分けをしている */}
            <div className={`admin-status-cell ${className}`}>{label}</div>
            <div className="admin-people-cell">
              {/* summary[value]が存在しない（undefined）場合は、??演算子で0を表示する */}
              回答者{summary[value] ?? 0}名
              {/* そのステータスに該当する社員が1人以上いる場合だけ、名前一覧を表示する */}
              {(employeesByStatus[value] || []).length > 0 && (
                <div className="admin-people-list">
                  {/* 配列を「、」区切りの1つの文字列に変換して表示する */}
                  {employeesByStatus[value].join('、')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 画面遷移用のボタン群 */}
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        {/* 押すと、親から渡された関数を実行し、社員情報登録・変更画面へ遷移する */}
        <button onClick={onNavigateToEmployeeManage}>社員情報の変更</button>
        {/* 押すと、親から渡された関数を実行し、管理者情報変更画面へ遷移する */}
        <button onClick={onNavigateToAdminSettings} style={{ marginLeft: '8px' }}>
          管理者情報変更
        </button>
      </div>
    </div>
  )
}

export default AdminStatusSummary;
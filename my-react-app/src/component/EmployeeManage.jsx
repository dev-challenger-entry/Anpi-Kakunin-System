import './EmployeeManage.css'

import { useState } from 'react'

import EmployeeSearchBar from './EmployeeSearchBar'
import EmployeeEditForm from './EmployeeEditForm'
import ChangeConfirmModal from './ChangeConfirmModal'
import NotFoundConfirmModal from './NotFoundConfirmModal'
import RegisterFormModal from './RegisterFormModal'

function EmployeeManage({ onBack, onLogout }) {

  // 検索用（入力中のID）
  const [searchId, setSearchId] = useState('')

  // 検索結果として画面に表示する項目
  const [employeeId, setEmployeeId] = useState('')
  const [name, setName] = useState('')
  const [sectionName, setSectionName] = useState('')

  // 検索直後の元データ（変更する項目の差分比較に使う）
  const [originalData, setOriginalData] = useState(null)

  // パスワード
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // 現在のパスワードが未入力の場合に、代わりに入力してもらう
  // ログイン中の管理者自身のパスワード（本人確認用）
  const [adminPassword, setAdminPassword] = useState('')

  // 検索結果が見つかったか
  const [employeeFound, setEmployeeFound] = useState(false)

  // 現存する社員ID一覧
  const [employeeIdList, setEmployeeIdList] = useState([])

  // エラーメッセージ
  const [errorMsg, setErrorMsg] = useState('')

  // ================================
  // 変更確認ポップアップ用
  // ================================

  // 確認ポップアップを表示するか
  const [showConfirm, setShowConfirm] = useState(false)

  // 実際に変更する項目（元データとの差分）
  const [changeItems, setChangeItems] = useState([])

  // ================================
  // 新規登録フロー用
  // ================================

  // 「存在しないアカウントIDです。新規登録に進みますか？」ポップアップを表示するか
  const [showNotFoundConfirm, setShowNotFoundConfirm] = useState(false)

  // 存在しなかったID（新規登録フォームへ引き継ぐ）
  const [notFoundId, setNotFoundId] = useState('')

  // 新規登録用の入力フォーム（ポップアップ）を表示するか
  const [showRegisterForm, setShowRegisterForm] = useState(false)

  // 新規登録用の入力項目
  const [regEmployeeId, setRegEmployeeId] = useState('')
  const [regName, setRegName] = useState('')
  const [regSectionName, setRegSectionName] = useState('')
  const [regNewPassword, setRegNewPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')

  // 現存するUSERの社員ID一覧を取得する
  const handleLoadEmployeeIdList = async () => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/admin/employees',
        {
          credentials: 'include'
        }
      )

      if (!res.ok) {
        setErrorMsg('社員ID一覧の取得に失敗しました')
        return
      }

      const data = await res.json()

      // USERだけを対象にする
      const userIds = data
        .filter(employee => employee.role === 'USER')
        .map(employee => employee.employeeId)
        .sort()

      setEmployeeIdList(userIds)

    } catch (err) {
      console.error(err)
      setErrorMsg('サーバーに接続できませんでした')
    }
  }

  // 社員ID検索：入力されたIDでバックエンドに問い合わせる
  const handleSearchById = async (idToSearch) => {
    setErrorMsg('')
    setEmployeeFound(false)

    if (!idToSearch) {
      setErrorMsg('ID入力欄が未記入です')
      setShowNotFoundConfirm(true)

      await handleLoadEmployeeIdList()
      return
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/employees/${idToSearch}`,
        { credentials: 'include' }
      )

      if (res.status === 404) {
        setEmployeeId('')
        setName('')
        setSectionName('')
        setOriginalData(null)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setAdminPassword('')

        setNotFoundId(idToSearch)
        setShowNotFoundConfirm(true)

        return
      }

      if (!res.ok) {
        setErrorMsg('データの取得に失敗しました')
        return
      }

      const data = await res.json()

      if (data.role !== 'USER') {
        setEmployeeId('')
        setName('')
        setSectionName('')
        setOriginalData(null)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setAdminPassword('')
        setEmployeeFound(false)

        setErrorMsg('管理者アカウントは管理対象外です')

        await handleLoadEmployeeIdList()

        return
      }
      setEmployeeId(data.employeeId)
      setName(data.name)
      setSectionName(data.sectionName)

      setOriginalData({
        employeeId: data.employeeId,
        name: data.name,
        sectionName: data.sectionName,
      })

      setEmployeeFound(true)

    } catch (err) {
      console.error(err)
      setErrorMsg('サーバーに接続できませんでした')
    }
  }

  const handleSearch = () => {
    handleSearchById(searchId)
  }

  const handleNotFoundNo = () => {
    setShowNotFoundConfirm(false)
    if (!notFoundId) {
      setErrorMsg('ID入力欄が未記入です')
    } else {
      setErrorMsg('存在しないアカウントIDです')
    }
  }

  const handleNotFoundYes = () => {
    setShowNotFoundConfirm(false)

    setRegEmployeeId(notFoundId)
    setRegName('')
    setRegSectionName('')
    setRegNewPassword('')
    setRegConfirmPassword('')
    setErrorMsg('')

    setShowRegisterForm(true)
  }

  const handleRegister = async () => {

    setErrorMsg('')

    if (!regEmployeeId || !regName || !regSectionName) {
      setErrorMsg('社員ID・社員名・部署名は必須です')
      return
    }

    if (!regNewPassword) {
      setErrorMsg('新しいパスワードを入力してください')
      return
    }

    if (regNewPassword !== regConfirmPassword) {
      setErrorMsg('新しいパスワードと確認用パスワードが一致していません')
      return
    }

    try {
      const res = await fetch('http://localhost:8080/api/admin/employees', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: regEmployeeId,
          name: regName,
          sectionName: regSectionName,
          newPassword: regNewPassword,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setShowRegisterForm(false)

        const registeredId = regEmployeeId

        setRegEmployeeId('')
        setRegName('')
        setRegSectionName('')
        setRegNewPassword('')
        setRegConfirmPassword('')

        setSearchId(registeredId)
        handleSearchById(registeredId)

      } else {
        setErrorMsg(data.message || '登録に失敗しました')
      }

    } catch (err) {
      console.error(err)
      setErrorMsg('サーバーに接続できませんでした')
    }
  }

  const handleSubmit = () => {

    setErrorMsg('')

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg('新しいパスワードと確認用パスワードが一致していません')
      return
    }

    const items = []

    if (originalData) {
      if (name !== originalData.name) {
        items.push('社員名')
      }
      if (sectionName !== originalData.sectionName) {
        items.push('部署名')
      }
    }

    if (newPassword) {
      items.push('パスワード')
    }

    setChangeItems(items)

    setShowConfirm(true)
  }

  const handleConfirmChange = async () => {

    if (!currentPassword && !adminPassword) {
      setErrorMsg('管理者アカウントのパスワードを入力してください')
      return
    }

    setShowConfirm(false)
    setErrorMsg('')

    try {
      const res = await fetch('http://localhost:8080/api/admin/employees', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId,
          name,
          sectionName,
          currentPassword,
          newPassword,
          adminPassword,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setOriginalData({ employeeId, name, sectionName })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setAdminPassword('')
      } else {
        setErrorMsg(data.message || '更新に失敗しました')
      }

    } catch (err) {
      console.error(err)
      setErrorMsg('サーバーに接続できませんでした')
    }
  }

  const handleDelete = async () => {

    const confirmed = window.confirm(
      `社員ID「${employeeId}」を削除します。よろしいですか？`
    )

    if (!confirmed) {
      return
    }

    setErrorMsg('')

    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/employees/${employeeId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      const data = await res.json()

      if (data.success) {
        setSearchId('')
        setEmployeeId('')
        setName('')
        setSectionName('')
        setOriginalData(null)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setAdminPassword('')
        setEmployeeFound(false)
      } else {
        setErrorMsg(data.message || '削除に失敗しました')
      }

    } catch (err) {
      console.error(err)
      setErrorMsg('サーバーに接続できませんでした')
    }
  }


  return (
    <div className="employee-manage-container">

      {/* 管理者画面の見出し */}
      <div className="employee-manage-header">
        <div>管理者画面</div>
      </div>

      {/* 画面タイトル */}
      <h2 className="employee-manage-title">
        社員情報登録・更新
      </h2>

      <div className="employee-manage-form">

        <EmployeeSearchBar
          searchId={searchId}
          setSearchId={setSearchId}
          onSearch={handleSearch}
          errorMsg={errorMsg}
          showNotFoundConfirm={showNotFoundConfirm}
          showRegisterForm={showRegisterForm}
          employeeIdList={employeeIdList}
        />

        {employeeFound && (
          <EmployeeEditForm
            name={name}
            setName={setName}
            sectionName={sectionName}
            setSectionName={setSectionName}
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
          />
        )}

        <button
          type="button"
          className="employee-manage-cancel-button"
          onClick={onBack}
        >
          キャンセル
        </button>

        <button
          type="button"
          className="employee-manage-logout-button"
          onClick={onLogout}
        >
          ここからログアウトする
        </button>

        {showConfirm && (
          <ChangeConfirmModal
            changeItems={changeItems}
            currentPassword={currentPassword}
            adminPassword={adminPassword}
            setAdminPassword={setAdminPassword}
            onCancel={() => setShowConfirm(false)}
            onConfirm={handleConfirmChange}
          />
        )}

        {showNotFoundConfirm && (
          <NotFoundConfirmModal
            onNo={handleNotFoundNo}
            onYes={handleNotFoundYes}
          />
        )}

        {showRegisterForm && (
          <RegisterFormModal
            regEmployeeId={regEmployeeId}
            setRegEmployeeId={setRegEmployeeId}
            regName={regName}
            setRegName={setRegName}
            regSectionName={regSectionName}
            setRegSectionName={setRegSectionName}
            regNewPassword={regNewPassword}
            setRegNewPassword={setRegNewPassword}
            regConfirmPassword={regConfirmPassword}
            setRegConfirmPassword={setRegConfirmPassword}
            errorMsg={errorMsg}
            onRegister={handleRegister}
            onCancel={() => {
              setShowRegisterForm(false)
              setErrorMsg('')
            }}
          />
        )}

      </div>

    </div>
  )
}

export default EmployeeManage
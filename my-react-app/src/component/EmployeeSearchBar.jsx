function EmployeeSearchBar({
  searchId,
  setSearchId,
  onSearch,
  errorMsg,
  showNotFoundConfirm,
  showRegisterForm,
  employeeIdList
}) {
  return (
    <>
      <label className="employee-manage-label">
        社員ID
      </label>

      <input
        type="text"
        className="employee-manage-input"
        placeholder="設定したいIDを入力"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        onBlur={onSearch}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSearch()
        }}
      />

      {errorMsg && !showNotFoundConfirm && !showRegisterForm && (
        <>
          <p className="employee-manage-error">
            {errorMsg}
          </p>

          {employeeIdList.length > 0 && (
            <>
              <p className="employee-id-list-title">
                （登録済のアカウントIDです）
              </p>
              <p className="employee-id-list">
                {employeeIdList.join(', ')}
              </p>
            </>
          )}
        </>
      )}
    </>
  )
}

export default EmployeeSearchBar
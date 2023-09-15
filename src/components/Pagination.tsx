
export function Pagination() {
  function handlePagination(event: React.SyntheticEvent) {
    let value = Number(event.currentTarget.textContent) || 0
    const pagination = Number(value - 1) * 9
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={handlePagination}>1</button>
      <button onClick={handlePagination}>2</button>
      <button onClick={handlePagination}>3</button>
    </div>
  )
}

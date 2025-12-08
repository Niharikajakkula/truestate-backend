import '../styles/SortDropdown.css'

function SortDropdown({ sortBy, sortOrder, onChange }) {
  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split('-')
    onChange(field, order)
  }

  const currentValue = `${sortBy}-${sortOrder}`

  return (
    <div className="sort-dropdown">
      <label htmlFor="sort-select">Sort by:</label>
      <select 
        id="sort-select"
        value={currentValue} 
        onChange={handleSortChange}
        className="sort-select"
      >
        <option value="date-desc">Date (Newest First)</option>
        <option value="date-asc">Date (Oldest First)</option>
        <option value="quantity-desc">Quantity (High to Low)</option>
        <option value="quantity-asc">Quantity (Low to High)</option>
        <option value="customerName-asc">Customer Name (A-Z)</option>
        <option value="customerName-desc">Customer Name (Z-A)</option>
      </select>
    </div>
  )
}

export default SortDropdown

import { useState } from 'react'
import '../styles/SearchBar.css'

function SearchBar({ value, onChange }) {
  const [inputValue, setInputValue] = useState(value)

  const handleSubmit = (e) => {
    e.preventDefault()
    onChange(inputValue)
  }

  const handleClear = () => {
    setInputValue('')
    onChange('')
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search by customer name or phone..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="search-input"
      />
      {inputValue && (
        <button type="button" onClick={handleClear} className="clear-btn">
          ✕
        </button>
      )}
      <button type="submit" className="search-btn">
        Search
      </button>
    </form>
  )
}

export default SearchBar

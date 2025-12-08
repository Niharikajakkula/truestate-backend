import { useState } from 'react'
import '../styles/FilterPanel.css'

function FilterPanel({ options, filters, onChange }) {
  const [localFilters, setLocalFilters] = useState(filters)
  const [expandedSections, setExpandedSections] = useState({
    region: true,
    gender: true,
    age: true,
    category: true,
    tags: false, // Collapsed by default
    payment: true,
    date: true
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // Get unique individual tags from comma-separated tag strings
  const getUniqueTags = (tagsList) => {
    if (!tagsList) return []
    const allTags = new Set()
    tagsList.forEach(tagString => {
      tagString.split(',').forEach(tag => allTags.add(tag.trim()))
    })
    return Array.from(allTags).sort().slice(0, 20) // Limit to top 20 tags
  }

  const handleMultiSelect = (key, value) => {
    const current = localFilters[key] || []
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    
    const newFilters = { ...localFilters, [key]: updated }
    setLocalFilters(newFilters)
    onChange(newFilters)
  }

  const handleSingleSelect = (key, value) => {
    // For single-select filters like gender - toggle on/off
    const current = localFilters[key] || []
    const updated = current.includes(value) ? [] : [value]
    const newFilters = { ...localFilters, [key]: updated }
    setLocalFilters(newFilters)
    onChange(newFilters)
  }

  const handleRangeChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onChange(newFilters)
  }

  const handleClearAll = () => {
    setLocalFilters({})
    onChange({})
  }

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        <button onClick={handleClearAll} className="clear-all-btn">
          Clear All
        </button>
      </div>

      <div className="filter-section">
        <h4 onClick={() => toggleSection('region')} className="collapsible-header">
          {expandedSections.region ? '▼' : '▶'} Customer Region
        </h4>
        {expandedSections.region && options.customerRegions?.map(region => (
          <label key={region} className="filter-checkbox">
            <input
              type="checkbox"
              checked={localFilters.customerRegion?.includes(region) || false}
              onChange={() => handleMultiSelect('customerRegion', region)}
            />
            <span>{region}</span>
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h4 onClick={() => toggleSection('gender')} className="collapsible-header">
          {expandedSections.gender ? '▼' : '▶'} Gender
        </h4>
        {expandedSections.gender && options.genders?.map(gender => (
          <label key={gender} className="filter-checkbox">
            <input
              type="radio"
              name="gender"
              checked={localFilters.gender?.includes(gender) || false}
              onChange={() => handleSingleSelect('gender', gender)}
            />
            <span>{gender}</span>
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h4 onClick={() => toggleSection('age')} className="collapsible-header">
          {expandedSections.age ? '▼' : '▶'} Age Range
        </h4>
        {expandedSections.age && (
          <>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={localFilters.ageRange === 'below18'}
                onChange={() => handleRangeChange('ageRange', localFilters.ageRange === 'below18' ? '' : 'below18')}
              />
              <span>Below 18</span>
            </label>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={localFilters.ageRange === '18-25'}
                onChange={() => handleRangeChange('ageRange', localFilters.ageRange === '18-25' ? '' : '18-25')}
              />
              <span>18-25</span>
            </label>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={localFilters.ageRange === '26-35'}
                onChange={() => handleRangeChange('ageRange', localFilters.ageRange === '26-35' ? '' : '26-35')}
              />
              <span>26-35</span>
            </label>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={localFilters.ageRange === '36-45'}
                onChange={() => handleRangeChange('ageRange', localFilters.ageRange === '36-45' ? '' : '36-45')}
              />
              <span>36-45</span>
            </label>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={localFilters.ageRange === '46-60'}
                onChange={() => handleRangeChange('ageRange', localFilters.ageRange === '46-60' ? '' : '46-60')}
              />
              <span>46-60</span>
            </label>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={localFilters.ageRange === '60+'}
                onChange={() => handleRangeChange('ageRange', localFilters.ageRange === '60+' ? '' : '60+')}
              />
              <span>60+</span>
            </label>
          </>
        )}
      </div>

      <div className="filter-section">
        <h4 onClick={() => toggleSection('category')} className="collapsible-header">
          {expandedSections.category ? '▼' : '▶'} Product Category
        </h4>
        {expandedSections.category && options.productCategories?.map(category => (
          <label key={category} className="filter-checkbox">
            <input
              type="checkbox"
              checked={localFilters.productCategory?.includes(category) || false}
              onChange={() => handleMultiSelect('productCategory', category)}
            />
            <span>{category}</span>
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h4 onClick={() => toggleSection('payment')} className="collapsible-header">
          {expandedSections.payment ? '▼' : '▶'} Payment Method
        </h4>
        {expandedSections.payment && options.paymentMethods?.map(method => (
          <label key={method} className="filter-checkbox">
            <input
              type="checkbox"
              checked={localFilters.paymentMethod?.includes(method) || false}
              onChange={() => handleMultiSelect('paymentMethod', method)}
            />
            <span>{method}</span>
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h4 onClick={() => toggleSection('date')} className="collapsible-header">
          {expandedSections.date ? '▼' : '▶'} Date Range
        </h4>
        {expandedSections.date && (
          <>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={localFilters.dateRange === '2020'}
                onChange={() => handleRangeChange('dateRange', localFilters.dateRange === '2020' ? '' : '2020')}
              />
              <span>2020</span>
            </label>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={localFilters.dateRange === '2021'}
                onChange={() => handleRangeChange('dateRange', localFilters.dateRange === '2021' ? '' : '2021')}
              />
              <span>2021</span>
            </label>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={localFilters.dateRange === '2022'}
                onChange={() => handleRangeChange('dateRange', localFilters.dateRange === '2022' ? '' : '2022')}
              />
              <span>2022</span>
            </label>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={localFilters.dateRange === '2023'}
                onChange={() => handleRangeChange('dateRange', localFilters.dateRange === '2023' ? '' : '2023')}
              />
              <span>2023</span>
            </label>
          </>
        )}
      </div>
    </div>
  )
}

export default FilterPanel

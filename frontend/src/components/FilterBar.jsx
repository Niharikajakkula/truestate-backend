import { useState, useRef, useEffect } from 'react'
import '../styles/FilterBar.css'

function FilterBar({ options, filters, onChange }) {
  const [expandedFilter, setExpandedFilter] = useState(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const buttonRefs = useRef({})



  const toggleFilter = (filterName) => {
    if (expandedFilter === filterName) {
      setExpandedFilter(null)
    } else {
      setExpandedFilter(filterName)
      
      // Calculate position for fixed dropdown
      const buttonElement = buttonRefs.current[filterName]
      if (buttonElement) {
        const rect = buttonElement.getBoundingClientRect()
        setDropdownPosition({
          top: rect.bottom + 8,
          left: rect.left
        })
      }
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (expandedFilter && !event.target.closest('.filter-dropdown')) {
        setExpandedFilter(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [expandedFilter])

  // Recalculate position on scroll/resize
  useEffect(() => {
    if (!expandedFilter) return

    const updatePosition = () => {
      const buttonElement = buttonRefs.current[expandedFilter]
      if (buttonElement) {
        const rect = buttonElement.getBoundingClientRect()
        setDropdownPosition({
          top: rect.bottom + 8,
          left: rect.left
        })
      }
    }

    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [expandedFilter])

  const handleMultiSelect = (key, value) => {
    const current = filters[key] || []
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    
    onChange({ ...filters, [key]: updated })
  }



  const getActiveFilterCount = () => {
    return Object.values(filters).filter(v => v && (Array.isArray(v) ? v.length > 0 : true)).length
  }

  const getFilterLabel = (key) => {
    const labels = {
      customerRegion: filters.customerRegion?.length > 0 
        ? filters.customerRegion.length === 1 
          ? filters.customerRegion[0].length > 12 
            ? filters.customerRegion[0].substring(0, 12) + '...' 
            : filters.customerRegion[0]
          : `${filters.customerRegion.length} selected`
        : 'Customer Region',
      gender: filters.gender?.length > 0
        ? filters.gender.length === 1
          ? filters.gender[0]
          : `${filters.gender.length} selected`
        : 'Gender',
      ageRange: filters.ageRange?.length > 0
        ? filters.ageRange.length === 1
          ? filters.ageRange[0] === 'below18' ? 'Below 18'
            : filters.ageRange[0] === '60+' ? '60+'
            : filters.ageRange[0]
          : `${filters.ageRange.length} selected`
        : 'Age Range',
      productCategory: filters.productCategory?.length > 0
        ? filters.productCategory.length === 1
          ? filters.productCategory[0].length > 12
            ? filters.productCategory[0].substring(0, 12) + '...'
            : filters.productCategory[0]
          : `${filters.productCategory.length} selected`
        : 'Product Category',
      paymentMethod: filters.paymentMethod?.length > 0
        ? filters.paymentMethod.length === 1
          ? filters.paymentMethod[0].length > 12
            ? filters.paymentMethod[0].substring(0, 12) + '...'
            : filters.paymentMethod[0]
          : `${filters.paymentMethod.length} selected`
        : 'Payment Method',
      dateRange: filters.dateRange?.length > 0
        ? filters.dateRange.length === 1
          ? filters.dateRange[0]
          : `${filters.dateRange.length} selected`
        : 'Date Range',
      storeLocation: filters.storeLocation?.length > 0
        ? filters.storeLocation.length === 1
          ? filters.storeLocation[0].length > 12
            ? filters.storeLocation[0].substring(0, 12) + '...'
            : filters.storeLocation[0]
          : `${filters.storeLocation.length} selected`
        : 'Location'
    }
    return labels[key]
  }

  return (
    <div className="filter-bar">
      {/* Customer Region */}
      <div className="filter-dropdown">
        <button 
          ref={el => buttonRefs.current['region'] = el}
          className={`filter-button ${filters.customerRegion?.length > 0 ? 'active' : ''}`}
          onClick={() => toggleFilter('region')}
          title="Customer Region"
        >
          <span className="filter-label">{getFilterLabel('customerRegion')}</span>
          <span className="arrow">▼</span>
        </button>
        {expandedFilter === 'region' && (
          <div 
            className="filter-dropdown-menu"
            style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
          >
            {options.customerRegions?.map(region => (
              <label key={region} htmlFor={`region-${region}`} className="filter-option">
                <input
                  id={`region-${region}`}
                  name="customerRegion"
                  type="checkbox"
                  checked={filters.customerRegion?.includes(region) || false}
                  onChange={() => handleMultiSelect('customerRegion', region)}
                />
                <span>{region}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Gender - Multi Select */}
      <div className="filter-dropdown">
        <button 
          ref={el => buttonRefs.current['gender'] = el}
          className={`filter-button ${filters.gender?.length > 0 ? 'active' : ''}`}
          onClick={() => toggleFilter('gender')}
          title="Gender"
        >
          <span className="filter-label">{getFilterLabel('gender')}</span>
          <span className="arrow">▼</span>
        </button>
        {expandedFilter === 'gender' && (
          <div 
            className="filter-dropdown-menu"
            style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
          >
            {options.genders?.map(gender => (
              <label key={gender} htmlFor={`gender-${gender}`} className="filter-option">
                <input
                  id={`gender-${gender}`}
                  type="checkbox"
                  name="gender"
                  checked={filters.gender?.includes(gender) || false}
                  onChange={() => handleMultiSelect('gender', gender)}
                />
                <span>{gender}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Age Range - Multi Select */}
      <div className="filter-dropdown">
        <button 
          ref={el => buttonRefs.current['age'] = el}
          className={`filter-button ${filters.ageRange?.length > 0 ? 'active' : ''}`}
          onClick={() => toggleFilter('age')}
          title="Age Range"
        >
          <span className="filter-label">{getFilterLabel('ageRange')}</span>
          <span className="arrow">▼</span>
        </button>
        {expandedFilter === 'age' && (
          <div 
            className="filter-dropdown-menu"
            style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
          >
            {['below18', '18-25', '26-35', '36-45', '46-60', '60+'].map(range => (
              <label key={range} htmlFor={`age-${range}`} className="filter-option">
                <input
                  id={`age-${range}`}
                  type="checkbox"
                  name="ageRange"
                  checked={filters.ageRange?.includes(range) || false}
                  onChange={() => handleMultiSelect('ageRange', range)}
                />
                <span>{range === 'below18' ? 'Below 18' : range === '60+' ? '60+' : range}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Product Category */}
      <div className="filter-dropdown">
        <button 
          ref={el => buttonRefs.current['category'] = el}
          className={`filter-button ${filters.productCategory?.length > 0 ? 'active' : ''}`}
          onClick={() => toggleFilter('category')}
          title="Product Category"
        >
          <span className="filter-label">{getFilterLabel('productCategory')}</span>
          <span className="arrow">▼</span>
        </button>
        {expandedFilter === 'category' && (
          <div 
            className="filter-dropdown-menu"
            style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
          >
            {options.productCategories?.map(category => (
              <label key={category} htmlFor={`category-${category}`} className="filter-option">
                <input
                  id={`category-${category}`}
                  name="productCategory"
                  type="checkbox"
                  checked={filters.productCategory?.includes(category) || false}
                  onChange={() => handleMultiSelect('productCategory', category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="filter-dropdown">
        <button 
          ref={el => buttonRefs.current['payment'] = el}
          className={`filter-button ${filters.paymentMethod?.length > 0 ? 'active' : ''}`}
          onClick={() => toggleFilter('payment')}
          title="Payment Method"
        >
          <span className="filter-label">{getFilterLabel('paymentMethod')}</span>
          <span className="arrow">▼</span>
        </button>
        {expandedFilter === 'payment' && (
          <div 
            className="filter-dropdown-menu"
            style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
          >
            {options.paymentMethods?.map(method => (
              <label key={method} htmlFor={`payment-${method}`} className="filter-option">
                <input
                  id={`payment-${method}`}
                  name="paymentMethod"
                  type="checkbox"
                  checked={filters.paymentMethod?.includes(method) || false}
                  onChange={() => handleMultiSelect('paymentMethod', method)}
                />
                <span>{method}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Date Range - Multi Select */}
      <div className="filter-dropdown">
        <button 
          ref={el => buttonRefs.current['date'] = el}
          className={`filter-button ${filters.dateRange?.length > 0 ? 'active' : ''}`}
          onClick={() => toggleFilter('date')}
          title="Date Range"
        >
          <span className="filter-label">{getFilterLabel('dateRange')}</span>
          <span className="arrow">▼</span>
        </button>
        {expandedFilter === 'date' && (
          <div 
            className="filter-dropdown-menu"
            style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
          >
            {['2020', '2021', '2022', '2023'].map(year => (
              <label key={year} htmlFor={`date-${year}`} className="filter-option">
                <input
                  id={`date-${year}`}
                  type="checkbox"
                  name="dateRange"
                  checked={filters.dateRange?.includes(year) || false}
                  onChange={() => handleMultiSelect('dateRange', year)}
                />
                <span>{year}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Location */}
      <div className="filter-dropdown">
        <button 
          ref={el => buttonRefs.current['location'] = el}
          className={`filter-button ${filters.storeLocation?.length > 0 ? 'active' : ''}`}
          onClick={() => toggleFilter('location')}
          title="Store Location"
        >
          <span className="filter-label">{getFilterLabel('storeLocation')}</span>
          <span className="arrow">▼</span>
        </button>
        {expandedFilter === 'location' && (
          <div 
            className="filter-dropdown-menu"
            style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
          >
            {options.storeLocations?.map(location => (
              <label key={location} htmlFor={`location-${location}`} className="filter-option">
                <input
                  id={`location-${location}`}
                  name="storeLocation"
                  type="checkbox"
                  checked={filters.storeLocation?.includes(location) || false}
                  onChange={() => handleMultiSelect('storeLocation', location)}
                />
                <span>{location}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters */}
      {getActiveFilterCount() > 0 && (
        <button 
          className="clear-filters-button"
          onClick={() => onChange({})}
          title="Clear all filters"
        >
          ✕ Clear
        </button>
      )}
    </div>
  )
}

export default FilterBar

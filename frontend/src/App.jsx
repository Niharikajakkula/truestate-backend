import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import SummaryCards from './components/SummaryCards'
import SearchBar from './components/SearchBar'
import FilterBar from './components/FilterBar'
import SalesTable from './components/SalesTable'
import Pagination from './components/Pagination'
import SortDropdown from './components/SortDropdown'
import { fetchSales, fetchFilterOptions } from './services/api'
import './styles/App.css'

function App() {
  const [sales, setSales] = useState([])
  const [allSales, setAllSales] = useState([])
  const [pagination, setPagination] = useState({})
  const [filterOptions, setFilterOptions] = useState({})
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  
  // Query state
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filters, setFilters] = useState({})
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)

  // Debounce search input - faster response
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setCurrentPage(1)
    }, 150)
    return () => clearTimeout(timer)
  }, [search])

  // Load all sales for summary cards - updates when section changes
  useEffect(() => {
    let cancelled = false
    const loadAllSales = async () => {
      try {
        // Apply same filters as main data for summary cards
        const params = { pageSize: 10000 }
        
        // Map Services sub-tabs to Order Status values
        const statusMapping = {
          'services-preactive': 'Pending',
          'services-active': 'Completed',
          'services-blocked': 'Cancelled',
          'services-closed': 'Returned'
        }
        
        // Apply status filter for Services tabs
        if (statusMapping[activeSection]) {
          params.orderStatus = statusMapping[activeSection]
        }
        
        const result = await fetchSales(params)
        if (!cancelled) setAllSales(result.data)
      } catch (error) {
        if (!cancelled) console.error('Failed to load summary data:', error)
      }
    }
    loadAllSales()
    return () => { cancelled = true }
  }, [activeSection])

  // Load filter options on mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        console.log('Starting to load filter options...')
        const options = await fetchFilterOptions()
        console.log('Filter options loaded successfully:', options)
        setFilterOptions(options)
      } catch (error) {
        console.error('Failed to load filter options:', error)
        console.error('Error details:', error.response?.data || error.message)
      }
    }
    loadFilterOptions()
  }, [])

  // Load sales data whenever query params change
  useEffect(() => {
    let cancelled = false
    const loadSales = async () => {
      setLoading(true)
      try {
        const params = {
          search: debouncedSearch,
          ...filters,
          sortBy,
          sortOrder,
          page: currentPage,
          pageSize: 10,
        }
        const result = await fetchSales(params)
        if (!cancelled) {
          setSales(result.data)
          setPagination(result.pagination)
        }
      } catch (error) {
        if (!cancelled) console.error('Failed to load sales:', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadSales()
    return () => { cancelled = true }
  }, [debouncedSearch, filters, sortBy, sortOrder, currentPage])

  const handleSearch = (value) => {
    setSearch(value)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleSortChange = (field, order) => {
    setSortBy(field)
    setSortOrder(order)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleSectionChange = (section) => {
    setActiveSection(section)
    setCurrentPage(1)
    setSearch('')
    
    // Map Services sub-tabs to Order Status values
    const statusMapping = {
      'services-preactive': 'Pending',      // Pre-Active → Pending status
      'services-active': 'Completed',       // Active → Completed status
      'services-blocked': 'Cancelled',      // Blocked → Cancelled status
      'services-closed': 'Returned'         // Closed → Returned status
    }
    
    // Apply status filter for Services sub-tabs
    if (statusMapping[section]) {
      // Filter by Order Status for Services tabs
      setFilters({ orderStatus: [statusMapping[section]] })
    } else {
      // Clear filters for other sections
      setFilters({})
    }
  }



  const getSectionTitle = () => {
    const titles = {
      'dashboard': 'Sales Management Service',
      'nexus': 'Nexus',
      'intake': 'Intake',
      'services-preactive': 'Services - Pre-Active',
      'services-active': 'Services - Active',
      'services-blocked': 'Services - Blocked',
      'services-closed': 'Services - Closed',
      'invoices-proforma': 'Proforma Invoices',
      'invoices-final': 'Final Invoices',
    }
    return titles[activeSection] || 'Sales Management Service'
  }

  const getSectionSubtitle = () => {
    const subtitles = {
      'dashboard': 'Sales Management Service',
      'nexus': 'Sales Management Service',
      'intake': 'Sales Management Service',
      'services-preactive': 'Sales Management Service',
      'services-active': 'Sales Management Service',
      'services-blocked': 'Sales Management Service',
      'services-closed': 'Sales Management Service',
      'invoices-proforma': 'Sales Management Service',
      'invoices-final': 'Sales Management Service',
    }
    return subtitles[activeSection] || 'Sales Management Service'
  }

  return (
    <div className="app">
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      
      <div className="app-main">
        <header className="app-header">
          <div className="header-content">
            <div>
              <h1>{getSectionTitle()}</h1>
              <p className="header-subtitle">{getSectionSubtitle()}</p>
            </div>
          </div>
        </header>

        <div className="app-content">
          {/* 1. Search Bar (Full Width, Primary Focus) */}
          <div className="search-section">
            <SearchBar value={search} onChange={handleSearch} />
          </div>

          {/* 2. Filter Panel (Dropdown Filters) */}
          <div className="filters-section">
            <FilterBar 
              options={filterOptions}
              filters={filters}
              onChange={handleFilterChange}
            />
          </div>

          {/* 3. Summary Cards (Key Metrics) */}
          <SummaryCards data={allSales} />

          {/* 4. Transaction Table with Sort */}
          <div className="transactions-section">
            <div className="table-header">
              <div className="table-title-group">
                <h2>Sales Transactions</h2>
                {activeSection !== 'dashboard' && (
                  <span className="filter-badge">
                    Viewing: {getSectionTitle()}
                  </span>
                )}
              </div>
              <SortDropdown 
                sortBy={sortBy}
                sortOrder={sortOrder}
                onChange={handleSortChange}
              />
            </div>

            <div style={{ position: 'relative', minHeight: '400px' }}>
              {loading && (
                <div className="loading-overlay">
                  <div className="spinner"></div>
                </div>
              )}
              <SalesTable data={sales} />
              
              {/* 5. Pagination Controls (Bottom) */}
              <Pagination 
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

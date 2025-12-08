import { useState } from 'react'
import '../styles/Sidebar.css'

function Sidebar({ activeSection, onSectionChange }) {
  const [expandedMenus, setExpandedMenus] = useState({
    services: false,
    invoices: false
  })

  const toggleMenu = (menu) => {
    const newExpanded = !expandedMenus[menu]
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: newExpanded
    }))
    
    // Auto-select Pre-Active when Services is opened
    if (menu === 'services' && newExpanded) {
      onSectionChange('services-preactive')
    }
  }

  const handleSectionClick = (section) => {
    onSectionChange(section)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">💼</span>
          <span className="logo-text">SalesDash</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {/* Sales Management Service */}
        <a 
          href="#" 
          className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            handleSectionClick('dashboard')
          }}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-text">Sales Management Service</span>
        </a>

        {/* Nexus */}
        <a 
          href="#" 
          className={`nav-item ${activeSection === 'nexus' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            handleSectionClick('nexus')
          }}
        >
          <span className="nav-icon">🔗</span>
          <span className="nav-text">Nexus</span>
        </a>

        {/* Intake */}
        <a 
          href="#" 
          className={`nav-item ${activeSection === 'intake' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            handleSectionClick('intake')
          }}
        >
          <span className="nav-icon">📥</span>
          <span className="nav-text">Intake</span>
        </a>

        {/* Services with sub-menu */}
        <div className="nav-group">
          <a 
            href="#" 
            className="nav-item" 
            onClick={(e) => {
              e.preventDefault()
              toggleMenu('services')
            }}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Services</span>
            <span className={`nav-arrow ${expandedMenus.services ? 'expanded' : ''}`}>
              ▼
            </span>
          </a>
          {expandedMenus.services && (
            <div className="sub-menu">
              <a 
                href="#" 
                className={`sub-item ${activeSection === 'services-preactive' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleSectionClick('services-preactive')
                }}
              >
                <span className="sub-dot"></span>
                <span>Pre-Active</span>
              </a>
              <a 
                href="#" 
                className={`sub-item ${activeSection === 'services-active' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleSectionClick('services-active')
                }}
              >
                <span className="sub-dot"></span>
                <span>Active</span>
              </a>
              <a 
                href="#" 
                className={`sub-item ${activeSection === 'services-blocked' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleSectionClick('services-blocked')
                }}
              >
                <span className="sub-dot"></span>
                <span>Blocked</span>
              </a>
              <a 
                href="#" 
                className={`sub-item ${activeSection === 'services-closed' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleSectionClick('services-closed')
                }}
              >
                <span className="sub-dot"></span>
                <span>Closed</span>
              </a>
            </div>
          )}
        </div>

        {/* Invoices with sub-menu */}
        <div className="nav-group">
          <a 
            href="#" 
            className="nav-item" 
            onClick={(e) => {
              e.preventDefault()
              toggleMenu('invoices')
            }}
          >
            <span className="nav-icon">📄</span>
            <span className="nav-text">Invoices</span>
            <span className={`nav-arrow ${expandedMenus.invoices ? 'expanded' : ''}`}>
              ▼
            </span>
          </a>
          {expandedMenus.invoices && (
            <div className="sub-menu">
              <a 
                href="#" 
                className={`sub-item ${activeSection === 'invoices-proforma' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleSectionClick('invoices-proforma')
                }}
              >
                <span className="sub-dot"></span>
                <span>Proforma Invoices</span>
              </a>
              <a 
                href="#" 
                className={`sub-item ${activeSection === 'invoices-final' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleSectionClick('invoices-final')
                }}
              >
                <span className="sub-dot"></span>
                <span>Final Invoices</span>
              </a>
            </div>
          )}
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar

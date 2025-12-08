import '../styles/Pagination.css'

function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) {
    return null
  }

  const { currentPage, totalPages, totalItems, hasPrev, hasNext } = pagination

  const handlePrev = () => {
    if (hasPrev) onPageChange(currentPage - 1)
  }

  const handleNext = () => {
    if (hasNext) onPageChange(currentPage + 1)
  }

  const handlePageClick = (page) => {
    onPageChange(page)
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing page {currentPage} of {totalPages} ({totalItems} total items)
      </div>
      
      <div className="pagination-controls">
        <button 
          onClick={handlePrev} 
          disabled={!hasPrev}
          className="pagination-btn"
        >
          Previous
        </button>
        
        <div className="page-numbers">
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="ellipsis">...</span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`page-btn ${page === currentPage ? 'active' : ''}`}
              >
                {page}
              </button>
            )
          ))}
        </div>
        
        <button 
          onClick={handleNext} 
          disabled={!hasNext}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Pagination

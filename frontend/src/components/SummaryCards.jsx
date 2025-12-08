import { useEffect, useState } from 'react'
import '../styles/SummaryCards.css'

function SummaryCards({ data }) {
  const [stats, setStats] = useState({
    totalUnits: 0,
    totalSales: 0,
    totalDiscount: 0
  })

  useEffect(() => {
    if (data && data.length > 0) {
      const totalUnits = data.reduce((sum, item) => sum + (parseInt(item['Quantity']) || 0), 0)
      const totalSales = data.reduce((sum, item) => sum + (parseFloat(item['Final Amount']) || 0), 0)
      const totalDiscount = data.reduce((sum, item) => {
        const price = parseFloat(item['Price per Unit']) || 0
        const qty = parseInt(item['Quantity']) || 0
        const discount = parseFloat(item['Discount Percentage']) || 0
        return sum + (price * qty * discount / 100)
      }, 0)
      
      setStats({
        totalUnits,
        totalSales,
        totalDiscount
      })
    } else {
      setStats({
        totalUnits: 0,
        totalSales: 0,
        totalDiscount: 0
      })
    }
  }, [data])

  const cards = [
    {
      title: 'Total Units Sold',
      value: stats.totalUnits.toLocaleString(),
      icon: '📦',
      color: '#6366f1'
    },
    {
      title: 'Total Sales Amount',
      value: `$${stats.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: '💰',
      color: '#10b981'
    },
    {
      title: 'Total Discount',
      value: `$${stats.totalDiscount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: '🏷️',
      color: '#f59e0b'
    }
  ]

  return (
    <div className="summary-cards">
      {cards.map((card, index) => (
        <div key={index} className="summary-card" style={{ '--card-color': card.color }}>
          <div className="card-header">
            <span className="card-icon">{card.icon}</span>
            <h3 className="card-title">{card.title}</h3>
          </div>
          <div className="card-value">{card.value}</div>
        </div>
      ))}
    </div>
  )
}

export default SummaryCards

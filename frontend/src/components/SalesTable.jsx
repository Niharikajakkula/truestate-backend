import '../styles/SalesTable.css'

function SalesTable({ data }) {
  if (!data || data.length === 0) {
    return <div className="no-data">No sales data found</div>
  }

  return (
    <div className="table-container">
      <table className="sales-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Product</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Final Amount</th>
            <th>Payment</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((sale, index) => (
            <tr key={index}>
              <td>{sale['Date']}</td>
              <td>{sale['Customer Name']}</td>
              <td><strong>{sale['Gender']}</strong></td>
              <td>{sale['Phone Number']}</td>
              <td>{sale['Product Name']}</td>
              <td>{sale['Product Category']}</td>
              <td>{sale['Quantity']}</td>
              <td>${sale['Price per Unit']}</td>
              <td>{sale['Discount Percentage']}%</td>
              <td>${sale['Final Amount']}</td>
              <td>{sale['Payment Method']}</td>
              <td>
                <span className={`status status-${sale['Order Status']?.toLowerCase()}`}>
                  {sale['Order Status']}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SalesTable

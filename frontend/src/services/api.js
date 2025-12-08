import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api'

// Create axios instance with optimizations
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Accept-Encoding': 'gzip, deflate'
  }
})

// Sales APIs
export const fetchSales = async (params) => {
  const queryParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value) && value.length > 0) {
        queryParams.append(key, value.join(','))
      } else if (!Array.isArray(value)) {
        queryParams.append(key, value)
      }
    }
  })

  const response = await api.get(`/sales?${queryParams}`)
  return response.data
}

export const fetchFilterOptions = async () => {
  try {
    console.log('Fetching filter options from:', `${API_BASE_URL}/sales/filters`)
    const response = await api.get('/sales/filters')
    console.log('Filter options response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching filter options:', error)
    throw error
  }
}

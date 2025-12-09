import axios from 'axios'

// Use environment variable for API URL, fallback to local development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api'

// Create axios instance with optimizations
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout for cold starts
  withCredentials: false // Disabled for wildcard CORS compatibility
})

// Sales APIs
export const fetchSales = async (params) => {
  try {
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

    console.log('Fetching sales from:', `${API_BASE_URL}/sales?${queryParams}`)
    const response = await api.get(`/sales?${queryParams}`)
    return response.data
  } catch (error) {
    console.error('Error fetching sales:', error)
    console.error('API URL:', API_BASE_URL)
    console.error('Error details:', error.response?.data || error.message)
    throw error
  }
}

export const fetchFilterOptions = async () => {
  try {
    console.log('API_BASE_URL:', API_BASE_URL)
    console.log('Fetching filter options from:', `${API_BASE_URL}/sales/filters`)
    const response = await api.get('/sales/filters')
    console.log('Filter options response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching filter options:', error)
    console.error('Error details:', error.response?.data || error.message)
    throw error
  }
}

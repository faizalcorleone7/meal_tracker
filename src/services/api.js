import axios from 'axios'

// Use environment-based API URL
const API_BASE_URL = import.meta.env.PROD 
  ? '/api'  // Production: relative URL for Vercel
  : 'http://localhost:3200/api'  // Development: localhost

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Food Items API
export const foodItemsAPI = {
  getAll: (search = '') => api.get(`/food-items?search=${search}`),
  getById: (id) => api.get(`/food-items/${id}`),
  create: (foodItem) => api.post('/food-items', foodItem),
  update: (id, foodItem) => api.put(`/food-items/${id}`, foodItem),
  delete: (id) => api.delete(`/food-items/${id}`)
}

// Meals API
export const mealsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/meals?${queryString}`)
  },
  getById: (id) => api.get(`/meals/${id}`),
  create: (meal) => api.post('/meals', meal),
  update: (id, meal) => api.put(`/meals/${id}`, meal),
  delete: (id) => api.delete(`/meals/${id}`),
  getDailyTotals: (startDate, endDate, userId = 'default-user') => 
    api.get(`/meals/analytics/daily-totals?startDate=${startDate}&endDate=${endDate}&userId=${userId}`),
  getMealTypeTotals: (startDate, endDate, userId = 'default-user') => 
    api.get(`/meals/analytics/meal-type-totals?startDate=${startDate}&endDate=${endDate}&userId=${userId}`)
}

// User Profile API
export const profileAPI = {
  get: (userId = 'default-user') => api.get(`/profile?userId=${userId}`),
  update: (profile) => api.put('/profile', profile),
  calculateGoals: (data) => api.post('/profile/calculate-goals', data)
}

// Health check
export const healthAPI = {
  check: () => api.get('/health')
}

export default api 
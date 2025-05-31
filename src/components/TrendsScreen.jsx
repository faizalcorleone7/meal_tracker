import React, { useState, useMemo, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { mealsAPI } from '../services/api'

const TrendsScreen = () => {
  const [selectedMealType, setSelectedMealType] = useState('All')
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Get last 7 days
  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push(date.toISOString().split('T')[0])
    }
    return days
  }

  const last7Days = getLast7Days()

  // Fetch meals data for the last 7 days
  useEffect(() => {
    const fetchMealsData = async () => {
      try {
        setLoading(true)
        const startDate = last7Days[0]
        const endDate = last7Days[last7Days.length - 1]
        
        const response = await mealsAPI.getAll({
          startDate,
          endDate,
          userId: 'default-user'
        })
        
        // Convert the meal data to match the expected format
        const formattedMeals = response.data.map(meal => ({
          ...meal,
          id: meal._id,
          date: meal.date.split('T')[0] // Convert to YYYY-MM-DD format
        }))
        
        setMeals(formattedMeals)
      } catch (error) {
        console.error('Error fetching meals data:', error)
        setMeals([])
      } finally {
        setLoading(false)
      }
    }

    fetchMealsData()
  }, []) // Only run once when component mounts

  // Process data for charts
  const chartData = useMemo(() => {
    return last7Days.map(date => {
      const dayMeals = meals.filter(meal => {
        const mealMatches = meal.date === date
        const typeMatches = selectedMealType === 'All' || meal.type === selectedMealType
        return mealMatches && typeMatches
      })

      const dayTotals = dayMeals.reduce((totals, meal) => {
        meal.items.forEach(item => {
          totals.calories += item.calories
          totals.protein += item.protein
          totals.carbs += item.carbs
          totals.fat += item.fat
        })
        return totals
      }, { calories: 0, protein: 0, carbs: 0, fat: 0 })

      return {
        date,
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        calories: Math.round(dayTotals.calories),
        protein: Math.round(dayTotals.protein),
        carbs: Math.round(dayTotals.carbs),
        fat: Math.round(dayTotals.fat)
      }
    })
  }, [meals, selectedMealType, last7Days])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '0.75rem',
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: '0.125rem 0' }}>
              {entry.name}: {entry.value}{entry.name === 'Calories' ? '' : 'g'}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          fontSize: '1.2rem'
        }}>
          Loading trends data...
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Trends
        </h1>
        <p style={{ color: '#64748b' }}>
          Visual insights into your nutritional intake over the last 7 days
        </p>
      </header>

      {/* Meal Type Filter */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="form-group">
          <label className="form-label">Filter by Meal Type</label>
          <select 
            className="form-select"
            value={selectedMealType}
            onChange={(e) => setSelectedMealType(e.target.value)}
          >
            <option value="All">All Meals</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
          </select>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Calories Chart */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            Daily Calories
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="day" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="calories" 
                fill="#3b82f6" 
                name="Calories"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Protein Chart */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            Daily Protein (g)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="day" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="protein" 
                fill="#10b981" 
                name="Protein"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Carbs Chart */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            Daily Carbohydrates (g)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="day" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="carbs" 
                fill="#f59e0b" 
                name="Carbs"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fat Chart */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            Daily Fat (g)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="day" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="fat" 
                fill="#ef4444" 
                name="Fat"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
          7-Day Average
        </h3>
        <div className="grid grid-cols-4">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {Math.round(chartData.reduce((sum, day) => sum + day.calories, 0) / 7)}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Calories</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
              {Math.round(chartData.reduce((sum, day) => sum + day.protein, 0) / 7)}g
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Protein</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
              {Math.round(chartData.reduce((sum, day) => sum + day.carbs, 0) / 7)}g
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Carbs</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>
              {Math.round(chartData.reduce((sum, day) => sum + day.fat, 0) / 7)}g
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Fat</div>
          </div>
        </div>
      </div>

      {/* Data Info */}
      <div className="card" style={{ marginTop: '1rem', backgroundColor: '#f8fafc' }}>
        <p style={{ fontSize: '0.875rem', color: '#64748b', textAlign: 'center' }}>
          Showing data for {meals.length} meals from the last 7 days
          {selectedMealType !== 'All' && ` (${selectedMealType} only)`}
        </p>
      </div>
    </div>
  )
}

export default TrendsScreen 
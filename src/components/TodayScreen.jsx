import React from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

const TodayScreen = ({ meals }) => {
  // Calculate daily totals
  const dailyTotals = meals.reduce((totals, meal) => {
    meal.items.forEach(item => {
      totals.calories += item.calories
      totals.protein += item.protein
      totals.carbs += item.carbs
      totals.fat += item.fat
    })
    return totals
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 })

  // Flatten meals into individual rows for the table
  const tableRows = meals.flatMap(meal => 
    meal.items.map(item => ({
      mealType: meal.type,
      dish: `${item.name} (${item.weight})`,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat
    }))
  ).sort((a, b) => {
    // Define the order of meal types
    const mealOrder = { 'Breakfast': 1, 'Lunch': 2, 'Snack': 3, 'Dinner': 4 };
    return (mealOrder[a.mealType] || 5) - (mealOrder[b.mealType] || 5);
  })

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Today
        </h1>
        <p style={{ color: '#64748b' }}>
          {formatDate(today)}
        </p>
      </header>

      {/* Meals Table */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
          Today's Meals
        </h2>
        
        {tableRows.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>
              No meals logged for today
            </p>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Start tracking your nutrition by logging your first meal!
            </p>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '0.875rem'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ 
                      padding: '0.75rem', 
                      textAlign: 'left', 
                      fontWeight: '600',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      Meal Type
                    </th>
                    <th style={{ 
                      padding: '0.75rem', 
                      textAlign: 'left', 
                      fontWeight: '600',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      Dish
                    </th>
                    <th style={{ 
                      padding: '0.75rem', 
                      textAlign: 'right', 
                      fontWeight: '600',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      Calories (KCal)
                    </th>
                    <th style={{ 
                      padding: '0.75rem', 
                      textAlign: 'right', 
                      fontWeight: '600',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      Protein (g)
                    </th>
                    <th style={{ 
                      padding: '0.75rem', 
                      textAlign: 'right', 
                      fontWeight: '600',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      Carbs (g)
                    </th>
                    <th style={{ 
                      padding: '0.75rem', 
                      textAlign: 'right', 
                      fontWeight: '600',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      Fat (g)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, index) => (
                    <tr key={index} style={{ 
                      borderBottom: index < tableRows.length - 1 ? '1px solid #f1f5f9' : 'none'
                    }}>
                      <td style={{ 
                        padding: '0.75rem',
                        fontWeight: '500'
                      }}>
                        <span style={{
                          backgroundColor: 
                            row.mealType === 'Breakfast' ? '#fef3c7' :
                            row.mealType === 'Lunch' ? '#dbeafe' :
                            row.mealType === 'Dinner' ? '#fce7f3' : '#f3e8ff',
                          color:
                            row.mealType === 'Breakfast' ? '#92400e' :
                            row.mealType === 'Lunch' ? '#1e40af' :
                            row.mealType === 'Dinner' ? '#be185d' : '#7c3aed',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {row.mealType}
                        </span>
                      </td>
                      <td style={{ 
                        padding: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {row.dish}
                      </td>
                      <td style={{ 
                        padding: '0.75rem',
                        textAlign: 'right',
                        fontWeight: '500'
                      }}>
                        {Math.round(row.calories)}
                      </td>
                      <td style={{ 
                        padding: '0.75rem',
                        textAlign: 'right'
                      }}>
                        {Math.round(row.protein * 10) / 10}
                      </td>
                      <td style={{ 
                        padding: '0.75rem',
                        textAlign: 'right'
                      }}>
                        {Math.round(row.carbs * 10) / 10}
                      </td>
                      <td style={{ 
                        padding: '0.75rem',
                        textAlign: 'right'
                      }}>
                        {Math.round(row.fat * 10) / 10}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Summary Row */}
                <tfoot>
                  <tr style={{ 
                    backgroundColor: '#f1f5f9',
                    borderTop: '2px solid #e2e8f0'
                  }}>
                    <td style={{ 
                      padding: '0.75rem',
                      fontWeight: '700',
                      fontSize: '0.875rem'
                    }}>
                      TOTAL
                    </td>
                    <td style={{ 
                      padding: '0.75rem',
                      fontWeight: '600',
                      color: '#64748b'
                    }}>
                      {tableRows.length} item{tableRows.length !== 1 ? 's' : ''}
                    </td>
                    <td style={{ 
                      padding: '0.75rem',
                      textAlign: 'right',
                      fontWeight: '700',
                      color: '#3b82f6',
                      fontSize: '0.875rem'
                    }}>
                      {Math.round(dailyTotals.calories)}
                    </td>
                    <td style={{ 
                      padding: '0.75rem',
                      textAlign: 'right',
                      fontWeight: '700',
                      color: '#10b981',
                      fontSize: '0.875rem'
                    }}>
                      {Math.round(dailyTotals.protein * 10) / 10}
                    </td>
                    <td style={{ 
                      padding: '0.75rem',
                      textAlign: 'right',
                      fontWeight: '700',
                      color: '#f59e0b',
                      fontSize: '0.875rem'
                    }}>
                      {Math.round(dailyTotals.carbs * 10) / 10}
                    </td>
                    <td style={{ 
                      padding: '0.75rem',
                      textAlign: 'right',
                      fontWeight: '700',
                      color: '#ef4444',
                      fontSize: '0.875rem'
                    }}>
                      {Math.round(dailyTotals.fat * 10) / 10}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Log Meal Button */}
      <div style={{ marginTop: '2rem' }}>
        <Link 
          to="/log-meal" 
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <Plus size={20} />
          Log a Meal
        </Link>
      </div>
    </div>
  )
}

export default TodayScreen 
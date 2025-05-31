import React, { useState } from 'react'
import { Trash2, Calendar } from 'lucide-react'

const HistoryScreen = ({ meals, onDeleteMeal }) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDeleteClick = (meal) => {
    setDeleteConfirmation(meal)
  }

  const confirmDelete = () => {
    if (deleteConfirmation) {
      onDeleteMeal(deleteConfirmation.id)
      setDeleteConfirmation(null)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmation(null)
  }

  const groupedMeals = meals.reduce((groups, meal) => {
    const date = meal.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(meal)
    return groups
  }, {})

  const sortedDates = Object.keys(groupedMeals).sort((a, b) => new Date(b) - new Date(a))

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          History
        </h1>
        <p style={{ color: '#64748b' }}>
          Review your past meal logs
        </p>
      </header>

      {meals.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Calendar size={48} style={{ color: '#64748b', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            No meals logged yet
          </h3>
          <p style={{ color: '#64748b' }}>
            Start logging your meals to see them here
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {sortedDates.map(date => (
            <div key={date}>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '1rem',
                color: '#374151'
              }}>
                {formatDate(date)}
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {groupedMeals[date].map(meal => {
                  const totalCalories = meal.items.reduce((sum, item) => sum + item.calories, 0)
                  
                  return (
                    <div key={meal.id} className="card">
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '1rem'
                      }}>
                        <div>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                            {meal.type}
                          </h3>
                          <span style={{ 
                            backgroundColor: '#f1f5f9', 
                            color: '#475569',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontSize: '0.875rem'
                          }}>
                            {totalCalories} calories
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handleDeleteClick(meal)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            color: '#ef4444',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {meal.items.map((item, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.5rem',
                            backgroundColor: '#f8fafc',
                            borderRadius: '0.5rem'
                          }}>
                            <div>
                              <span style={{ fontWeight: '500' }}>{item.name}</span>
                              <span style={{ color: '#64748b', marginLeft: '0.5rem' }}>
                                ({item.weight})
                              </span>
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                              {item.calories} cal | {item.protein}g P | {item.carbs}g C | {item.fat}g F
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#374151'
            }}>
              Delete Meal
            </h3>
            <p style={{
              color: '#64748b',
              marginBottom: '2rem',
              lineHeight: '1.5'
            }}>
              Are you sure you want to delete this {deleteConfirmation.type.toLowerCase()} meal? This action cannot be undone.
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={cancelDelete}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f9fafb'
                  e.target.style.borderColor = '#9ca3af'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white'
                  e.target.style.borderColor = '#d1d5db'
                }}
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoryScreen 
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Plus, Check, ChevronDown, AlertCircle } from 'lucide-react'

const LogMealScreen = ({ onAddMeal, onAddFoodItem, onSearchFoodItems }) => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [mealType, setMealType] = useState('Breakfast')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showAddForm, setShowAddForm] = useState(false)
  const [showDateConfirm, setShowDateConfirm] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  
  const [newItem, setNewItem] = useState({
    name: '',
    weight: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  })

  // Debounced search effect
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchTerm.length > 0) {
        setIsSearching(true)
        try {
          const results = await onSearchFoodItems(searchTerm)
          setSearchResults(results)
          setShowDropdown(true)
        } catch (error) {
          console.error('Search error:', error)
          setSearchResults([])
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
        setShowDropdown(false)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(searchTimeout)
  }, [searchTerm, onSearchFoodItems])

  const toggleItemSelection = (food) => {
    setSelectedItems(prev => {
      const isSelected = prev.find(item => item.id === food.id)
      if (isSelected) {
        return prev.filter(item => item.id !== food.id)
      } else {
        return [...prev, food]
      }
    })
    setSearchTerm('')
    setShowDropdown(false)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleAddNewItem = async () => {
    if (newItem.name && newItem.weight && newItem.calories && newItem.protein && newItem.carbs && newItem.fat) {
      const item = {
        name: newItem.name.trim(),
        weight: newItem.weight,
        calories: parseFloat(newItem.calories),
        protein: parseFloat(newItem.protein),
        carbs: parseFloat(newItem.carbs),
        fat: parseFloat(newItem.fat)
      }
      
      try {
        setIsAddingItem(true)
        setError('')
        await onAddFoodItem(item)
        // Add the new item to selected items with a temporary ID
        setSelectedItems(prev => [...prev, { ...item, id: Date.now() }])
        setNewItem({ name: '', weight: '', calories: '', protein: '', carbs: '', fat: '' })
        setShowAddForm(false)
        setSuccessMessage('Food item added successfully!')
      } catch (error) {
        console.error('Error adding new food item:', error)
        
        // Handle different error types
        if (error.response?.status === 422) {
          setError(error.response.data.message || 'Food item already exists')
        } else if (error.response?.status === 400) {
          const validationErrors = error.response.data.errors
          if (validationErrors && validationErrors.length > 0) {
            setError(validationErrors.map(err => err.msg).join(', '))
          } else {
            setError('Invalid input data')
          }
        } else {
          setError('Failed to add food item. Please try again.')
        }
      } finally {
        setIsAddingItem(false)
      }
    } else {
      setError('Please fill in all fields')
    }
  }

  const handleLogSelectedItems = () => {
    if (selectedItems.length > 0) {
      setShowDateConfirm(true)
    }
  }

  const confirmLogMeal = async () => {
    const meal = {
      date: selectedDate,
      type: mealType,
      items: selectedItems.map(item => ({
        name: item.name,
        weight: item.weight,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat
      }))
    }
    
    try {
      const result = await onAddMeal(meal)
      if (result?.merged) {
        setSuccessMessage(result.message || 'Items added to existing meal!')
      } else {
        setSuccessMessage('Meal logged successfully!')
      }
      
      // Clear form and navigate after a short delay to show the message
      setTimeout(() => {
        navigate('/today')
      }, 1500)
    } catch (error) {
      console.error('Error logging meal:', error)
      setError('Failed to log meal. Please try again.')
    }
  }

  const removeSelectedItem = (itemId) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId))
  }

  const clearError = () => {
    setError('')
  }

  const clearSuccessMessage = () => {
    setSuccessMessage('')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '1rem',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/today')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ArrowLeft size={24} />
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Log a Meal</h1>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
        {/* Success Message */}
        {successMessage && (
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Check size={20} style={{ color: '#16a34a', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ color: '#15803d', fontWeight: '500' }}>Success</div>
              <div style={{ color: '#166534', fontSize: '0.875rem' }}>{successMessage}</div>
            </div>
            <button
              onClick={clearSuccessMessage}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#16a34a',
                fontSize: '1.25rem',
                padding: '0.25rem'
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={20} style={{ color: '#ef4444', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ color: '#dc2626', fontWeight: '500' }}>Error</div>
              <div style={{ color: '#7f1d1d', fontSize: '0.875rem' }}>{error}</div>
            </div>
            <button
              onClick={clearError}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#ef4444',
                fontSize: '1.25rem',
                padding: '0.25rem'
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Meal Type Selection */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Meal Type</label>
            <select 
              className="form-select"
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>
          </div>
        </div>

        {/* Search Bar with Dropdown */}
        <div className="card" style={{ marginBottom: '1rem', position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <Search 
              size={20} 
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b',
                zIndex: 2
              }}
            />
            <input
              type="text"
              placeholder="Search food items..."
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setShowDropdown(searchResults.length > 0)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            />
            
            {/* Loading indicator */}
            {isSearching && (
              <div style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b'
              }}>
                Searching...
              </div>
            )}
            
            {/* Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                zIndex: 10,
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {searchResults.map((food) => (
                  <div
                    key={food.id}
                    onClick={() => toggleItemSelection(food)}
                    style={{
                      padding: '0.75rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                      {food.name}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {food.weight} • {food.calories} cal • {food.protein}g P • {food.carbs}g C • {food.fat}g F
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* No results message */}
            {showDropdown && searchTerm.length > 0 && searchResults.length === 0 && !isSearching && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                zIndex: 10,
                padding: '0.75rem',
                textAlign: 'center',
                color: '#64748b'
              }}>
                No food items found. Try a different search term or add a new item.
              </div>
            )}
          </div>
        </div>

        {/* Selected Items */}
        {selectedItems.length > 0 && (
          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
              Selected Items ({selectedItems.length})
            </h3>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
              Total: {selectedItems.reduce((sum, item) => sum + item.calories, 0)} calories
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {selectedItems.map((item) => (
                <div key={item.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: '#eff6ff',
                  borderRadius: '0.5rem',
                  border: '1px solid #dbeafe'
                }}>
                  <div>
                    <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                      {item.name} ({item.weight})
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {item.calories} cal • {item.protein}g P • {item.carbs}g C • {item.fat}g F
                    </div>
                  </div>
                  <button
                    onClick={() => removeSelectedItem(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      borderRadius: '0.25rem',
                      color: '#ef4444'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Item Button */}
        <button
          onClick={() => {
            setShowAddForm(!showAddForm)
            setError('') // Clear error when toggling form
            setSuccessMessage('') // Clear success message when toggling form
          }}
          className="btn btn-secondary"
          style={{ width: '100%', marginBottom: '1rem' }}
        >
          <Plus size={20} />
          Add New Item
        </button>

        {/* Add New Item Form */}
        {showAddForm && (
          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
              Add New Food Item
            </h3>
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Dish Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter unique food name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Weight</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., 100g"
                  value={newItem.weight}
                  onChange={(e) => setNewItem(prev => ({ ...prev, weight: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Calories</label>
                <input
                  type="number"
                  className="form-input"
                  value={newItem.calories}
                  onChange={(e) => setNewItem(prev => ({ ...prev, calories: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Protein (g)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={newItem.protein}
                  onChange={(e) => setNewItem(prev => ({ ...prev, protein: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Carbs (g)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={newItem.carbs}
                  onChange={(e) => setNewItem(prev => ({ ...prev, carbs: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Fat (g)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={newItem.fat}
                  onChange={(e) => setNewItem(prev => ({ ...prev, fat: e.target.value }))}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                onClick={handleAddNewItem} 
                className="btn btn-primary"
                disabled={isAddingItem}
                style={{ 
                  opacity: isAddingItem ? 0.6 : 1,
                  cursor: isAddingItem ? 'not-allowed' : 'pointer'
                }}
              >
                {isAddingItem ? 'Adding...' : 'Add Item'}
              </button>
              <button 
                onClick={() => {
                  setShowAddForm(false)
                  setError('')
                  setSuccessMessage('')
                }} 
                className="btn btn-secondary"
                disabled={isAddingItem}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Log Selected Items Button */}
        {selectedItems.length > 0 && (
          <button
            onClick={handleLogSelectedItems}
            className="btn btn-primary"
            style={{ 
              width: '100%',
              position: 'sticky',
              bottom: '1rem'
            }}
          >
            Log Selected Items ({selectedItems.length})
          </button>
        )}

        {/* Date Confirmation Modal */}
        {showDateConfirm && (
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
            zIndex: 1000,
            padding: '1rem'
          }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                Confirm Meal Date
              </h3>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={confirmLogMeal} className="btn btn-primary" style={{ flex: 1 }}>
                  Confirm
                </button>
                <button 
                  onClick={() => setShowDateConfirm(false)} 
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LogMealScreen 
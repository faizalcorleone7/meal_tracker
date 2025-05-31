import React, { useState } from 'react'
import { Save, Calculator } from 'lucide-react'

const ProfileScreen = ({ profile, onUpdateProfile }) => {
  const [formData, setFormData] = useState(profile)
  const [isEditing, setIsEditing] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateGoals = () => {
    // Basic BMR calculation using Mifflin-St Jeor Equation
    const { height, currentWeight, goal } = formData
    
    // Assuming user is male for simplicity (in real app, would ask for gender)
    const bmr = 10 * currentWeight + 6.25 * height - 5 * 30 + 5 // Assuming age 30
    
    let activityMultiplier = 1.4 // Lightly active
    let goalMultiplier = 1
    
    if (goal === 'Weight Loss') {
      goalMultiplier = 0.8 // 20% deficit
    } else if (goal === 'Muscle Gain') {
      goalMultiplier = 1.1 // 10% surplus
    }
    
    const targetCalories = Math.round(bmr * activityMultiplier * goalMultiplier)
    const targetProtein = Math.round(currentWeight * 2.2) // 2.2g per kg
    const targetFat = Math.round(targetCalories * 0.25 / 9) // 25% of calories from fat
    const targetCarbs = Math.round((targetCalories - (targetProtein * 4) - (targetFat * 9)) / 4)
    
    setFormData(prev => ({
      ...prev,
      targetCalories,
      targetProtein,
      targetCarbs,
      targetFat
    }))
  }

  const handleSave = () => {
    onUpdateProfile(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(profile)
    setIsEditing(false)
  }

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Profile
        </h1>
        <p style={{ color: '#64748b' }}>
          Manage your personal information and nutritional goals
        </p>
      </header>

      {/* User Details */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
            Personal Information
          </h2>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="btn btn-secondary"
            >
              Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-2">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Goal</label>
            <select
              className="form-select"
              value={formData.goal}
              onChange={(e) => handleInputChange('goal', e.target.value)}
              disabled={!isEditing}
            >
              <option value="Weight Loss">Weight Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Current Weight (kg)</label>
            <input
              type="number"
              className="form-input"
              value={formData.currentWeight}
              onChange={(e) => handleInputChange('currentWeight', parseFloat(e.target.value) || 0)}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Weight (kg)</label>
            <input
              type="number"
              className="form-input"
              value={formData.targetWeight}
              onChange={(e) => handleInputChange('targetWeight', parseFloat(e.target.value) || 0)}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Height (cm)</label>
            <input
              type="number"
              className="form-input"
              value={formData.height}
              onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || 0)}
              disabled={!isEditing}
            />
          </div>
        </div>

        {isEditing && (
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={handleSave} className="btn btn-primary">
              <Save size={20} />
              Save Changes
            </button>
            <button onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Nutritional Goals */}
      <div className="card">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
            Nutritional Goals
          </h2>
          {isEditing && (
            <button 
              onClick={calculateGoals}
              className="btn btn-secondary"
            >
              <Calculator size={20} />
              Auto Calculate
            </button>
          )}
        </div>

        <div className="grid grid-cols-2">
          <div className="form-group">
            <label className="form-label">Target Calories per day</label>
            <input
              type="number"
              className="form-input"
              value={formData.targetCalories}
              onChange={(e) => handleInputChange('targetCalories', parseFloat(e.target.value) || 0)}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Protein per day (g)</label>
            <input
              type="number"
              className="form-input"
              value={formData.targetProtein}
              onChange={(e) => handleInputChange('targetProtein', parseFloat(e.target.value) || 0)}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Carbs per day (g)</label>
            <input
              type="number"
              className="form-input"
              value={formData.targetCarbs}
              onChange={(e) => handleInputChange('targetCarbs', parseFloat(e.target.value) || 0)}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Fat per day (g)</label>
            <input
              type="number"
              className="form-input"
              value={formData.targetFat}
              onChange={(e) => handleInputChange('targetFat', parseFloat(e.target.value) || 0)}
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Goal Progress */}
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Progress Towards Goal
          </h3>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem'
          }}>
            <div>
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Current Weight</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {formData.currentWeight} kg
              </div>
            </div>
            <div style={{ fontSize: '2rem', color: '#64748b' }}>→</div>
            <div>
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Target Weight</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {formData.targetWeight} kg
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Difference</span>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                color: formData.currentWeight > formData.targetWeight ? '#ef4444' : '#10b981'
              }}>
                {Math.abs(formData.currentWeight - formData.targetWeight)} kg
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileScreen 
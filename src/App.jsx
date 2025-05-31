import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import TodayScreen from './components/TodayScreen'
import HistoryScreen from './components/HistoryScreen'
import TrendsScreen from './components/TrendsScreen'
import ProfileScreen from './components/ProfileScreen'
import LogMealScreen from './components/LogMealScreen'
import { foodItemsAPI, mealsAPI, profileAPI } from './services/api'

function App() {
  const [meals, setMeals] = useState([])
  const [foodDatabase, setFoodDatabase] = useState([])
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        
        // Load food items
        const foodResponse = await foodItemsAPI.getAll()
        setFoodDatabase(foodResponse.data)
        
        // Load meals
        const mealsResponse = await mealsAPI.getAll()
        setMeals(mealsResponse.data.map(meal => ({
          ...meal,
          id: meal._id,
          date: meal.date.split('T')[0] // Convert to YYYY-MM-DD format
        })))
        
        // Load user profile
        const profileResponse = await profileAPI.get()
        setUserProfile(profileResponse.data)
        
      } catch (error) {
        console.error('Error loading initial data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  const addMeal = async (newMeal) => {
    try {
      const response = await mealsAPI.create(newMeal)
      const mealData = {
        ...response.data,
        id: response.data._id,
        date: response.data.date.split('T')[0]
      }
      
      if (response.status === 200) {
        // Meal was merged with existing meal
        setMeals(prev => prev.map(meal => 
          meal.id === mealData.id ? mealData : meal
        ))
        return { merged: true, message: response.data.message }
      } else {
        // New meal was created
        setMeals(prev => [...prev, mealData])
        return { merged: false, message: 'Meal logged successfully' }
      }
    } catch (error) {
      console.error('Error adding meal:', error)
      throw error
    }
  }

  const deleteMeal = async (mealId) => {
    try {
      await mealsAPI.delete(mealId)
      setMeals(prev => prev.filter(meal => meal.id !== mealId))
    } catch (error) {
      console.error('Error deleting meal:', error)
    }
  }

  const addFoodItem = async (newFood) => {
    try {
      const response = await foodItemsAPI.create(newFood)
      const createdFood = {
        ...response.data,
        id: response.data._id
      }
      setFoodDatabase(prev => [...prev, createdFood])
    } catch (error) {
      console.error('Error adding food item:', error)
    }
  }

  const updateProfile = async (updatedProfile) => {
    try {
      const response = await profileAPI.update(updatedProfile)
      setUserProfile(response.data)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const searchFoodItems = async (searchTerm) => {
    try {
      const response = await foodItemsAPI.getAll(searchTerm)
      return response.data.map(item => ({
        ...item,
        id: item._id
      }))
    } catch (error) {
      console.error('Error searching food items:', error)
      return []
    }
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <Router>
      <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/today" replace />} />
          <Route 
            path="/today" 
            element={
              <TodayScreen 
                meals={meals.filter(meal => meal.date === new Date().toISOString().split('T')[0])} 
              />
            } 
          />
          <Route 
            path="/history" 
            element={
              <HistoryScreen 
                meals={meals} 
                onDeleteMeal={deleteMeal}
              />
            } 
          />
          <Route 
            path="/trends" 
            element={<TrendsScreen />} 
          />
          <Route 
            path="/profile" 
            element={
              <ProfileScreen 
                profile={userProfile}
                onUpdateProfile={updateProfile}
              />
            } 
          />
          <Route 
            path="/log-meal" 
            element={
              <LogMealScreen 
                foodDatabase={foodDatabase}
                onAddMeal={addMeal}
                onAddFoodItem={addFoodItem}
                onSearchFoodItems={searchFoodItems}
              />
            } 
          />
        </Routes>
        <Navigation />
      </div>
    </Router>
  )
}

export default App 
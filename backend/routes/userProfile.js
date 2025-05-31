const express = require('express')
const { body, validationResult } = require('express-validator')
const UserProfile = require('../models/UserProfile')

const router = express.Router()

// GET /api/profile - Get user profile
router.get('/', async (req, res) => {
  try {
    const { userId = 'default-user' } = req.query
    let profile = await UserProfile.findOne({ userId })
    
    // If no profile exists, create a default one
    if (!profile) {
      profile = new UserProfile({
        userId,
        email: 'user@example.com',
        goal: 'Weight Loss',
        targetWeight: 70,
        height: 175,
        currentWeight: 80,
        targetCalories: 2000,
        targetProtein: 150,
        targetCarbs: 200,
        targetFat: 67
      })
      await profile.save()
    }
    
    res.json(profile)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/profile - Update user profile
router.put('/', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('goal').isIn(['Weight Loss', 'Muscle Gain', 'Maintenance']).withMessage('Valid goal is required'),
  body('targetWeight').isNumeric().withMessage('Target weight must be a number'),
  body('height').isNumeric().withMessage('Height must be a number'),
  body('currentWeight').isNumeric().withMessage('Current weight must be a number'),
  body('targetCalories').isNumeric().withMessage('Target calories must be a number'),
  body('targetProtein').isNumeric().withMessage('Target protein must be a number'),
  body('targetCarbs').isNumeric().withMessage('Target carbs must be a number'),
  body('targetFat').isNumeric().withMessage('Target fat must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { userId = 'default-user' } = req.body
    
    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { ...req.body, userId },
      { new: true, upsert: true, runValidators: true }
    )
    
    res.json(profile)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/profile/calculate-goals - Calculate nutritional goals based on user data
router.post('/calculate-goals', [
  body('height').isNumeric().withMessage('Height must be a number'),
  body('currentWeight').isNumeric().withMessage('Current weight must be a number'),
  body('goal').isIn(['Weight Loss', 'Muscle Gain', 'Maintenance']).withMessage('Valid goal is required'),
  body('age').optional().isNumeric().withMessage('Age must be a number'),
  body('gender').optional().isIn(['male', 'female']).withMessage('Gender must be male or female'),
  body('activityLevel').optional().isIn(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active']).withMessage('Invalid activity level')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { 
      height, 
      currentWeight, 
      goal, 
      age = 30, 
      gender = 'male',
      activityLevel = 'lightly_active'
    } = req.body

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr
    if (gender === 'male') {
      bmr = 10 * currentWeight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * currentWeight + 6.25 * height - 5 * age - 161
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    }

    const activityMultiplier = activityMultipliers[activityLevel]

    // Goal multipliers
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

    res.json({
      targetCalories,
      targetProtein,
      targetCarbs,
      targetFat,
      bmr: Math.round(bmr),
      tdee: Math.round(bmr * activityMultiplier)
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router 
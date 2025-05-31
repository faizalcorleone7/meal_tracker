const express = require('express')
const { body, validationResult } = require('express-validator')
const FoodItem = require('../models/FoodItem')

const router = express.Router()

// GET /api/food-items - Get all food items with optional search
router.get('/', async (req, res) => {
  try {
    const { search, limit = 50 } = req.query
    let query = {}
    
    if (search) {
      query = {
        name: { $regex: search, $options: 'i' }
      }
    }
    
    const foodItems = await FoodItem.find(query)
      .limit(parseInt(limit))
      .sort({ name: 1 })
    
    res.json(foodItems)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/food-items/:id - Get a specific food item
router.get('/:id', async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id)
    if (!foodItem) {
      return res.status(404).json({ error: 'Food item not found' })
    }
    res.json(foodItem)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/food-items - Create a new food item
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('weight').notEmpty().withMessage('Weight is required'),
  body('calories').isNumeric().withMessage('Calories must be a number'),
  body('protein').isNumeric().withMessage('Protein must be a number'),
  body('carbs').isNumeric().withMessage('Carbs must be a number'),
  body('fat').isNumeric().withMessage('Fat must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // Check if food item with same name already exists (case-insensitive)
    const existingFoodItem = await FoodItem.findOne({ 
      name: { $regex: new RegExp(`^${req.body.name.trim()}$`, 'i') } 
    })
    
    if (existingFoodItem) {
      return res.status(422).json({ 
        error: 'Food item already exists',
        message: `A food item with the name "${req.body.name.trim()}" already exists.`
      })
    }

    const foodItem = new FoodItem(req.body)
    await foodItem.save()
    res.status(201).json(foodItem)
  } catch (error) {
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(422).json({ 
        error: 'Food item already exists',
        message: `A food item with the name "${req.body.name.trim()}" already exists.`
      })
    }
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/food-items/:id - Update a food item
router.put('/:id', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('weight').notEmpty().withMessage('Weight is required'),
  body('calories').isNumeric().withMessage('Calories must be a number'),
  body('protein').isNumeric().withMessage('Protein must be a number'),
  body('carbs').isNumeric().withMessage('Carbs must be a number'),
  body('fat').isNumeric().withMessage('Fat must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // Check if another food item with same name already exists (excluding current item)
    const existingFoodItem = await FoodItem.findOne({ 
      name: { $regex: new RegExp(`^${req.body.name.trim()}$`, 'i') },
      _id: { $ne: req.params.id }
    })
    
    if (existingFoodItem) {
      return res.status(422).json({ 
        error: 'Food item already exists',
        message: `A food item with the name "${req.body.name.trim()}" already exists.`
      })
    }

    const foodItem = await FoodItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!foodItem) {
      return res.status(404).json({ error: 'Food item not found' })
    }
    
    res.json(foodItem)
  } catch (error) {
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(422).json({ 
        error: 'Food item already exists',
        message: `A food item with the name "${req.body.name.trim()}" already exists.`
      })
    }
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/food-items/:id - Delete a food item
router.delete('/:id', async (req, res) => {
  try {
    const foodItem = await FoodItem.findByIdAndDelete(req.params.id)
    if (!foodItem) {
      return res.status(404).json({ error: 'Food item not found' })
    }
    res.json({ message: 'Food item deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router 
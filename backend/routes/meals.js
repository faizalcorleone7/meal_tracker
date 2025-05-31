const express = require('express')
const { body, validationResult } = require('express-validator')
const Meal = require('../models/Meal')

const router = express.Router()

// GET /api/meals - Get all meals with optional date filtering
router.get('/', async (req, res) => {
  try {
    const { date, startDate, endDate, type, userId = 'default-user' } = req.query
    let query = { userId }
    
    if (date) {
      const targetDate = new Date(date)
      const nextDate = new Date(targetDate)
      nextDate.setDate(nextDate.getDate() + 1)
      query.date = { $gte: targetDate, $lt: nextDate }
    } else if (startDate && endDate) {
      query.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      }
    }
    
    if (type) {
      query.type = type
    }
    
    const meals = await Meal.find(query).sort({ date: -1, createdAt: -1 })
    res.json(meals)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/meals/:id - Get a specific meal
router.get('/:id', async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id)
    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' })
    }
    res.json(meal)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/meals - Create a new meal or merge with existing meal of same type/date
router.post('/', [
  body('date').isISO8601().withMessage('Valid date is required'),
  body('type').isIn(['Breakfast', 'Lunch', 'Dinner', 'Snack']).withMessage('Valid meal type is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.name').notEmpty().withMessage('Item name is required'),
  body('items.*.weight').notEmpty().withMessage('Item weight is required'),
  body('items.*.calories').isNumeric().withMessage('Item calories must be a number'),
  body('items.*.protein').isNumeric().withMessage('Item protein must be a number'),
  body('items.*.carbs').isNumeric().withMessage('Item carbs must be a number'),
  body('items.*.fat').isNumeric().withMessage('Item fat must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const userId = req.body.userId || 'default-user'
    const mealDate = new Date(req.body.date)
    const mealType = req.body.type
    const newItems = req.body.items

    // Check if a meal of the same type already exists for this date and user
    const existingMeal = await Meal.findOne({
      userId,
      type: mealType,
      date: {
        $gte: new Date(mealDate.toISOString().split('T')[0] + 'T00:00:00.000Z'),
        $lt: new Date(mealDate.toISOString().split('T')[0] + 'T23:59:59.999Z')
      }
    })

    if (existingMeal) {
      // Merge the new items with the existing meal
      existingMeal.items = [...existingMeal.items, ...newItems]
      existingMeal.updatedAt = new Date()
      
      await existingMeal.save()
      
      res.status(200).json({
        ...existingMeal.toObject(),
        message: `Items added to existing ${mealType.toLowerCase()} meal`
      })
    } else {
      // Create a new meal
      const mealData = {
        userId,
        date: mealDate,
        type: mealType,
        items: newItems
      }

      const meal = new Meal(mealData)
      await meal.save()
      
      res.status(201).json(meal)
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/meals/:id - Update a meal
router.put('/:id', [
  body('date').isISO8601().withMessage('Valid date is required'),
  body('type').isIn(['Breakfast', 'Lunch', 'Dinner', 'Snack']).withMessage('Valid meal type is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const updateData = {
      ...req.body,
      date: new Date(req.body.date)
    }

    const meal = await Meal.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    
    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' })
    }
    
    res.json(meal)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/meals/:id - Delete a meal
router.delete('/:id', async (req, res) => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id)
    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' })
    }
    res.json({ message: 'Meal deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/meals/analytics/daily-totals - Get daily nutritional totals
router.get('/analytics/daily-totals', async (req, res) => {
  try {
    const { startDate, endDate, userId = 'default-user' } = req.query
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' })
    }

    const pipeline = [
      {
        $match: {
          userId,
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $unwind: '$items'
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }
          },
          totalCalories: { $sum: '$items.calories' },
          totalProtein: { $sum: '$items.protein' },
          totalCarbs: { $sum: '$items.carbs' },
          totalFat: { $sum: '$items.fat' }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]

    const results = await Meal.aggregate(pipeline)
    res.json(results)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/meals/analytics/meal-type-totals - Get totals by meal type
router.get('/analytics/meal-type-totals', async (req, res) => {
  try {
    const { startDate, endDate, userId = 'default-user' } = req.query
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' })
    }

    const pipeline = [
      {
        $match: {
          userId,
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $unwind: '$items'
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            type: '$type'
          },
          totalCalories: { $sum: '$items.calories' },
          totalProtein: { $sum: '$items.protein' },
          totalCarbs: { $sum: '$items.carbs' },
          totalFat: { $sum: '$items.fat' }
        }
      },
      {
        $sort: { '_id.date': 1, '_id.type': 1 }
      }
    ]

    const results = await Meal.aggregate(pipeline)
    res.json(results)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router 
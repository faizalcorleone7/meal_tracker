const mongoose = require('mongoose')

const mealItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  weight: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true,
    min: 0
  },
  protein: {
    type: Number,
    required: true,
    min: 0
  },
  carbs: {
    type: Number,
    required: true,
    min: 0
  },
  fat: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false })

const mealSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack']
  },
  items: [mealItemSchema],
  userId: {
    type: String,
    default: 'default-user' // For now, using a default user since no auth
  }
}, {
  timestamps: true
})

// Index for efficient querying
mealSchema.index({ date: 1, userId: 1 })
mealSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model('Meal', mealSchema) 
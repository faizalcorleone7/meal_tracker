const mongoose = require('mongoose')

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
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
}, {
  timestamps: true
})

// Index for text search
foodItemSchema.index({ name: 'text' })

// Unique index for name (case-insensitive)
foodItemSchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } })

module.exports = mongoose.model('FoodItem', foodItemSchema) 
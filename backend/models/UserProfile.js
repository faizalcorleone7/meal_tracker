const mongoose = require('mongoose')

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    default: 'default-user'
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  goal: {
    type: String,
    required: true,
    enum: ['Weight Loss', 'Muscle Gain', 'Maintenance']
  },
  targetWeight: {
    type: Number,
    required: true,
    min: 0
  },
  height: {
    type: Number,
    required: true,
    min: 0
  },
  currentWeight: {
    type: Number,
    required: true,
    min: 0
  },
  targetCalories: {
    type: Number,
    required: true,
    min: 0
  },
  targetProtein: {
    type: Number,
    required: true,
    min: 0
  },
  targetCarbs: {
    type: Number,
    required: true,
    min: 0
  },
  targetFat: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('UserProfile', userProfileSchema) 
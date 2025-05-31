const mongoose = require('mongoose')
const config = require('../config')
const FoodItem = require('../models/FoodItem')
const Meal = require('../models/Meal')
const UserProfile = require('../models/UserProfile')

const foodItems = [
  { name: 'Oatmeal', weight: '100g', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 },
  { name: 'Banana', weight: '120g', calories: 107, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: 'Grilled Chicken', weight: '150g', calories: 231, protein: 43.5, carbs: 0, fat: 5 },
  { name: 'Brown Rice', weight: '100g', calories: 111, protein: 2.6, carbs: 23, fat: 0.9 },
  { name: 'Apple', weight: '100g', calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  { name: 'Salmon', weight: '100g', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: 'Broccoli', weight: '100g', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { name: 'Sweet Potato', weight: '100g', calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  { name: 'Greek Yogurt', weight: '150g', calories: 100, protein: 17, carbs: 6, fat: 0.4 },
  { name: 'Almonds', weight: '30g', calories: 174, protein: 6.4, carbs: 6.1, fat: 15.2 },
  { name: 'Quinoa', weight: '100g', calories: 120, protein: 4.4, carbs: 22, fat: 1.9 },
  { name: 'Spinach', weight: '100g', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  { name: 'Avocado', weight: '100g', calories: 160, protein: 2, carbs: 9, fat: 15 },
  { name: 'Eggs', weight: '100g', calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  { name: 'Whole Wheat Bread', weight: '30g', calories: 69, protein: 3.6, carbs: 12, fat: 1.2 }
]

const sampleMeals = [
  {
    date: new Date('2024-01-15'),
    type: 'Breakfast',
    items: [
      { name: 'Oatmeal', weight: '100g', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 },
      { name: 'Banana', weight: '120g', calories: 107, protein: 1.3, carbs: 27, fat: 0.4 }
    ],
    userId: 'default-user'
  },
  {
    date: new Date('2024-01-15'),
    type: 'Lunch',
    items: [
      { name: 'Grilled Chicken', weight: '150g', calories: 231, protein: 43.5, carbs: 0, fat: 5 },
      { name: 'Brown Rice', weight: '100g', calories: 111, protein: 2.6, carbs: 23, fat: 0.9 }
    ],
    userId: 'default-user'
  }
]

const defaultProfile = {
  userId: 'default-user',
  email: 'user@example.com',
  goal: 'Weight Loss',
  targetWeight: 70,
  height: 175,
  currentWeight: 80,
  targetCalories: 2000,
  targetProtein: 150,
  targetCarbs: 200,
  targetFat: 67
}

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('Connected to MongoDB')

    // Clear existing data
    await FoodItem.deleteMany({})
    await Meal.deleteMany({})
    await UserProfile.deleteMany({})
    console.log('Cleared existing data')

    // Insert food items
    await FoodItem.insertMany(foodItems)
    console.log(`Inserted ${foodItems.length} food items`)

    // Insert sample meals
    await Meal.insertMany(sampleMeals)
    console.log(`Inserted ${sampleMeals.length} sample meals`)

    // Insert default user profile
    await UserProfile.create(defaultProfile)
    console.log('Created default user profile')

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await mongoose.connection.close()
    console.log('Database connection closed')
  }
}

// Run the seed function if this script is executed directly
if (require.main === module) {
  seedDatabase()
}

module.exports = seedDatabase 
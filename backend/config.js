module.exports = {
  PORT: process.env.PORT || 3200,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/meal-tracker',
  NODE_ENV: process.env.NODE_ENV || 'development'
} 
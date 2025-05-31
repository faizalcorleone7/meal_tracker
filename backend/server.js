const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const config = require('./config')

// Import routes
const foodItemsRoutes = require('./routes/foodItems')
const mealsRoutes = require('./routes/meals')
const userProfileRoutes = require('./routes/userProfile')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Routes
app.use('/api/food-items', foodItemsRoutes)
app.use('/api/meals', mealsRoutes)
app.use('/api/profile', userProfileRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ 
    error: 'Internal server error',
    message: config.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB')
  
  // Start server
  app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
    console.log(`Environment: ${config.NODE_ENV}`)
    console.log(`MongoDB URI: ${config.MONGODB_URI}`)
  })
})
.catch((error) => {
  console.error('MongoDB connection error:', error)
  process.exit(1)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...')
  await mongoose.connection.close()
  process.exit(0)
}) 
# Meal Tracker Backend API

A RESTful API built with Node.js, Express, and MongoDB for the Meal Tracker application.

## Features

- **Food Items Management**: CRUD operations for food items with search functionality
- **Meals Management**: Log, update, delete meals with nutritional tracking
- **User Profiles**: Manage user information and nutritional goals
- **Analytics**: Daily totals and meal type analysis for trends
- **Data Validation**: Input validation using express-validator
- **MongoDB Integration**: Efficient data storage with proper indexing

## Prerequisites

- Node.js (version 14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure MongoDB:**
   - For local MongoDB: Make sure MongoDB is running on `mongodb://localhost:27017`
   - For MongoDB Atlas: Update the `MONGODB_URI` in `config.js`

4. **Seed the database with initial data:**
   ```bash
   npm run seed
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3200`

## API Endpoints

### Food Items

- `GET /api/food-items` - Get all food items (with optional search)
  - Query params: `search`, `limit`
- `GET /api/food-items/:id` - Get a specific food item
- `POST /api/food-items` - Create a new food item
- `PUT /api/food-items/:id` - Update a food item
- `DELETE /api/food-items/:id` - Delete a food item

### Meals

- `GET /api/meals` - Get all meals (with optional filtering)
  - Query params: `date`, `startDate`, `endDate`, `type`, `userId`
- `GET /api/meals/:id` - Get a specific meal
- `POST /api/meals` - Create a new meal
- `PUT /api/meals/:id` - Update a meal
- `DELETE /api/meals/:id` - Delete a meal

### Analytics

- `GET /api/meals/analytics/daily-totals` - Get daily nutritional totals
  - Query params: `startDate`, `endDate`, `userId`
- `GET /api/meals/analytics/meal-type-totals` - Get totals by meal type
  - Query params: `startDate`, `endDate`, `userId`

### User Profile

- `GET /api/profile` - Get user profile
  - Query params: `userId`
- `PUT /api/profile` - Update user profile
- `POST /api/profile/calculate-goals` - Calculate nutritional goals

### Health Check

- `GET /api/health` - API health check

## Data Models

### FoodItem
```javascript
{
  name: String,
  weight: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number
}
```

### Meal
```javascript
{
  date: Date,
  type: String, // 'Breakfast', 'Lunch', 'Dinner', 'Snack'
  items: [FoodItem],
  userId: String
}
```

### UserProfile
```javascript
{
  userId: String,
  email: String,
  goal: String, // 'Weight Loss', 'Muscle Gain', 'Maintenance'
  targetWeight: Number,
  height: Number,
  currentWeight: Number,
  targetCalories: Number,
  targetProtein: Number,
  targetCarbs: Number,
  targetFat: Number
}
```

## Example API Calls

### Search Food Items
```bash
curl "http://localhost:3200/api/food-items?search=chicken"
```

### Create a Meal
```bash
curl -X POST http://localhost:3200/api/meals \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "type": "Breakfast",
    "items": [
      {
        "name": "Oatmeal",
        "weight": "100g",
        "calories": 389,
        "protein": 16.9,
        "carbs": 66.3,
        "fat": 6.9
      }
    ]
  }'
```

### Get Daily Totals
```bash
curl "http://localhost:3200/api/meals/analytics/daily-totals?startDate=2024-01-01&endDate=2024-01-31"
```

## Development

### Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm run seed` - Seed the database with initial data

### Environment Variables

The application uses the following configuration (in `config.js`):

- `PORT` - Server port (default: 3200)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development/production)

### Database Indexing

The application creates the following indexes for optimal performance:

- **FoodItems**: Text index on `name` for search functionality
- **Meals**: Compound indexes on `date + userId` and `userId + createdAt`

## Error Handling

The API includes comprehensive error handling:

- Input validation errors (400)
- Resource not found errors (404)
- Server errors (500)
- Detailed error messages in development mode

## CORS

CORS is enabled for all origins to allow frontend development on different ports.

## Future Enhancements

- User authentication and authorization
- Rate limiting
- API documentation with Swagger
- Caching with Redis
- File upload for food images
- Bulk operations for meals
- Advanced analytics and reporting 
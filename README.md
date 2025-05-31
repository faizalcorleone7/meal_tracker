# Meal Tracker App

A modern, responsive meal tracking application built with React and Node.js that helps users log their daily meals, track nutritional intake, and visualize eating patterns over time.

## Features

### 📱 Core Functionality
- **Today Screen**: View current day's meals and daily nutritional summary
- **Meal Logging**: Search and select food items with smart dropdown search
- **History**: Browse past meals with detailed nutritional breakdown
- **Trends**: Visualize nutritional data with interactive charts
- **Profile Management**: Set goals and track progress

### 🔍 Smart Food Search
- Real-time search with debounced API calls
- Dropdown suggestions as you type
- Add custom food items on the fly
- No more scrolling through long lists

### 📊 Analytics & Visualization
- 7-day nutritional trends with bar charts
- Filter by meal type (Breakfast, Lunch, Dinner, Snack)
- Daily averages and progress tracking
- Visual progress indicators

### 🎯 Goal Setting
- Auto-calculate nutritional goals based on user data
- Support for Weight Loss, Muscle Gain, and Maintenance goals
- BMR and TDEE calculations
- Customizable targets for calories, protein, carbs, and fat

## Technology Stack

### Frontend
- **React 18** with functional components and hooks
- **React Router** for navigation
- **Recharts** for data visualization
- **Lucide React** for icons
- **Axios** for API communication
- **Vite** for fast development and building

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **Express Validator** for input validation
- **CORS** enabled for cross-origin requests

## Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Frontend Setup

1. **Clone the repository and install dependencies:**
   ```bash
   git clone <repository-url>
   cd meal_tracker
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3001`

### Backend Setup

1. **Navigate to backend directory and install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure MongoDB:**
   - For local MongoDB: Ensure MongoDB is running on `mongodb://localhost:27017`
   - For MongoDB Atlas: Update `MONGODB_URI` in `backend/config.js`

3. **Seed the database with initial data:**
   ```bash
   npm run seed
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3200`

## API Endpoints

### Food Items
- `GET /api/food-items?search=query` - Search food items
- `POST /api/food-items` - Create new food item
- `PUT /api/food-items/:id` - Update food item
- `DELETE /api/food-items/:id` - Delete food item

### Meals
- `GET /api/meals` - Get all meals (with filtering)
- `POST /api/meals` - Log a new meal
- `DELETE /api/meals/:id` - Delete a meal

### Analytics
- `GET /api/meals/analytics/daily-totals` - Daily nutritional totals
- `GET /api/meals/analytics/meal-type-totals` - Totals by meal type

### User Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/calculate-goals` - Calculate nutritional goals

## Project Structure

```
meal_tracker/
├── src/
│   ├── components/
│   │   ├── Navigation.jsx
│   │   ├── TodayScreen.jsx
│   │   ├── LogMealScreen.jsx
│   │   ├── HistoryScreen.jsx
│   │   ├── TrendsScreen.jsx
│   │   └── ProfileScreen.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── backend/
│   ├── models/
│   │   ├── FoodItem.js
│   │   ├── Meal.js
│   │   └── UserProfile.js
│   ├── routes/
│   │   ├── foodItems.js
│   │   ├── meals.js
│   │   └── userProfile.js
│   ├── scripts/
│   │   └── seedData.js
│   ├── server.js
│   └── config.js
├── package.json
└── README.md
```

## Key Features Implemented

### 🔍 Smart Search Experience
- **Dropdown Search**: Food items appear in a dropdown as you type
- **Debounced API Calls**: Efficient search with 300ms debounce
- **No Results Handling**: Helpful message when no items found
- **Loading States**: Visual feedback during search

### 📊 Data Persistence
- **MongoDB Integration**: All data stored in MongoDB
- **CRUD Operations**: Full create, read, update, delete functionality
- **Data Validation**: Server-side validation for all inputs
- **Error Handling**: Comprehensive error handling and user feedback

### 📱 Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Touch-Friendly**: Large touch targets and intuitive gestures
- **Modern UI**: Clean, professional design with proper spacing
- **Accessibility**: Semantic HTML and keyboard navigation

### 🎯 Nutritional Tracking
- **Real-Time Calculations**: Instant nutritional totals
- **Goal Tracking**: Visual progress indicators
- **Historical Data**: Complete meal history with analytics
- **Flexible Goals**: Support for different fitness goals

## Sample Data

The application comes with pre-seeded data including:
- 15 common food items (Oatmeal, Chicken, Rice, etc.)
- Sample meals for demonstration
- Default user profile with calculated goals

## Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend:**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with initial data

### Environment Configuration

Update `backend/config.js` for your environment:
```javascript
module.exports = {
  PORT: process.env.PORT || 3200,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/meal-tracker',
  NODE_ENV: process.env.NODE_ENV || 'development'
}
```

## Future Enhancements

- User authentication and multi-user support
- Barcode scanning for food items
- Meal planning and recipes
- Social features and meal sharing
- Advanced analytics and insights
- Mobile app with React Native
- Offline support with service workers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
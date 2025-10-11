# CVD Prediction Backend API

A robust Node.js/Express backend API for the Cardiovascular Disease Prediction System with MongoDB integration, JWT authentication, and comprehensive user management.

## Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 📊 **CVD Prediction Management** - Store and retrieve prediction results
- 👤 **User Management** - Profile management and user data handling
- 🗄️ **MongoDB Integration** - Mongoose ODM with data validation
- 🔒 **Security** - Rate limiting, helmet, CORS protection
- ✅ **Input Validation** - Comprehensive data validation with express-validator
- 📖 **RESTful API** - Well-structured REST endpoints
- 🚀 **Error Handling** - Centralized error handling with proper status codes

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security middleware
- **cors** - Cross-origin resource sharing

## Project Structure

```
cvd-backend/
├── models/
│   ├── User.js              # User model schema
│   └── Prediction.js        # Prediction model schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── user.js              # User management routes
│   └── prediction.js        # Prediction routes
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── errorHandler.js      # Error handling middleware
│   └── validation.js        # Input validation middleware
├── utils/
│   └── auth.js              # Authentication utilities
├── server.js                # Main server file
├── package.json             # Dependencies and scripts
├── .env.example             # Environment variables template
└── README.md                # This file
```

## Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cvd_prediction_db
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

## Installation & Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Start MongoDB:**
   Make sure MongoDB is running on your system

4. **Run the server:**

   ```bash
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### User Management

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/change-password` - Change password
- `DELETE /api/user/account` - Deactivate account

### Predictions

- `POST /api/prediction/predict` - Create new prediction
- `GET /api/prediction/history` - Get user's prediction history
- `GET /api/prediction/:id` - Get specific prediction
- `DELETE /api/prediction/:id` - Delete prediction
- `GET /api/prediction/stats/overview` - Get prediction statistics

### Health Check

- `GET /api/health` - API health status

## API Request/Response Examples

### User Registration

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "age": 35,
  "gender": "male"
}
```

### CVD Prediction

```bash
POST /api/prediction/predict
Authorization: Bearer <token>
Content-Type: application/json

{
  "gender": "male",
  "age": 45,
  "educationLevel": "higher",
  "currentSmoker": false,
  "bpMedication": false,
  "prevalentStroke": false,
  "prevalentHypertension": true,
  "diabetes": false,
  "totalCholesterol": 220,
  "systolicBP": 140,
  "diastolicBP": 90,
  "bmi": 28.5,
  "heartRate": 75,
  "glucoseLevel": 95
}
```

## Data Models

### User Model

- name, email, password (hashed)
- age, gender
- isActive, lastLogin
- timestamps

### Prediction Model

- user (reference to User)
- healthData (all input parameters)
- predictionResults (4 model results + overall)
- insights (risk factors, recommendations)
- predictionDate, isActive
- timestamps

## Security Features

- **Password Hashing** - bcryptjs with salt rounds
- **JWT Tokens** - Secure authentication tokens
- **Rate Limiting** - Prevent abuse and attacks
- **CORS Protection** - Configured for frontend URL
- **Helmet** - Security headers
- **Input Validation** - Comprehensive validation rules
- **Error Handling** - No sensitive data exposure

## Error Handling

All API responses follow this format:

**Success Response:**

```json
{
  "status": "success",
  "data": { ... }
}
```

**Error Response:**

```json
{
  "status": "error",
  "message": "Error description",
  "errors": [...]  // For validation errors
}
```

## Integration with Frontend

The API is designed to work with the React frontend located in `../cvd-frontend/`. Key integration points:

1. **Authentication State** - JWT tokens for user sessions
2. **Form Submission** - Health data validation and prediction
3. **Historical Data** - User prediction history display
4. **Error Handling** - Proper error messages for UI

## Python Integration (Future)

The prediction logic currently uses mock data. To integrate with Python FastAPI:

1. Replace `mockPrediction()` function in `routes/prediction.js`
2. Add HTTP client to call Python API
3. Handle Python API responses and errors
4. Update prediction result format if needed

## Development

For development with automatic restart:

```bash
npm run dev
```

The server will restart automatically when files change.

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Set strong JWT secrets
4. Configure reverse proxy (nginx)
5. Use PM2 for process management
6. Enable SSL/TLS

## Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include input validation
4. Write descriptive commit messages
5. Test all endpoints before submitting

## License

This project is part of the CVD Prediction System academic project.

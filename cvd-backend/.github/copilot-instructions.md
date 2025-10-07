## Project Overview
This is a Cardiovascular Disease Prediction Backend API built with TypeScript, Express.js, MongoDB, and modern ES modules. The backend provides secure user authentication and CVD report management for the React frontend.

## Architecture
- **Language**: TypeScript with ES modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate limiting, Input validation

## Key Features
1. **User Authentication**: Secure JWT-based authentication system
2. **CVD Report Management**: Store and retrieve cardiovascular disease prediction reports
3. **Minimal Data Storage**: Only essential user info (name, age, gender) and CVD results from Python API
4. **Modern TypeScript**: Full type safety with ES modules
5. **Security**: Comprehensive security middleware and validation

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### CVD Reports
- `POST /api/reports` - Create new CVD report (from Python API results)
- `GET /api/reports` - Get user's report history with pagination
- `GET /api/reports/:id` - Get specific report
- `DELETE /api/reports/:id` - Delete report
- `GET /api/reports/stats/overview` - Get user statistics

### Health Check
- `GET /api/health` - API health status

## Data Models

### User
```typescript
{
  name: string;
  email: string;
  password: string; // hashed
  age: number;
  gender: 'male' | 'female' | 'other';
  isActive: boolean;
  lastLogin: Date;
}
```

### CVD Report
```typescript
{
  user: ObjectId; // Reference to User
  userName: string; // Stored for historical reference
  userAge: number; // Age at time of report
  userGender: 'male' | 'female' | 'other';
  predictionResult: {
    riskLevel: 'low' | 'medium' | 'high';
    riskScore: number; // 0-100
    confidence: number; // 0-1
    recommendations: string[];
    modelUsed: string;
    additionalInfo?: any; // Optional data from Python API
  };
  reportDate: Date;
}
```

## Integration Points

### With Frontend (cvd-frontend)
- CORS configured for http://localhost:5173
- RESTful API responses with consistent format
- JWT token-based authentication
- Error handling with proper status codes

### With Python API
- Receives CVD prediction results via POST /api/reports
- Stores minimal essential data only
- No health input data stored (privacy focused)

## Environment Variables
```
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/cvd_prediction_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

## Development
```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start development server
npm run dev

# Start production server
npm start
```

## Security Features
- JWT authentication with secure tokens
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting for API protection
- CORS protection
- Helmet security headers
- Error handling without data exposure

## Project Structure
```
src/
├── types/           # TypeScript type definitions
├── models/          # MongoDB/Mongoose models
├── routes/          # Express route handlers
├── middleware/      # Authentication, validation, error handling
├── utils/           # Utility functions
└── server.ts        # Main server file
```

This backend is specifically designed to work with the CVD frontend and Python prediction service, focusing on minimal data storage and maximum security.

# Mentra Backend Server

A robust Node.js backend server for the Mentra Mental Health Support Platform, built with Express.js, MongoDB, and JWT authentication.

## 🚀 Features

### 🔐 Authentication System
- **User Registration** with email validation and password strength checking
- **User Login** with JWT token-based authentication
- **Password Hashing** using bcryptjs with configurable salt rounds
- **JWT Token Management** with configurable expiration
- **User Profile Management** with avatar support

### 🧠 Mental Health APIs
- **Mood Tracking** - Create, read, and analyze mood entries
- **Journal System** - Full CRUD operations for private journaling
- **Quiz Results** - Save and retrieve mental health assessment results
- **Statistics Dashboard** - User progress and trend analytics

### 🛡️ Security Features
- **CORS Protection** with configurable origins
- **Rate Limiting** to prevent API abuse
- **Helmet.js** for security headers
- **Input Validation** using express-validator
- **Password Encryption** with bcrypt
- **JWT Authentication** middleware

### 📊 Database Schema
- **Users Collection** - User accounts and profiles
- **Mood Entries** - Daily mood tracking data
- **Journal Entries** - Private journal posts
- **Quiz Results** - Mental health assessment data

## 🛠️ Tech Stack

- **Runtime**: Node.js v14+
- **Framework**: Express.js v5.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator
- **Development**: Nodemon for auto-restart
- **Environment**: dotenv for configuration

## 📁 Project Structure

```
mentra-server/
├── index.js              # Main server file with all APIs
├── package.json           # Dependencies and scripts
├── .env                  # Environment variables
├── .gitignore            # Git ignore file
└── README.md             # Project documentation
```

## 🔧 Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file with the following variables:
```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://mentraadmin:7TWcOoL6vRQTAStc@cluster0.crlsfbw.mongodb.net/mentra-db?retryWrites=true&w=majority
DB_NAME=mentra-db

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=mentra_super_secret_jwt_key_2025_mental_health_platform_secure
JWT_EXPIRES_IN=7d

# Security
BCRYPT_SALT_ROUNDS=12

# Client Configuration
CLIENT_URL=http://localhost:5174

# API Configuration
API_VERSION=v1
```

### 3. Start Development Server
```bash
npm run dev
```

The server will start at `http://localhost:5000`

### 4. Start Production Server
```bash
npm start
```

## 📋 API Endpoints

### 🔐 Authentication Routes

#### Health Check
- **GET** `/api/health` - Server health status

#### User Registration
- **POST** `/api/auth/register`
- **Body**: `{ name, email, password }`
- **Response**: User data + JWT token

#### User Login
- **POST** `/api/auth/login`
- **Body**: `{ email, password }`
- **Response**: User data + JWT token

#### Get User Profile
- **GET** `/api/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User profile data

### 🎭 Mood Tracking Routes

#### Create Mood Entry
- **POST** `/api/mood`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ mood, energy, stress, notes }`

#### Get Mood Entries
- **GET** `/api/mood?page=1&limit=30&startDate=&endDate=`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Paginated mood entries

### 📖 Journal Routes

#### Create Journal Entry
- **POST** `/api/journal`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ title, content, mood, tags, isPrivate }`

#### Get Journal Entries
- **GET** `/api/journal?page=1&limit=10&search=`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Paginated journal entries

#### Update Journal Entry
- **PUT** `/api/journal/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ title, content, mood, tags }`

#### Delete Journal Entry
- **DELETE** `/api/journal/:id`
- **Headers**: `Authorization: Bearer <token>`

### 🧩 Quiz Routes

#### Save Quiz Result
- **POST** `/api/quiz/result`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ quizType, answers, totalScore, maxScore, category, recommendations }`

#### Get Quiz Results
- **GET** `/api/quiz/results?quizType=&page=1&limit=10`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Paginated quiz results

### 📊 Statistics Route

#### Get User Statistics
- **GET** `/api/stats`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User progress analytics

## 🔒 Security Measures

### Input Validation
All endpoints use express-validator for:
- Email format validation
- Password strength requirements
- Required field checking
- Data type validation
- String length limits

### Rate Limiting
- **100 requests per 15 minutes** per IP address
- Applied to all `/api/` routes
- Prevents API abuse and DoS attacks

### Password Security
- **Minimum 6 characters** required
- **Must contain**: uppercase, lowercase, and number
- **Bcrypt hashing** with 12 salt rounds
- **No plain text storage**

### JWT Security
- **7-day expiration** by default
- **Secure secret key** from environment
- **Payload includes**: userId, email, name
- **Middleware protection** for sensitive routes

## 🗄️ Database Collections

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  loginMethod: String,
  isEmailVerified: Boolean,
  lastLogin: Date,
  accountStatus: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Mood Entries Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  mood: String,
  energy: Number (1-5),
  stress: Number (1-5),
  notes: String,
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Journal Entries Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  content: String,
  mood: String,
  tags: [String],
  isPrivate: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Quiz Results Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  quizType: String,
  answers: [{ questionId, answer, score }],
  totalScore: Number,
  maxScore: Number,
  category: String,
  recommendations: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## ⚡ Performance Features

- **Connection Pooling** with Mongoose
- **Gzip Compression** for responses
- **Request Logging** in development mode
- **Graceful Shutdown** handling
- **Memory Efficient** JSON parsing

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=https://your-frontend-domain.com
```

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing the API

### Using curl
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"Password123"}'

# Login user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Password123"}'
```

### Using Postman
1. Import the collection with base URL: `http://localhost:5000/api`
2. Set up environment variables for tokens
3. Test all endpoints with proper authentication headers

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server (with nodemon)
npm run dev

# Start production server
npm start

# Check for vulnerabilities
npm audit

# Update dependencies
npm update
```

## 📝 Error Handling

The server implements comprehensive error handling:
- **Validation Errors**: 400 Bad Request
- **Authentication Errors**: 401 Unauthorized
- **Authorization Errors**: 403 Forbidden
- **Not Found Errors**: 404 Not Found
- **Server Errors**: 500 Internal Server Error

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.

---

**Mentra Backend Server** - Supporting mental wellness through technology 🧠💙
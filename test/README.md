# Authentication API

A secure Express.js API with authentication endpoints and comprehensive validation.

## Features

- User registration with email and password validation
- Login with rate limiting
- Protected routes with JWT authentication
- Password reset functionality
- Logout mechanism
- Comprehensive test suite

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   JWT_SECRET=your-secret-key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!@#"
}
```

**Password Requirements:**

- Minimum 8 characters
- At least one letter
- At least one number
- At least one special character

**Response:**

```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!@#"
}
```

**Rate Limiting:**

- Maximum 3 attempts per hour per email

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

#### Protected Route

```http
GET /api/auth/protected
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "success": true,
  "message": "This is a protected route",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

#### Logout

```http
POST /api/auth/logout
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Forgot Password

```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password reset token generated",
  "resetToken": "reset-token"
}
```

#### Reset Password

```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token",
  "newPassword": "NewPassword123!@#"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password reset successful"
}
```

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "success": false,
  "message": "Error message"
}
```

Common HTTP Status Codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 429: Too Many Requests

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Security Features

1. Password hashing using bcrypt
2. JWT-based authentication
3. Rate limiting for login attempts
4. Input validation for email and password
5. Secure password reset flow
6. CORS enabled
7. Environment variable configuration

## Production Considerations

1. Use a proper database instead of in-memory storage
2. Implement proper email service for password reset
3. Use HTTPS in production
4. Set up proper logging
5. Implement request validation middleware
6. Add API documentation using Swagger/OpenAPI
7. Set up proper error handling middleware

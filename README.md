# Authentication System with Node.js and TypeScript

This is a simple authentication system built with Node.js, Express, and TypeScript. It includes JWT-based authentication, user registration, login, and protected routes.

## Features

- User registration and login
- JWT-based authentication
- Protected routes
- TypeScript support
- Vitest for testing

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   JWT_SECRET=your-super-secret-key-change-this-in-production
   ```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the TypeScript code
- `npm start` - Start the production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## API Endpoints

### Register

- **POST** `/api/register`
- Body: `{ "username": "string", "password": "string" }`
- Returns: JWT token

### Login

- **POST** `/api/login`
- Body: `{ "username": "string", "password": "string" }`
- Returns: JWT token

### Protected Route

- **GET** `/api/protected`
- Headers: `Authorization: Bearer <token>`
- Returns: Protected data

## Testing

The project uses Vitest for testing. Run the tests using:

```bash
npm test
```

## Security Notes

- In a production environment, make sure to:
  - Use a strong JWT secret
  - Implement proper password validation
  - Use HTTPS
  - Add rate limiting
  - Implement proper error handling
  - Use a real database instead of in-memory storage

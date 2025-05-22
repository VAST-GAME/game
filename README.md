# 🚀 V.A.S.T. Event Coding Hackathon 👨🏻‍💻

![V.A.S.T. Hackathon](/assets/banner.jpg)

## 📑 Table of Contents

- [Overview](#-overview)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Grading Criteria](#-grading-criteria)
- [Getting Started](#-getting-started)
- [Contact & Support](#-contact--support)
- [Contributors](#-contributors)

## 🌟 Overview

Welcome to the V.A.S.T. Coding Hackathon hosted by the **Academic Association of Mathematics & Computer Science of University of Isfahan (A.M.C.S.U.I.)** ! 🎓

In this exciting challenge, teams of up to 4 participants will design, develop, and deploy a robust API using any programming language or framework of their choice. 💻

### 🎯 Project Goals

- Create a secure 🔒 and efficient ⚡ API
- Implement proper authentication
- Handle rate limiting and security measures
- Dockerize the application 🐳
- Pass all provided test cases 🧪

### 🏆 Evaluation Criteria

Your API's logic and performance will be evaluated based on:

- Test case pass rate
- Code quality and organization
- Security implementation
- Error handling
- Documentation quality

<div align="right"><a href="#-table-of-contents">Back to top</a></div>

## 📁 Project Structure

```
vast-game/
├── src/           # Source code
├── test/          # Test cases
├── runner.sh      # Test runner script
└── setup.sh       # Setup script
```

<div align="right"><a href="#-table-of-contents">Back to top</a></div>

## 🌐 API Endpoints

| Endpoint           | Method | Description           | Auth Required | Rate Limit |
| ------------------ | ------ | --------------------- | ------------- | ---------- |
| `/login`           | POST   | User authentication   | ❌            | 4/min      |
| `/register`        | POST   | New user registration | ❌            | 4/min      |
| `/logout`          | POST   | User logout           | ✅            | 4/min      |
| `/protected`       | GET    | Protected resource    | ✅            | 4/min      |
| `/forget-password` | POST   | Password recovery     | ❌            | 4/min      |
| `/profile`         | GET    | User profile          | ✅            | 4/min      |

<div align="right"><a href="#-table-of-contents">Back to top</a></div>

## 📚 API Documentation

### Authentication Flow

1. Register a new user
2. Login to get JWT token
3. Use token for protected routes
4. Logout to invalidate token

<div align="right"><a href="#-table-of-contents">Back to top</a></div>

### Login User 🧩

```http
POST /login
```

**Headers**

```http
Content-Type: application/json
```

**Body**

```json
{
  "email": "user@example.com",
  "password": "StrongPass123!"
}
```

**Parameters**

| Name     | Type   | In   | Description          |
| -------- | ------ | ---- | -------------------- |
| email    | string | body | User's email address |
| password | string | body | User's password      |

**Responses**

| Code | Description       | Response Body Example                                                                 |
| ---- | ----------------- | ------------------------------------------------------------------------------------- |
| 200  | Success           | `{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", "message": "Login successful"}` |
| 400  | Bad Request       | `{"error": "Invalid email format"}`                                                   |
| 401  | Unauthorized      | `{"error": "Invalid credentials"}`                                                    |
| 429  | Too Many Requests | `{"error": "Rate limit exceeded"}`                                                    |

**Test Requirements:**

- Email validation (must be valid email format)
- Password validation (min 8 characters, special chars, numbers, uppercase)
- Email existence check
- Password correctness verification
- Rate limit: 4 requests per minute

<div align="right"><a href="#-table-of-contents">Back to top</a></div>

---

### Register User 🧩

```http
POST /register
```

**Headers**

```http
Content-Type: application/json
```

**Body**

```json
{
  "email": "user@example.com",
  "password": "StrongPass123!"
}
```

**Parameters**

| Name     | Type   | In   | Description          |
| -------- | ------ | ---- | -------------------- |
| email    | string | body | User's email address |
| password | string | body | User's password      |

**Responses**

| Code | Description | Response Body Example                                                                        |
| ---- | ----------- | -------------------------------------------------------------------------------------------- |
| 201  | Created     | `{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", "message": "Registration successful"}` |
| 400  | Bad Request | `{"error": "Invalid email format"}`                                                          |
| 409  | Conflict    | `{"error": "Email already exists"}`                                                          |

**Test Requirements:**

- Email validation (must be valid email format)
- Password validation (min 8 characters, special chars, numbers, uppercase)
- Email uniqueness check
- Rate limit: 4 requests per minute

<div align="right"><a href="#-table-of-contents">Back to top</a></div>

## Protected Routes 🔑

### Logout User 🧩

```http
POST /logout
```

**Headers**

```http
Authorization: Bearer <token>
```

**Responses**

| Code | Description  | Response Body Example                    |
| ---- | ------------ | ---------------------------------------- |
| 200  | Success      | `{"message": "Logged out successfully"}` |
| 401  | Unauthorized | `{"error": "Invalid token"}`             |

**Test Requirements:**

- Token validation
- Token invalidation after logout
- Rate limit: 4 requests per minute

<div align="right"><a href="#-table-of-contents">Back to top</a></div>

---

### Get Protected Resource 🧩

```http
GET /protected
```

**Headers**

```http
Authorization: Bearer <token>
```

**Responses**

| Code | Description  | Response Body Example                                  |
| ---- | ------------ | ------------------------------------------------------ |
| 200  | Success      | `{"message": "This is a protected route", "data": {}}` |
| 401  | Unauthorized | `{"error": "Invalid token"}`                           |

**Test Requirements:**

- Token validation
- Token expiration handling
- Rate limit: 4 requests per minute

<div align="right"><a href="#-table-of-contents">Back to top</a></div>

---

### Get User Profile 🧩

```http
GET /profile
```

**Headers**

```http
Authorization: Bearer <token>
```

**Responses**

| Code | Description  | Response Body Example                          |
| ---- | ------------ | ---------------------------------------------- |
| 200  | Success      | `{"email": "user@example.com", "profile": {}}` |
| 401  | Unauthorized | `{"error": "Invalid token"}`                   |

**Test Requirements:**

- Token validation
- User data retrieval
- Rate limit: 4 requests per minute

<div align="right"><a href="#-table-of-contents">Back to top</a></div>

---

### Forget Password Reset 🧩

```http
POST /forget-password
```

**Headers**

```http
Content-Type: application/json
```

**Body**

```json
{
  "email": "user@example.com"
}
```

**Parameters**

| Name  | Type   | In   | Description          |
| ----- | ------ | ---- | -------------------- |
| email | string | body | User's email address |

**Responses**

| Code | Description       | Response Body Example                      |
| ---- | ----------------- | ------------------------------------------ |
| 200  | Success           | `{"message": "Password reset email sent"}` |
| 400  | Bad Request       | `{"error": "Invalid email format"}`        |
| 429  | Too Many Requests | `{"error": "Rate limit exceeded"}`         |

**Test Requirements:**

- Email validation (must be valid email format)
- Email existence check
- Rate limit: 4 requests per minute
- Should not reveal if email exists in the system
- Should send password reset email if email exists

<div align="right"><a href="#-table-of-contents">Back to top</a></div>

## 🧪 Testing

### Getting Started with Tests

1. Download [NodeJs](https://nodejs.org/en/download)
2. Clone the repository
   ```bash
   cd test
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the tests:
   ```bash
   npm test
   ```

### Test Categories

1. **Authentication Tests (100 points)**

   - Registration Tests (25 points)
   - Login Tests (25 points)
   - Protected Route Tests (15 points)
   - Logout Tests (15 points)
   - Password Reset Tests (20 points)

2. **Security Tests**
   - Rate limiting
   - Token validation
   - Password strength
   - Input validation

### Mock Data

```json
{
  "test_user": {
    "email": "test@example.com",
    "password": "Test123!@#"
  },
  "test_tokens": {
    "valid": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expired": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "invalid": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

<div align="right"><a href="#-table-of-contents">Back to top</a></div>

## 📋 Grading Criteria

### Points Distribution

- **Authentication (100 points)**
  - Registration: 25 points
  - Login: 25 points
  - Protected Routes: 15 points
  - Logout: 15 points
  - Password Reset: 20 points

### Evaluation Factors

- Test case pass rate
- Code quality and organization
- Security implementation
- Error handling
- Documentation quality
- API design and structure

<div align="right"><a href="#-table-of-contents">Back to top</a></div>

## 🚀 Getting Started

### 1. **Setup Environment** 🛠️

First, ensure you have the necessary tools installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Docker](https://www.docker.com/get-started) (for containerization)
- [Git](https://git-scm.com/) (for version control)
- A code editor (we recommend [VS Code](https://code.visualstudio.com/))

Then run the setup script:

```bash
./setup.sh
```

### 2. **Run Tests** 🧪

To verify your environment is working correctly:

```bash
./runner.sh
```

### 3. **Development Guide** 💻

#### Choose Your Stack

Select your preferred programming language and framework. Here are some recommended options:

- **Node.js/Express**: [Express.js Documentation](https://expressjs.com/)
- **Python/FastAPI**: [FastAPI Documentation](https://fastapi.tiangolo.com/)
- **Go/Gin**: [Gin Web Framework](https://gin-gonic.com/)
- **Java/Spring**: [Spring Boot](https://spring.io/projects/spring-boot)

2. **API Implementation**

   - Implement all required endpoints as specified in the [API Documentation](#-api-documentation)
   - Follow RESTful API best practices
   - Use proper HTTP status codes
   - Implement comprehensive error handling

3. **Security Measures** 🔒

   - Implement JWT authentication
   - Add rate limiting (4 requests/minute)
   - Use secure password hashing (e.g., bcrypt)
   - Implement input validation
   - Add CORS protection
   - Use environment variables for sensitive data

4. **Testing Your Implementation**
   - Write unit tests for your endpoints
   - Test edge cases and error scenarios
   - Verify rate limiting functionality
   - Test authentication flow
   - Run the provided test suite

### 4. **Deployment Guide** 🐳

#### Docker Setup

1. **Create Dockerfile**
   Create a `Dockerfile` in your `src` directory:

   ```dockerfile
   # Example for Node.js application
   FROM node:18-alpine

   WORKDIR /app

   COPY package*.json ./
   RUN npm install

   COPY . .

   EXPOSE 8000

   CMD ["npm", "start"]
   ```

2. **Docker Requirements**

   - Your service must be self-contained (no external dependencies)
   - No database or external service dependencies
   - Must run on port 8000 inside the container
   - Environment variables should be handled within the container
   - Use multi-stage builds for smaller image size

3. **Building and Running**

   ```bash
   # Build the Docker image
   docker build -t vast-api src/

   # Run the container
   docker run -p 8000:8000 vast-api
   ```

4. **Best Practices**
   - Use `.dockerignore` to exclude unnecessary files
   - Implement health checks
   - Use non-root user in container
   - Optimize layer caching
   - Keep images small and secure

#### Deployment Checklist ✅

- [ ] All endpoints implemented and tested
- [ ] Rate limiting configured (4 requests/minute)
- [ ] Authentication working correctly
- [ ] Error handling implemented
- [ ] Dockerfile created and tested
- [ ] Container runs without external dependencies
- [ ] Service accessible on port 8000
- [ ] All tests passing

#### Resources 📚

- [Docker Documentation](https://docs.docker.com/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [JWT Authentication Guide](https://jwt.io/introduction)
- [Rate Limiting Patterns](https://redis.com/redis-best-practices/basic-rate-limiting/)
- [API Security Best Practices](https://owasp.org/www-project-api-security/)

<div align="right"><a href="#-table-of-contents">Back to top</a></div>

## 🎗️ Contact & Support

### Technical Support

- 📧 Email: [amcsui.ir@gmail.com](mailto:amcsui.ir@gmail.com)
- 💬 Support: [@AMCSSup](https://telegram.me/AMCSSup)
- 💬 Event Group: [@VAST_event](https://t.me/VAST_event)
- 💬 Telegram: [@AMCSUI](https://telegram.me/AMCSUI)
- 📚 Wiki: [wiki.amcsui.ir](https://wiki.amcsui.ir)

<div align="right"><a href="#-table-of-contents">Back to top</a></div>

## 👥 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/mohammad-mghn">
        <img src="https://github.com/mohammad-mghn.png" width="80px;" alt="Mohammad Mohagheghian" style="border-radius: 50%;"/> 
      </a>
    </td>
     <td align="center">
      <a href="https://github.com/AminMasoudi">
        <img src="https://github.com/aminmasoudi.png" width="80px;" alt="Amin Masoudi" style="border-radius: 50%;"/>
      </a>
    </td>
  </tr>
</table>

<div align="right"><a href="#-table-of-contents">Back to top</a></div>

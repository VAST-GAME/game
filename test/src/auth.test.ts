import { describe, it, expect, beforeAll, afterAll } from "vitest";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api";

describe("Authentication API", () => {
  2;
  let authToken: string;
  const testUser = {
    email: "test@example.com",
    password: "Test123!@#",
  };

  describe("POST /auth/register", () => {
    it("should register a new user", async () => {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        testUser
      );

      expect(res.status).toBe(201);
      expect(res.data.success).toBe(true);
      expect(res.data.user.email).toBe(testUser.email);
    });

    it("should not register with invalid email", async () => {
      try {
        await axios.post(`${API_BASE_URL}/api/auth/register`, {
          email: "invalid-email",
          password: testUser.password,
        });
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.success).toBe(false);
      }
    });

    it("should not register with weak password", async () => {
      try {
        await axios.post(`${API_BASE_URL}/api/auth/register`, {
          email: "test2@example.com",
          password: "weak",
        });
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.success).toBe(false);
      }
    });

    it("should not register with existing email", async () => {
      try {
        await axios.post(`${API_BASE_URL}/api/auth/register`, testUser);
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.success).toBe(false);
      }
    });
  });

  describe("POST /auth/login", () => {
    it("should login with valid credentials", async () => {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, testUser);

      expect(res.status).toBe(200);
      expect(res.data.success).toBe(true);
      expect(res.data.token).toBeDefined();
      authToken = res.data.token;
    });

    it("should not login with invalid email", async () => {
      try {
        await axios.post(`${API_BASE_URL}/api/auth/login`, {
          email: "wrong@example.com",
          password: testUser.password,
        });
      } catch (error: any) {
        expect(error.response.status).toBe(401);
        expect(error.response.data.success).toBe(false);
      }
    });

    it("should not login with invalid password", async () => {
      try {
        await axios.post(`${API_BASE_URL}/api/auth/login`, {
          email: testUser.email,
          password: "wrongpassword",
        });
      } catch (error: any) {
        expect(error.response.status).toBe(401);
        expect(error.response.data.success).toBe(false);
      }
    });

    it("should respect rate limiting", async () => {
      // Try to login 4 times
      for (let i = 0; i < 4; i++) {
        try {
          await axios.post(`${API_BASE_URL}/api/auth/login`, {
            email: testUser.email,
            password: "wrongpassword",
          });
        } catch (error) {
          // Ignore errors from failed attempts
        }
      }

      try {
        await axios.post(`${API_BASE_URL}/api/auth/login`, {
          email: testUser.email,
          password: "wrongpassword",
        });
      } catch (error: any) {
        expect(error.response.status).toBe(429);
        expect(error.response.data.success).toBe(false);
      }
    });
  });

  describe("GET /auth/protected", () => {
    it("should access protected route with valid token", async () => {
      const res = await axios.get(`${API_BASE_URL}/api/auth/protected`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(res.status).toBe(200);
      expect(res.data.success).toBe(true);
      expect(res.data.user).toBeDefined();
    });

    it("should not access protected route without token", async () => {
      try {
        await axios.get(`${API_BASE_URL}/api/auth/protected`);
      } catch (error: any) {
        expect(error.response.status).toBe(401);
        expect(error.response.data.success).toBe(false);
      }
    });
  });

  describe("POST /auth/logout", () => {
    it("should logout successfully", async () => {
      const res = await axios.post(`${API_BASE_URL}/api/auth/logout`, {
        email: testUser.email,
      });

      expect(res.status).toBe(200);
      expect(res.data.success).toBe(true);
    });

    it("should not logout with non-existent email", async () => {
      try {
        await axios.post(`${API_BASE_URL}/api/auth/logout`, {
          email: "nonexistent@example.com",
        });
      } catch (error: any) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.success).toBe(false);
      }
    });
  });

  describe("POST /auth/forgot-password", () => {
    it("should generate reset token for valid email", async () => {
      const res = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, {
        email: testUser.email,
      });

      expect(res.status).toBe(200);
      expect(res.data.success).toBe(true);
      expect(res.data.resetToken).toBeDefined();
    });

    it("should generate reset token for invalid email", async () => {
      const res = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, {
        email: "nonexistent@example.com",
      });

      expect(res.status).toBe(200);
      expect(res.data.success).toBe(true);
      expect(res.data.resetToken).toBeDefined();
    });

    it("should handle malformed email input", async () => {
      try {
        await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, {
          email: "bademail",
        });
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.success).toBe(false);
      }

      try {
        await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, {
          email: "bademail@badending",
        });
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.success).toBe(false);
      }

      try {
        await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, {
          email: "bademail@.baddoamin",
        });
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.success).toBe(false);
      }
    });

    it("should return JSON with error message on failure", async () => {
      try {
        await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, {
          email: "unknown@example.com",
        });
      } catch (error: any) {
        expect(error.response.status).toBe(404);
        expect(error.response.data).toHaveProperty("message");
        expect(error.response.data.success).toBe(false);
      }
    });

    it("should not allow reset if rate limit exceeded", async () => {
      for (let i = 0; i < 5; i++) {
        try {
          await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, {
            email: testUser.email,
          });
        } catch (error) {
          // Ignore errors from failed attempts
        }
      }

      try {
        await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, {
          email: testUser.email,
        });
      } catch (error: any) {
        expect(error.response.status).toBe(429);
        expect(error.response.data.success).toBe(false);
      }
    });
  });
});

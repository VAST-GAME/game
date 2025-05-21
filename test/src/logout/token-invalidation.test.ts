import { describe, it, expect } from "vitest";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = "http://localhost:8000";

describe("Logout API - Token Invalidation", () => {
  let authToken: string;

  beforeAll(async () => {
    // Login to get a valid token
    const loginRes = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: "test@example.com",
      password: "Test123!@#",
    });
    authToken = loginRes.data.token;
  });

  it("should invalidate token after logout", async () => {
    // First logout
    await axios.post(
      `${API_BASE_URL}/api/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    // Try to use the same token again
    try {
      await axios.get(`${API_BASE_URL}/api/auth/protected`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.response.status).toBe(401);
      expect(error.response.data.success).toBe(false);
      expect(error.response.data.message).toBe("Token has been invalidated");
    }
  });
});

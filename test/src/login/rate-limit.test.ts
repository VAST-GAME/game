import { describe, it, expect } from "vitest";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = "http://localhost:8000";

describe("Login API - Rate Limiting", () => {
  it("should enforce rate limit", async () => {
    const requests = Array(5)
      .fill(null)
      .map(() =>
        axios.post(`${API_BASE_URL}/api/auth/login`, {
          email: "test@example.com",
          password: "Test123!@#",
        })
      );

    try {
      await Promise.all(requests);
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.response.status).toBe(429);
      expect(error.response.data.success).toBe(false);
      expect(error.response.data.message).toBe("Rate limit exceeded");
    }
  });
});

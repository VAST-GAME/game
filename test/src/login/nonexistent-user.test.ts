import { describe, it, expect } from "vitest";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = "http://localhost:8000";

describe("Login API - Nonexistent User", () => {
  const testUser = {
    email: "nonexistent@example.com",
    password: "Test123!@#",
  };

  it("should fail with nonexistent user", async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/login`, testUser);
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.response.status).toBe(401);
      expect(error.response.data.success).toBe(false);
      expect(error.response.data.message).toBe("Invalid credentials");
    }
  });
});

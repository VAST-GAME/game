import { describe, it, expect } from "vitest";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = "http://localhost:8000";

describe("Registration API - Invalid Email", () => {
  const testUser = {
    email: "test@example.com",
    password: "Test123!@#",
  };

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
});

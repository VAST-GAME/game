import { describe, it, expect } from "vitest";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = "http://localhost:8000";

describe("Login API - Input Validation", () => {
  it("should fail with missing email", async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/login`, {
        password: "Test123!@#",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.success).toBe(false);
      expect(error.response.data.message).toBe("Email is required");
    }
  });

  it("should fail with missing password", async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: "test@example.com",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.success).toBe(false);
      expect(error.response.data.message).toBe("Password is required");
    }
  });

  it("should fail with invalid email format", async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: "invalid-email",
        password: "Test123!@#",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.success).toBe(false);
      expect(error.response.data.message).toBe("Invalid email format");
    }
  });
});

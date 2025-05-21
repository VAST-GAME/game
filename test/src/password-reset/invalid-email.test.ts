import { describe, it, expect } from "vitest";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = "http://localhost:8000";

describe("Password Reset API - Invalid Email", () => {
  it("should handle invalid email format", async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/forget-password`, {
        email: "invalid-email",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.success).toBe(false);
      expect(error.response.data.message).toBe("Invalid email format");
    }
  });
});

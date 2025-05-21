import { describe, it, expect } from "vitest";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = "http://localhost:8000";

describe("Password Reset API - Security Measures", () => {
  it("should not reveal email existence", async () => {
    const res = await axios.post(`${API_BASE_URL}/api/auth/forget-password`, {
      email: "nonexistent@example.com",
    });

    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.message).toBe(
      "If an account exists, a password reset token has been sent"
    );
  });

  it("should handle malformed inputs", async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/forget-password`, {
        email: "",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.success).toBe(false);
      expect(error.response.data.message).toBe("Email is required");
    }
  });
});

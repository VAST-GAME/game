import { describe, it, expect } from "vitest";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = "http://localhost:8000";

describe("Registration API - Input Validation", () => {
  it("should validate input format", async () => {
    const testCases = [
      { email: "test@", password: "Test123!@#" },
      { email: "test@example", password: "Test123!@#" },
      { email: "test@.com", password: "Test123!@#" },
      { email: "test@example.com", password: "weak" },
      { email: "test@example.com", password: "no-upper-123" },
      { email: "test@example.com", password: "NO-LOWER-123" },
      { email: "test@example.com", password: "NoSpecial123" },
    ];

    for (const testCase of testCases) {
      try {
        await axios.post(`${API_BASE_URL}/api/auth/register`, testCase);
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.success).toBe(false);
      }
    }
  });
});

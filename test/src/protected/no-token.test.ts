import { describe, it, expect } from "vitest";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = "http://localhost:8000";

describe("Protected Route API - No Token", () => {
  it("should reject access without token", async () => {
    try {
      await axios.get(`${API_BASE_URL}/api/auth/protected`);
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.response.status).toBe(401);
      expect(error.response.data.success).toBe(false);
      expect(error.response.data.message).toBe("No token provided");
    }
  });
});

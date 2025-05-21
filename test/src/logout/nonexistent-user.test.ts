import { describe, it, expect } from "vitest";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = "http://localhost:8000";

describe("Logout API - Nonexistent User", () => {
  it("should handle logout for nonexistent user", async () => {
    const invalidToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJub25leGlzdGVudCIsImlhdCI6MTUxNjIzOTAyMn0.invalid_signature";

    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${invalidToken}`,
          },
        }
      );
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.response.status).toBe(404);
      expect(error.response.data.success).toBe(false);
      expect(error.response.data.message).toBe("User not found");
    }
  });
});

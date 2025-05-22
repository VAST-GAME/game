import { describe, it, expect } from "vitest";
import { apiRequest, ApiError } from "../utils/api-utils";

describe("Logout API - Nonexistent User", () => {
  it("should handle logout for nonexistent user", async () => {
    const invalidToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJub25leGlzdGVudCIsImlhdCI6MTUxNjIzOTAyMn0.invalid_signature";

    try {
      await apiRequest({
        method: "post",
        url: "/api/auth/logout",
        headers: {
          Authorization: `Bearer ${invalidToken}`,
        },
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toContain("404");
      expect(error.message).toContain("User not found");
    }
  });
});

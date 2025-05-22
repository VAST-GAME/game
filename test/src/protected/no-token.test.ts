import { describe, it, expect } from "vitest";
import { apiRequest, ApiError } from "../utils/api-utils";

describe("Protected Route API - No Token", () => {
  it("should reject access without token", async () => {
    try {
      await apiRequest({
        method: "get",
        url: "/api/auth/protected",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toContain("401");
      expect(error.message).toContain("No token provided");
    }
  });
});

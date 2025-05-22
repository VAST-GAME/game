import { describe, it, expect } from "vitest";
import { apiRequest, ApiError } from "../utils/api-utils";

describe("Login API - Rate Limiting", () => {
  it("should enforce rate limit", async () => {
    const requests = Array(5)
      .fill(null)
      .map(() =>
        apiRequest({
          method: "post",
          url: "/api/auth/login",
          data: {
            email: "test@example.com",
            password: "Test123!@#",
          },
        })
      );

    try {
      await Promise.all(requests);
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toContain("429");
      expect(error.message).toContain("Rate limit exceeded");
    }
  });
});

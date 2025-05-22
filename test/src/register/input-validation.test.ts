import { describe, it, expect } from "vitest";
import { apiRequest, ApiError } from "../utils/api-utils";

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
        await apiRequest({
          method: "post",
          url: "/api/auth/register",
          data: testCase,
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.message).toContain("400");
      }
    }
  });
});

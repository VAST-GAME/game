import { describe, it, expect } from "vitest";
import { apiRequest, ApiError } from "../utils/api-utils";

describe("Registration API - Duplicate Email", () => {
  const testUser = {
    email: "test@example.com",
    password: "Test123!@#",
  };

  it("should not register with existing email", async () => {
    try {
      await apiRequest({
        method: "post",
        url: "/api/auth/register",
        data: testUser,
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toContain("400");
      expect(error.message).toContain("Email already exists");
    }
  });
});

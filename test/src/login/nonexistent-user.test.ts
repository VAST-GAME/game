import { describe, it, expect } from "vitest";
import { apiRequest, ApiError } from "../utils/api-utils";

describe("Login API - Nonexistent User", () => {
  const testUser = {
    email: "nonexistent@example.com",
    password: "Test123!@#",
  };

  it("should fail with nonexistent user", async () => {
    try {
      await apiRequest({
        method: "post",
        url: "/api/auth/login",
        data: testUser,
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toContain("401");
      expect(error.message).toContain("Invalid credentials");
    }
  });
});

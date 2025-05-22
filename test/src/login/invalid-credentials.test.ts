import { describe, it, expect } from "vitest";
import { apiRequest, ApiError } from "../utils/api-utils";

describe("Login API - Invalid Credentials", () => {
  const testUser = {
    email: "test@example.com",
    password: "wrongpassword",
  };

  it("should fail with invalid credentials", async () => {
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

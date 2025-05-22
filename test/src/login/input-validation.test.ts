import { describe, it, expect } from "vitest";
import { apiRequest, ApiError } from "../utils/api-utils";

describe("Login API - Input Validation", () => {
  it("should fail with missing email", async () => {
    try {
      await apiRequest({
        method: "post",
        url: "/api/auth/login",
        data: { password: "Test123!@#" },
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toContain("400");
      expect(error.message).toContain("Email is required");
    }
  });

  it("should fail with missing password", async () => {
    try {
      await apiRequest({
        method: "post",
        url: "/api/auth/login",
        data: { email: "test@example.com" },
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toContain("400");
      expect(error.message).toContain("Password is required");
    }
  });

  it("should fail with invalid email format", async () => {
    try {
      await apiRequest({
        method: "post",
        url: "/api/auth/login",
        data: { email: "invalid-email", password: "Test123!@#" },
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toContain("400");
      expect(error.message).toContain("Invalid email format");
    }
  });
});

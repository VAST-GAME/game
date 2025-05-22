import { describe, it, expect } from "vitest";
import { apiRequest, ApiError } from "../utils/api-utils";

describe("Registration API - Weak Password", () => {
  it("should not register with weak password", async () => {
    try {
      await apiRequest({
        method: "post",
        url: "/api/auth/register",
        data: {
          email: "test2@example.com",
          password: "weak",
        },
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toContain("400");
      expect(error.message).toContain("Password is too weak");
    }
  });
});

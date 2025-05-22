import { describe, it, expect } from "vitest";
import { apiRequest, ApiError } from "../utils/api-utils";

describe("Password Reset API - Invalid Email", () => {
  it("should handle invalid email format", async () => {
    try {
      await apiRequest({
        method: "post",
        url: "/api/auth/forget-password",
        data: { email: "invalid-email" },
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toContain("400");
      expect(error.message).toContain("Invalid email format");
    }
  });
});

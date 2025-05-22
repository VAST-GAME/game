import { describe, it, expect } from "vitest";
import { apiRequest, ApiError } from "../utils/api-utils";

describe("Password Reset API - Security Measures", () => {
  it("should not reveal email existence", async () => {
    const res = await apiRequest<{ success: boolean; message: string }>({
      method: "post",
      url: "/api/auth/forget-password",
      data: { email: "nonexistent@example.com" },
    });

    expect(res.success).toBe(true);
    expect(res.message).toBe(
      "If an account exists, a password reset token has been sent"
    );
  });

  it("should handle malformed inputs", async () => {
    try {
      await apiRequest({
        method: "post",
        url: "/api/auth/forget-password",
        data: { email: "" },
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toContain("400");
      expect(error.message).toContain("Email is required");
    }
  });
});

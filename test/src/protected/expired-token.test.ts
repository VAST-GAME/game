import { describe, it, expect } from "vitest";
import { apiRequest, ApiError } from "../utils/api-utils";

describe("Protected Route API - Expired Token", () => {
  it("should reject access with expired token", async () => {
    const expiredToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.4Adcj3UFYzPUVaVF43Fm5SW8J1Z0Gx4K9hx5mh3Y6c";

    try {
      await apiRequest({
        method: "get",
        url: "/api/auth/protected",
        headers: {
          Authorization: `Bearer ${expiredToken}`,
        },
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toContain("401");
      expect(error.message).toContain("Token expired");
    }
  });
});

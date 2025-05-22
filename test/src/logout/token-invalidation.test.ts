import { describe, it, expect, beforeAll } from "vitest";
import { apiRequest, ApiError, isServerAvailable } from "../utils/api-utils";
import { testUser } from "../utils/test-utils";

describe("Logout API - Token Invalidation", () => {
  let authToken: string;

  beforeAll(async () => {
    const isAvailable = await isServerAvailable();
    if (!isAvailable) {
      throw new Error(
        "API server is not available. Please make sure the server is running on port 8000."
      );
    }

    // Login to get a valid token
    const loginRes = await apiRequest<{ success: boolean; token: string }>({
      method: "post",
      url: "/api/auth/login",
      data: testUser,
    });

    authToken = loginRes.token;
  });

  it("should invalidate token after logout", async () => {
    // First logout
    await apiRequest({
      method: "post",
      url: "/api/auth/logout",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    // Try to use the invalidated token
    try {
      await apiRequest({
        method: "get",
        url: "/api/auth/protected",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.status).toBe(401);
      expect(error.message).toContain("Invalid token");
    }
  });
});

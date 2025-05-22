import { describe, it, expect, beforeAll } from "vitest";
import { apiRequest, isServerAvailable } from "../utils/api-utils";
import { testUser } from "../utils/test-utils";

describe("Logout API - Successful Logout", () => {
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

  it("should logout successfully", async () => {
    const res = await apiRequest<{ success: boolean; message: string }>({
      method: "post",
      url: "/api/auth/logout",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(res.success).toBe(true);
    expect(res.message).toBe("Logged out successfully");
  });
});

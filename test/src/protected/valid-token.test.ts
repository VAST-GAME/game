import { describe, it, expect, beforeAll } from "vitest";
import { apiRequest, waitForServer } from "../utils/api-utils";
import { testUser } from "../utils/test-utils";

describe("Protected Route API - Valid Token", () => {
  let authToken: string;

  beforeAll(async () => {
    const isAvailable = await waitForServer();
    if (!isAvailable) {
      throw new Error(
        "API server is not available after waiting. Please make sure the server is running on port 8000."
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

  it("should access protected route with valid token", async () => {
    const res = await apiRequest<{ success: boolean; message: string }>({
      method: "get",
      url: "/api/auth/protected",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(res.success).toBe(true);
    expect(res.message).toBe("Protected route accessed successfully");
  });
});

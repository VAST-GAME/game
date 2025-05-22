import { describe, it, expect, beforeAll } from "vitest";
import { apiRequest, ApiError, waitForServer } from "../utils/api-utils";

describe("Registration API - Invalid Email", () => {
  beforeAll(async () => {
    const isAvailable = await waitForServer();
    if (!isAvailable) {
      throw new Error(
        "API server is not available after waiting. Please make sure the server is running on port 8000."
      );
    }
  });

  it("should not register with invalid email", async () => {
    try {
      await apiRequest({
        method: "post",
        url: "/api/auth/register",
        data: {
          email: "invalid-email",
          password: "Test123!@#",
        },
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.status).toBe(400);
      expect(error.data?.success).toBe(false);
      expect(error.message).toContain("Invalid email format");
    }
  });
});

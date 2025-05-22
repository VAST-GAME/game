import { describe, it, expect, beforeAll } from "vitest";
import { apiRequest, waitForServer } from "../utils/api-utils";

describe("Password Reset API - Generate Token", () => {
  beforeAll(async () => {
    const isAvailable = await waitForServer();
    if (!isAvailable) {
      throw new Error(
        "API server is not available after waiting. Please make sure the server is running on port 8000."
      );
    }
  });

  it("should generate reset token for valid email", async () => {
    const res = await apiRequest<{ success: boolean; message: string }>({
      method: "post",
      url: "/api/auth/forget-password",
      data: { email: "test@example.com" },
    });

    expect(res.success).toBe(true);
    expect(res.message).toBe(
      "If an account exists, a password reset token has been sent"
    );
  });
});

import { describe, it, expect } from "vitest";
import { apiRequest } from "../utils/api-utils";
import { testUser } from "../utils/test-utils";

describe("Login API - Valid Login", () => {
  it("should login with valid credentials", async () => {
    const res = await apiRequest<{ success: boolean; token: string }>({
      method: "post",
      url: "/api/auth/login",
      data: testUser,
    });

    expect(res.success).toBe(true);
    expect(res.token).toBeDefined();
  });
});

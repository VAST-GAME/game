import { describe, it, expect } from "vitest";
import { apiRequest } from "../utils/api-utils";
import { testUser } from "../utils/test-utils";

describe("Registration API - Valid Registration", () => {
  it("should register a new user", async () => {
    const res = await apiRequest<{ success: boolean; message: string }>({
      method: "post",
      url: "/api/auth/register",
      data: testUser,
    });

    expect(res.success).toBe(true);
    expect(res.message).toBe("User registered successfully");
  });
});

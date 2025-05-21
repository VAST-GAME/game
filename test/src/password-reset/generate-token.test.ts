import { describe, it, expect } from "vitest";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = "http://localhost:8000";

describe("Password Reset API - Generate Token", () => {
  it("should generate reset token for valid email", async () => {
    const res = await axios.post(`${API_BASE_URL}/api/auth/forget-password`, {
      email: "test@example.com",
    });

    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.message).toBe("Password reset token sent");
    expect(res.data.resetToken).toBeDefined();
  });
});

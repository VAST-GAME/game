import { describe, it, expect } from "vitest";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = "http://localhost:8000";

describe("Login API - Valid Login", () => {
  const testUser = {
    email: "test@example.com",
    password: "Test123!@#",
  };

  it("should login with valid credentials", async () => {
    const res = await axios.post(`${API_BASE_URL}/api/auth/login`, testUser);

    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.token).toBeDefined();
  });
});

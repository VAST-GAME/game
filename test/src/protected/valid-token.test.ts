import { describe, it, expect } from "vitest";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = "http://localhost:8000";

describe("Protected Route API - Valid Token", () => {
  let authToken: string;

  beforeAll(async () => {
    // Login to get a valid token
    const loginRes = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: "test@example.com",
      password: "Test123!@#",
    });
    authToken = loginRes.data.token;
  });

  it("should access protected route with valid token", async () => {
    const res = await axios.get(`${API_BASE_URL}/api/auth/protected`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toBeDefined();
  });
});

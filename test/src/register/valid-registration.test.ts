import { describe, it, expect } from "vitest";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = "http://localhost:8000";

describe("Registration API - Valid Registration", () => {
  const testUser = {
    email: "test@example.com",
    password: "Test123!@#",
  };

  it("should register a new user", async () => {
    const res = await axios.post(`${API_BASE_URL}/api/auth/register`, testUser);

    expect(res.status).toBe(201);
    expect(res.data.success).toBe(true);
    expect(res.data.user.email).toBe(testUser.email);
  });
});

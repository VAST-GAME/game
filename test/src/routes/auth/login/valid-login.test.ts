import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  API_BASE_URL,
  testUser,
  setupTestUser,
  cleanupTestUser,
} from "../../../utils/test-utils";
import { TEST_RESPONSES, TEST_TIMEOUT } from "../../../config/test-config";
import axios from "axios";

describe("Login API - Valid Login", () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await setupTestUser();
  }, TEST_TIMEOUT);

  afterAll(async () => {
    await cleanupTestUser(authToken);
  });

  it("should login with valid credentials", async () => {
    const res = await axios.post(`${API_BASE_URL}/api/auth/login`, testUser);

    expect(res?.status).toBe(TEST_RESPONSES.SUCCESS.status);
    expect(res.data?.success).toBe(TEST_RESPONSES.SUCCESS.success);
    expect(res.data.token).toBeDefined();
  });
});

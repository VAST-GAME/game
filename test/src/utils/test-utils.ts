import { apiRequest } from "./api-utils";
import dotenv from "dotenv";

dotenv.config();

export const API_BASE_URL = "http://localhost:8000";

interface AuthResponse {
  success: boolean;
  token: string;
}

export const testUser = {
  email: "test@example.com",
  password: "Test123!@#",
};

export const getAuthToken = async () => {
  const loginRes = await apiRequest<AuthResponse>({
    method: "post",
    url: "/api/auth/login",
    data: testUser,
  });
  return loginRes.token;
};

export const createTestUser = async () => {
  try {
    await apiRequest({
      method: "post",
      url: "/api/auth/register",
      data: testUser,
    });
  } catch (error) {
    // User might already exist, which is fine
  }
};

export const deleteTestUser = async (token: string) => {
  try {
    await apiRequest({
      method: "delete",
      url: "/api/auth/profile",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    // Ignore errors during cleanup
  }
};

export const setupTestUser = async () => {
  await createTestUser();
  return await getAuthToken();
};

export const cleanupTestUser = async (token: string) => {
  await deleteTestUser(token);
};

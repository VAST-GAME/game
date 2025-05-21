import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const API_BASE_URL = "http://localhost:8000";

interface AuthResponse {
  token: string;
  success: boolean;
  message?: string;
}

export const testUser = {
  email: "test@example.com",
  password: "Test123!@#",
};

export const getAuthToken = async () => {
  const loginRes = await axios.post<AuthResponse>(
    `${API_BASE_URL}/api/auth/login`,
    testUser
  );
  return loginRes.data.token;
};

export const createTestUser = async () => {
  try {
    await axios.post(`${API_BASE_URL}/api/auth/register`, testUser);
  } catch (error) {
    // User might already exist, which is fine
  }
};

export const deleteTestUser = async (token: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/auth/profile`, {
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

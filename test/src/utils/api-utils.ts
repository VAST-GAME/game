import axios, { AxiosError } from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = "http://localhost:8000";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: any) {
    super(message);
    this.name = "ApiError";
  }
}

// Check if the API server is available with retries
export async function isServerAvailable(
  retries = MAX_RETRIES
): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      await axios.get(`${API_BASE_URL}/api/health`);
      return true;
    } catch (error) {
      if (i === retries - 1) {
        return false;
      }
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
  return false;
}

export function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    // Handle connection refused error
    if (axiosError.code === "ECONNREFUSED") {
      throw new ApiError(
        "API server is not available. Please make sure the server is running on port 8000.",
        503
      );
    }

    // Handle response errors
    if (axiosError.response) {
      throw new ApiError(
        axiosError.response.data?.message || "API request failed",
        axiosError.response.status,
        axiosError.response.data
      );
    }

    // Handle request errors
    if (axiosError.request) {
      throw new ApiError("No response received from server", 503);
    }
  }

  // Handle unknown errors
  throw new ApiError(
    error instanceof Error ? error.message : "An unknown error occurred",
    500
  );
}

export async function apiRequest<T = any>(config: {
  method: string;
  url: string;
  data?: any;
  headers?: Record<string, string>;
}): Promise<T> {
  // Check server availability first with retries
  const isAvailable = await isServerAvailable();
  if (!isAvailable) {
    throw new ApiError(
      "API server is not available. Please make sure the server is running on port 8000.",
      503
    );
  }

  try {
    const response = await axios({
      ...config,
      url: `${API_BASE_URL}${config.url}`,
      timeout: 5000, // 5 second timeout
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

// Helper function to wait for server to be available
export async function waitForServer(timeout = 30000): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (await isServerAvailable(1)) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return false;
}

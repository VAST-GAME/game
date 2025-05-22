import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "./test-utils";

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    // Handle connection refused error
    if (axiosError.code === "ECONNREFUSED") {
      throw new ApiError(
        "API server is not available. Please make sure the server is running on port 8000."
      );
    }

    // Handle other axios errors
    if (axiosError.response) {
      throw new ApiError(
        `API Error: ${axiosError.response.status} - ${
          axiosError.response.data?.message || "Unknown error"
        }`
      );
    }
  }

  // Handle unknown errors
  throw new ApiError(
    "An unexpected error occurred while making the API request."
  );
};

export const apiRequest = async <T>(config: {
  method: "get" | "post" | "put" | "delete";
  url: string;
  data?: any;
  headers?: Record<string, string>;
}): Promise<T> => {
  try {
    const response = await axios({
      method: config.method,
      url: `${API_BASE_URL}${config.url}`,
      data: config.data,
      headers: config.headers,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const TEST_TIMEOUT = 10000; // 10 seconds
export const RATE_LIMIT = 3; // requests per minute
export const RATE_LIMIT_WINDOW = 60000; // 1 minute in milliseconds

export const INVALID_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJub25leGlzdGVudCIsImlhdCI6MTUxNjIzOTAyMn0.invalid_signature";

export const EXPIRED_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.4Adcj3UFYzPUVaVF43Fm5SW8J1Z0Gx4K9hx5mh3Y6c";

export const TEST_RESPONSES = {
  SUCCESS: {
    status: 200,
    success: true,
  },
  CREATED: {
    status: 201,
    success: true,
  },
  BAD_REQUEST: {
    status: 400,
    success: false,
  },
  UNAUTHORIZED: {
    status: 401,
    success: false,
  },
  NOT_FOUND: {
    status: 404,
    success: false,
  },
  RATE_LIMIT: {
    status: 429,
    success: false,
  },
};

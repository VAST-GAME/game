import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

// Mock Express app for testing
const app = express();
app.use(express.json());

// Mock user database for testing
const users: { id: number; username: string; password: string }[] = [];

describe("Authentication System Tests", () => {
  let server: any;
  let testToken: string;

  beforeAll(() => {
    server = app.listen(3001);
  });

  afterAll(() => {
    server.close();
  });

  describe("User Registration", () => {
    it("should successfully register a new user", async () => {
      const response = await request(app).post("/api/register").send({
        username: "testuser",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("token");
      expect(typeof response.body.token).toBe("string");
    });

    it("should not register a user with missing username", async () => {
      const response = await request(app).post("/api/register").send({
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });

    it("should not register a user with missing password", async () => {
      const response = await request(app).post("/api/register").send({
        username: "testuser2",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });

    it("should not register a user with existing username", async () => {
      const response = await request(app).post("/api/register").send({
        username: "testuser",
        password: "password123",
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("User Login", () => {
    it("should successfully login with valid credentials", async () => {
      const response = await request(app).post("/api/login").send({
        username: "testuser",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      testToken = response.body.token;
    });

    it("should not login with invalid username", async () => {
      const response = await request(app).post("/api/login").send({
        username: "nonexistentuser",
        password: "password123",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
    });

    it("should not login with invalid password", async () => {
      const response = await request(app).post("/api/login").send({
        username: "testuser",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
    });

    it("should not login with missing credentials", async () => {
      const response = await request(app).post("/api/login").send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("Protected Routes", () => {
    it("should access protected route with valid token", async () => {
      const response = await request(app)
        .get("/api/protected")
        .set("Authorization", `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("user");
    });

    it("should not access protected route without token", async () => {
      const response = await request(app).get("/api/protected");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
    });

    it("should not access protected route with invalid token", async () => {
      const response = await request(app)
        .get("/api/protected")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("message");
    });

    it("should not access protected route with malformed token", async () => {
      const response = await request(app)
        .get("/api/protected")
        .set("Authorization", "Bearer");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("Token Validation", () => {
    it("should validate token format", () => {
      const token = testToken;
      expect(token).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
      );
    });

    it("should decode token and contain user information", () => {
      const decoded = jwt.decode(testToken);
      expect(decoded).toHaveProperty("id");
      expect(decoded).toHaveProperty("username");
    });
  });
});

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Authentication API", () => {
  let authToken: string;
  const testUser = {
    email: "test@example.com",
    password: "Test123!@#",
  };

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe(testUser.email);
    });

    it("should not register with invalid email", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "invalid-email",
        password: testUser.password,
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should not register with weak password", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "test2@example.com",
        password: "weak",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should not register with existing email", async () => {
      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send(testUser);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      authToken = res.body.token;
    });

    it("should not login with invalid email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "wrong@example.com",
        password: testUser.password,
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should not login with invalid password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should respect rate limiting", async () => {
      // Try to login 4 times
      for (let i = 0; i < 4; i++) {
        await request(app).post("/api/auth/login").send({
          email: testUser.email,
          password: "wrongpassword",
        });
      }

      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "wrongpassword",
      });

      expect(res.status).toBe(429);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/protected", () => {
    it("should access protected route with valid token", async () => {
      const res = await request(app)
        .get("/api/auth/protected")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
    });

    it("should not access protected route without token", async () => {
      const res = await request(app).get("/api/auth/protected");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should logout successfully", async () => {
      const res = await request(app)
        .post("/api/auth/logout")
        .send({ email: testUser.email });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should not logout with non-existent email", async () => {
      const res = await request(app)
        .post("/api/auth/logout")
        .send({ email: "nonexistent@example.com" });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/forgot-password", () => {
    it("should generate reset token for valid email", async () => {
      const res = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: testUser.email });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.resetToken).toBeDefined();
    });

    it("should not generate reset token for invalid email", async () => {
      const res = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "nonexistent@example.com" });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});

const request = require("supertest");
const { app, connectDB, client } = require("../app"); // Import app, connectDB, and client

jest.setTimeout(10000); // 10 seconds

beforeAll(async () => {
  await connectDB(); // Ensure DB is connected before tests
});

describe("GET /users", () => {
  it("should return all users", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("GET /users/:id", () => {
  it("should return a single user or 404 if not found", async () => {
    const fakeId = "507f1f77bcf86cd799439011";
    const res = await request(app).get(`/users/${fakeId}`);
    expect([200, 404]).toContain(res.statusCode);
  });
});

describe("GET /entries", () => {
  it("should return all entries", async () => {
    const res = await request(app).get("/entries");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("GET /entries/:id", () => {
  it("should return a single entry or 404 if not found", async () => {
    const fakeId = "507f1f77bcf86cd799439011";
    const res = await request(app).get(`/entries/${fakeId}`);
    expect([200, 404]).toContain(res.statusCode);
  });
});

describe("GET /categories", () => {
  it("should return all categories", async () => {
    const res = await request(app).get("/categories");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("GET /categories/:id", () => {
  it("should return a single category or 404 if not found", async () => {
    const fakeId = "507f1f77bcf86cd799439011";
    const res = await request(app).get(`/categories/${fakeId}`);
    expect([200, 404]).toContain(res.statusCode);
  });
});

describe("GET /comments", () => {
  it("should return all comments", async () => {
    const res = await request(app).get("/comments");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("GET /comments/:id", () => {
  it("should return a single comment or 404 if not found", async () => {
    const fakeId = "507f1f77bcf86cd799439011";
    const res = await request(app).get(`/comments/${fakeId}`);
    expect([200, 404]).toContain(res.statusCode);
  });
});

afterAll(async () => {
  if (client && client.close) {
    await client.close();
  }
});

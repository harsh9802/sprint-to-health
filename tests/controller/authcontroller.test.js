import request from "supertest";
import mongoose from "mongoose";
import app from "../../app.js"; // Adjust path as necessary
import User from "../../models/userModel.js"; // Adjust path as necessary

// Connect to test database before running tests
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
});

// Clear database after each test
afterEach(async () => {
  await User.deleteMany({});
});

// Disconnect from database after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

// Test Suite for User Authentication
describe("User Authentication", () => {
  test("User Signup", async () => {
    const response = await request(app).post("/api/v1/users/signup").send({
      name: "Test User",
      email: "test@example.com",
      password: "testpassword",
      passwordConfirm: "testpassword",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data.user.email).toBe("test@example.com");
  });

  test("User Login", async () => {
    await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "testpassword",
      passwordConfirm: "testpassword",
    });

    const response = await request(app).post("/api/v1/users/login").send({
      email: "test@example.com",
      password: "testpassword",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.token).toBeDefined();
  });

  test("Forgot Password", async () => {
    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "testpassword",
      passwordConfirm: "testpassword",
    });

    const response = await request(app)
      .post("/api/v1/users/forgotPassword")
      .send({ email: user.email });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.message).toBe("Token sent to email!");
  });
});

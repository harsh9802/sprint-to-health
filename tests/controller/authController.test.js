// import request from "supertest";
// import mongoose from "mongoose";

// import app from "../../app.js";
// import User from "../../models/userModel.js";

// // Connect to test database before running tests
// beforeAll(async () => {
//   await mongoose.connect(process.env.MONGO_URI_TEST);
// });

// // Clear database after each test
// afterEach(async () => {
//   await User.deleteMany({});
// });

// // Disconnect from database after all tests
// afterAll(async () => {
//   await mongoose.connection.close();
// });

// // Test Suite for User Authentication
// // Test Suite for User Authentication
// describe("User Authentication", () => {
//   test("User Signup", async () => {
//     const response = await request(app).post("/api/v1/users/signup").send({
//       name: "Test User",
//       email: "test@example.com",
//       password: "testpassword",
//       passwordConfirm: "testpassword",
//       dateOfBirth: "01/01/2000",
//       bloodGroup: "A+",
//       weight: "70",
//       height: "170",
//     });

//     expect(response.statusCode).toBe(201);
//     expect(response.body.status).toBe("success");
//     expect(response.body.data.user.email).toBe("test@example.com");
//   });

//   test("User Login", async () => {
//     await User.create({
//       name: "Test User",
//       email: "test@example.com",
//       password: "testpassword",
//       passwordConfirm: "testpassword",
//     });

//     const response = await request(app).post("/api/v1/users/login").send({
//       email: "test@example.com",
//       password: "testpassword",
//     });

//     expect(response.statusCode).toBe(200);
//     expect(response.body.status).toBe("success");
//     expect(response.body.token).toBeDefined();
//   });
// });
test("basic test", () => {
  expect(true).toBe(true);
});

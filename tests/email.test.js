import dotenv from "dotenv";
import Email from "../utils/email.js"; // Update with the correct path
dotenv.config({ path: "./config.env" });

const user = { email: "vijay111991@gmail.com", name: "Test User" };
const url = "https://yourwebsite.com";

describe("Email Class", () => {
  test("should send a welcome email successfully", async () => {
    const email = new Email(user, url);
    await expect(email.sendWelcome()).resolves.not.toThrow();
    console.log("Welcome email sent successfully");
  });
});

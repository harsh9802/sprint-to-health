import { login, logout } from "./login.js";
import { signup } from "./signup.js";
import { showAlert } from "./alert.js";
import {
  fetchVitals,
  summarizeDashboard,
  recognition,
} from "./healthdashboard.js";

// DOM Elements
const loginForm = document.getElementById("loginForm");
const logOutBtn = document.querySelector(".nav__el--logout");
const signUpForm = document.getElementById("signupForm");
const dashboardContainer = document.querySelector(".dashboard-container");
const startRecordButton = document.getElementById("askQuestions");

// Login
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Values
    const email = document.getElementById("email").value;
    const passwordInput = document.getElementById("password");
    const password = document.getElementById("password").value;
    console.log(email);
    login(email, password);
    passwordInput.value = "";
  });
}

// Logout
if (logOutBtn) {
  logOutBtn.addEventListener("click", logout);
}

if (signUpForm) {
  signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Collect form data
    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      passwordConfirm: document.getElementById("passwordConfirm").value,
      dob: document.getElementById("dob").value,
      bloodGroup: document.getElementById("bloodGroup").value,
      weight: document.getElementById("weight").value,
      height: document.getElementById("height").value,
    };
    if (data.password !== data.passwordConfirm) {
      showAlert("Invalid Input", "Passwords should be same.");
    } else {
      await signup(data);
    }
  });
}

// Healthd Dashboard Clien-side Handler
if (dashboardContainer) {
  const userId = document.getElementById("userId").value;
  const explainWithVoiceButton = document.getElementById("getSummary");
  fetchVitals(userId);
  explainWithVoiceButton.addEventListener("click", summarizeDashboard);
  startRecordButton.addEventListener("click", () => {
    recognition.start();
  });
}

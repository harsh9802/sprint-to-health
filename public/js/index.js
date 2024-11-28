import { login, logout } from "./login.js";
import { signup } from "./signup.js";
import { showAlert } from "./alert.js";
// import { startRecognition } from "./assistantHandler.js";

// DOM Elements
const loginForm = document.getElementById("loginForm");
const logOutBtn = document.querySelector(".nav__el--logout");
const signUpForm = document.getElementById("signupForm");
// const startRecordButton = document.getElementById("start-record-btn");

// Login
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Values
    const email = document.getElementById("email").value;
    const passwordInput = document.getElementById("password");
    const password = document.getElementById("password").value;
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

// // Assistant Handler
// if (startRecordButton) {
//   startRecordButton.addEventListener("click", () => {
//     startRecognition();
//   });
// }

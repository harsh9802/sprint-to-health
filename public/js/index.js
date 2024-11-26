import { login, logout } from "./login.js";
// import { startRecognition } from "./assistantHandler.js";

// DOM Elements
const loginForm = document.getElementById("loginForm");
const logOutBtn = document.querySelector(".nav__el--logout");
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

// // Assistant Handler
// if (startRecordButton) {
//   startRecordButton.addEventListener("click", () => {
//     startRecognition();
//   });
// }

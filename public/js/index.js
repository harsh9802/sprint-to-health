import axios from "https://cdn.skypack.dev/axios";
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

const login = async function (email, password) {
  console.log("Password: ", password);
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/users/login",
      data: {
        email: email,
        password: password,
      },
    });
    console.log(res);
  } catch (err) {
    console.error(err.response.data);
  }
};
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

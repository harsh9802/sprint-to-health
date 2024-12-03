import axios from "https://cdn.skypack.dev/axios@1.7.1";
import { showAlert } from "./alert.js";

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        email: email,
        password: password,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Logged in Successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/logout",
    });

    console.log("In logout", res.data.status);

    if (res.data.status === "success") {
      showAlert("success", "Logged Out Successfully!");

      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    } else {
      showAlert("error", "Error logging out! Try again");
    }
  } catch (err) {
    showAlert("error", "Error logging out! Try again");
  }
};

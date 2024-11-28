import axios from "https://cdn.skypack.dev/axios@1.7.1";
import { showAlert } from "./alert.js";

export const signup = async (data) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/signup",
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
        dob: data.dob,
        bloodGroup: data.bloodGroup,
        weight: data.weight,
        height: data.height,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Sign up Successfull!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    console.log("error in signup", err.response);
    showAlert("error", err.response.data.message);
  }
};

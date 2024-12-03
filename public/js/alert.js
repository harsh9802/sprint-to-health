/* eslint-disable */

export const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, msg) => {
  hideAlert();

  // Create alert markup
  const markup = `<div class="alert alert--${type}">${msg}</div>`;

  // Insert the markup into the body
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);

  // Style the alert to be centered in the middle of the screen
  const alertElement = document.querySelector(".alert");
  alertElement.style.position = "fixed";
  alertElement.style.top = "50%";
  alertElement.style.left = "50%";
  alertElement.style.transform = "translate(-50%, -50%)";
  alertElement.style.zIndex = "1000"; // Ensure it appears above other content

  // Remove the alert after 5 seconds
  window.setTimeout(hideAlert, 5000);
};

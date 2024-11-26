export const getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log in to your account",
    cssPath: "/css/style.css",
  });
};

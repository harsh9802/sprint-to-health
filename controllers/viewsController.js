const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};
export const getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log in to your account",
    cssPath: "/css/style.css",
  });
};

export const getHealthDashboard = (req, res) => {
  let user = res.locals.user;
  user["age"] = calculateAge(user.dateOfBirth);
  console.log(user.age);
  res.render("healthDashboard", {
    title: "Health Dashboard",
    user: res.locals.user,
  });
};

import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import * as factory from "./handleFactory.js";

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

// getMe function
// Similar to getOne, but instead of getting the userId from the URL parameters, we get the userId from the current user data from the currently logged in user
// We get the data of the curretly logged in user from the authController.protect.
export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const updateMe = catchAsync(async (req, res, next) => {
  // Upload Images - Update

  // 1) Create error if user POSTs password data. i.e. Create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }
  // 2) Update user document
  // The user.save() method is not the correct option in this case. Because, if we use the user.save() method,
  // there are some fields that are required which we have not filled. eg: confirmPassword.
  // Hence, we have to user User.findByIdAndUpdate

  // Also, we have to take care that the user cannot update role of the user in database.
  // For now, we only allow the user to update name and email. So, we now have to filter out
  // everything other than name and email. For that we use the filteredBody method
  // i.e. We filter out unwanted field names that are not allowed to be updated

  const filteredBody = filterObj(req.body, "name", "email");

  //   // Saving Image Name to Database

  //   if (req.file) filteredBody.photo = req.file.filename; // We only set the name of the property

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

// Delete the user. We allow the user to delte their account.
// In reality, we actually do not delete the account from the database. We just hide the account from the user,
// by setting active property to false. We do so that we may use the user data in the future.
export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead.",
  });
};

export const getAllUsers = factory.getAll(User);
export const getUser = factory.getOne(User);
// Update user function only for administrators
// Do not attempt to change or update passwords with this!!! Because, passwords are supposed to be updated by admins only. findByIdAndUpdate() does not run any pre save middlewares hence no protection is provided for authorization.
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);

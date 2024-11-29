import crypto from "crypto";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { encrypt, decrypt } from "../utils/encryption.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
    trim: true,
    validate: {
      validator: function (val) {
        return /^[a-zA-Z\s]+$/.test(val);
      },
      message: "User name must only contain alphabetic characters and spaces",
    },
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    index: { unique: true },
    lowercase: true,
    required: [true, "Email address is required"],
    validate: [validator.isEmail, "Please enter a valid email"],
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    trim: true,
    required: "Please enter a password",
    minlength: [8, "Password must be atleast 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  dateOfBirth: {
    type: String,
    required: [true, "Date of Birth is required"], // Expected in DD/MM/YYYY format
  },
  age: {
    type: Number,
    min: [1, "Age must be at least 1"],
    max: [120, "Age must be less than or equal to 120"],
  },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: [true, "Blood group is required"],
  },
  weight: {
    type: String,
    required: [true, "Please enter your weight in Kg"],
  },
  height: {
    type: String,
    required: [true, "Please enter your height in C.M."],
  },
});

// Middleware to check for duplicate email and return a custom error message
userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    // Duplicate email
    if (error.message.includes("email")) {
      const customError = new Error("User already exists, please login.");
      customError.statusCode = 400; // You can adjust the status code
      return next(customError);
    }
  }
  next(error);
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Pre-save middleware to calculate age
userSchema.pre("save", function (next) {
  if (this.dateOfBirth) {
    const [day, month, year] = this.dateOfBirth.split("/").map(Number);
    const dob = new Date(year, month - 1, day); // JS Date object (Month is 0-based)
    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs); // Time difference in milliseconds
    this.age = Math.abs(ageDate.getUTCFullYear() - 1970); // Calculate age
  }
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Encryption and Decryption
// Middleware to encrypt sensitive data before saving
userSchema.pre("save", function (next) {
  if (this.isModified("email")) {
    this.email = encrypt(this.email);
  }

  if (this.isModified("name")) {
    this.name = encrypt(this.name);
  }

  if (this.isModified("dateOfBirth")) {
    this.dateOfBirth = encrypt(this.dateOfBirth);
  }

  if (this.isModified("bloodGroup")) {
    this.bloodGroup = encrypt(this.bloodGroup);
  }

  if (this.isModified("weight")) {
    this.weight = encrypt(this.weight);
  }

  if (this.isModified("height")) {
    this.height = encrypt(this.height);
  }

  next();
});

// Middleware to decrypt sensitive data after retrieving
userSchema.post("find", function (docs) {
  if (Array.isArray(docs)) {
    docs.forEach((doc) => {
      if (doc.email) doc.email = decrypt(doc.email);
      if (doc.name) doc.name = decrypt(doc.name);
      if (doc.dateOfBirth) doc.dateOfBirth = decrypt(doc.dateOfBirth);
      if (doc.bloodGroup) doc.bloodGroup = decrypt(doc.bloodGroup);
      if (doc.weight) doc.weight = decrypt(doc.weight);
      if (doc.height) doc.height = decrypt(doc.height);
    });
  } else if (docs) {
    // Handle a single document
    if (docs.email) docs.email = decrypt(docs.email);
    if (docs.name) docs.name = decrypt(docs.name);
    if (docs.dateOfBirth) docs.dateOfBirth = decrypt(docs.dateOfBirth);
    if (docs.bloodGroup) docs.bloodGroup = decrypt(docs.bloodGroup);
    if (docs.weight) docs.weight = decrypt(docs.weight);
    if (docs.height) docs.height = decrypt(docs.height);
  }
});

// Middleware for `findOne` and similar queries
userSchema.post("findOne", function (doc) {
  if (doc) {
    if (doc.email) doc.email = decrypt(doc.email);
    if (doc.name) doc.name = decrypt(doc.name);
    if (doc.dateOfBirth) doc.dateOfBirth = decrypt(doc.dateOfBirth);
    if (doc.bloodGroup) doc.bloodGroup = decrypt(doc.bloodGroup);
    if (doc.weight) doc.weight = decrypt(doc.weight);
    if (doc.height) doc.height = decrypt(doc.height);
  }
});

// Middleware for decrypting after using `findOneAndUpdate` and similar queries
userSchema.post("findOneAndUpdate", function (doc) {
  if (doc) {
    if (doc.email) doc.email = decrypt(doc.email);
    if (doc.name) doc.name = decrypt(doc.name);
    if (doc.dateOfBirth) doc.dateOfBirth = decrypt(doc.dateOfBirth);
    if (doc.bloodGroup) doc.bloodGroup = decrypt(doc.bloodGroup);
    if (doc.weight) doc.weight = decrypt(doc.weight);
    if (doc.height) doc.height = decrypt(doc.height);
  }
});

const User = mongoose.model("User", userSchema);

export default User;

import crypto from "crypto";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

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
  address: {
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
  },
  securityQuestion: {
    question: {
      type: String,
      default: "What city were you born in?",
      immutable: true,
    },
    answer: {
      type: String,
      required: [true, "Answer to security question is required"],
      trim: true,
    },
  },
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

const User = mongoose.model("User", userSchema);

export default User;

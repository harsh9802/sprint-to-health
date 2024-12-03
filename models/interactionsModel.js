import mongoose from "mongoose";
import { encrypt, decrypt } from "../utils/encryption.js";

const interactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Mongoose will use the User model registered in the project
    required: true,
  },
  content: {
    type: String,
    required: [true, "The content is required."],
    trim: true,
  },
  role: {
    type: String,
    required: [true, "The role is required."],
    trim: true,
  },
  type: {
    type: String,
    required: [true, "The type is required."],
    trim: true, 
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to encrypt sensitive fields
interactionSchema.pre("save", function (next) {
  if (this.isModified("command")) {
    this.command = encrypt(this.command);
  }

  if (this.isModified("response")) {
    this.response = encrypt(this.response);
  }

  next();
});

// Middleware to decrypt fields after a find operation
interactionSchema.post("find", function (docs) {
  docs.forEach((doc) => {
    if (doc.command) doc.command = decrypt(doc.command);
    if (doc.response) doc.response = decrypt(doc.response);
  });
});

// Middleware to decrypt fields after findOne or findOneAndUpdate
interactionSchema.post("findOne", function (doc) {
  if (doc) {
    if (doc.command) doc.command = decrypt(doc.command);
    if (doc.response) doc.response = decrypt(doc.response);
  }
});

interactionSchema.post("findOneAndUpdate", function (doc) {
  if (doc) {
    if (doc.command) doc.command = decrypt(doc.command);
    if (doc.response) doc.response = decrypt(doc.response);
  }
});

// Ensure to encrypt fields before updating the document
interactionSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.command) {
    update.command = encrypt(update.command);
  }

  if (update.response) {
    update.response = encrypt(update.response);
  }

  next();
});

const Interaction = mongoose.model("Interaction", interactionSchema);

export default Interaction;

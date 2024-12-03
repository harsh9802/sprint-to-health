import mongoose from "mongoose";
import { encrypt, decrypt } from "../utils/encryption.js";

const VitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    unit: {
      type: String, // e.g., 'bpm' for Heart Rate, 'mmHg' for Blood Pressure
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    collection: "vitals",
  }
);

// Pre-save middleware to encrypt sensitive fields
VitalSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.name = encrypt(this.name);
  }

  if (this.isModified("unit")) {
    this.unit = encrypt(this.unit);
  }

  if (this.isModified("description")) {
    this.description = encrypt(this.description);
  }

  next();
});

// Middleware to decrypt fields after a find operation
VitalSchema.post("find", function (docs) {
  docs.forEach((doc) => {
    if (doc.name) doc.name = decrypt(doc.name);
    if (doc.unit) doc.unit = decrypt(doc.unit);
    if (doc.description) doc.description = decrypt(doc.description);
  });
});

// Middleware to decrypt fields after findOne or findOneAndUpdate
VitalSchema.post("findOne", function (doc) {
  if (doc) {
    if (doc.name) doc.name = decrypt(doc.name);
    if (doc.unit) doc.unit = decrypt(doc.unit);
    if (doc.description) doc.description = decrypt(doc.description);
  }
});

VitalSchema.post("findOneAndUpdate", function (doc) {
  if (doc) {
    if (doc.name) doc.name = decrypt(doc.name);
    if (doc.unit) doc.unit = decrypt(doc.unit);
    if (doc.description) doc.description = decrypt(doc.description);
  }
});

// Ensure to encrypt fields before updating the document
VitalSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.name) {
    update.name = encrypt(update.name);
  }

  if (update.unit) {
    update.unit = encrypt(update.unit);
  }

  if (update.description) {
    update.description = encrypt(update.description);
  }

  next();
});

const Vital = mongoose.model("Vital", VitalSchema);
export default Vital;

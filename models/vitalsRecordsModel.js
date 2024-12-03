import mongoose from "mongoose";
import { encrypt, decrypt } from "../utils/encryption.js";

const VitalsRecordSchema = new mongoose.Schema(
  {
    vital_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vital", // FK reference to the `vitals` collection
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // FK reference to the `users` collection
      required: true,
    },
    value: {
      type: String, // Store the value as an encrypted string
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now, // Automatically set timestamp to current time
    },
  },
  {
    collection: "vital_records",
  }
);

// Pre-save middleware to encrypt sensitive fields
VitalsRecordSchema.pre("save", function (next) {
  if (this.isModified("value")) {
    if (typeof this.value === "string" && this.value.trim() !== "") {
      this.value = encrypt(this.value.toString());
    } else {
      return next(new Error("Invalid value for encryption"));
    }
  }
  next();
});

// Post-find middleware to decrypt sensitive fields
VitalsRecordSchema.post("find", function (docs) {
  docs.forEach((doc) => {
    if (doc.value) doc.value = parseFloat(decrypt(doc.value)); // Decrypt and convert back to a number
  });
});

// Post-findOne and findOneAndUpdate middleware for decryption
VitalsRecordSchema.post("findOne", function (doc) {
  if (doc && doc.value) {
    doc.value = parseFloat(decrypt(doc.value));
  }
});

VitalsRecordSchema.post("findOneAndUpdate", function (doc) {
  if (doc && doc.value) {
    doc.value = parseFloat(decrypt(doc.value));
  }
});

VitalsRecordSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update && typeof update === "object") {
    if (update.$set && update.$set.value) {
      update.$set.value = encrypt(update.$set.value.toString());
    } else if (update.value) {
      update.value = encrypt(update.value.toString());
    }
  }

  next();
});

const VitalsRecord = mongoose.model("VitalRecord", VitalsRecordSchema);
export default VitalsRecord;

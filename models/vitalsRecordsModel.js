import mongoose from "mongoose";

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
      type: Number, // Float value for the recorded vital measurement
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

const VitalsRecord = mongoose.model("VitalRecord", VitalsRecordSchema);
export default VitalsRecord;

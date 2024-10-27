import mongoose from "mongoose";

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

const Vital = mongoose.model("Vital", VitalSchema);
export default Vital;

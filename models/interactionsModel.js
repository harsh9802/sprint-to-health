import mongoose from "mongoose";

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

const Interaction = mongoose.model("Interaction", interactionSchema);

export default Interaction;

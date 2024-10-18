import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  command: {
    type: String,
    required: [true, "The command is required."],
  },
  response: {
    type: String,
    required: [true, "The response is required."],
  },
  timestamp: {
    type: Date,
    default: Date.now, // Automatically add the current timestamp for each interaction
  },
});

// Create a Mongoose model for the interactions
const Interaction = mongoose.model("Interaction", interactionSchema);

export default Interaction;

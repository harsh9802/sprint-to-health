import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Mongoose will use the User model registered in the project
    required: true,
  },
  command: {
    type: String,
    required: [true, "The command is required."],
    trim: true,
  },
  response: {
    type: String,
    required: [true, "The response is required."],
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Interaction = mongoose.model("Interaction", interactionSchema);

export default Interaction;

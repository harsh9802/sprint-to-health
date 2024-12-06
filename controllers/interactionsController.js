import Interaction from "../models/interactionsModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

// Create the interaction
export const createInteraction = catchAsync(async (req, res, next) => {
  const { command, response } = req.body;

  // Create a new interaction and save it to the database
  const interaction = await Interaction.create({
    user: req.user.id,
    command: command,
    response: response,
    timestamp: Date.now(),
  });

  if (!interaction) {
    return next(new AppError("Failed to create the interaction.", 500));
  }

  res.status(201).json({
    status: "success",
    data: {
      interaction,
    },
  });
});

export const getInteractions = catchAsync(async (req, res, next) => {
  // Find all interactions of the logged-in user
  const interactions = await Interaction.find({ user: req.user.id }).sort({
    timestamp: -1,
  });

  if (!interactions)
    return next(new AppError("Could not retrieve interactions.", 500));

  res.status(200).json({
    status: "success",
    results: interactions.length,
    data: {
      interactions,
    },
  });
});

// Get the latest 10 interactions for the logged-in user
export const getLatestInteractions = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  // Fetch the latest 10 interactions for the user
  const interactions = await Interaction.find({ user: userId })
    .sort({ timestamp: -1 })
    .limit(100);

  if (!interactions) return next(new AppError("No interactions found.", 404));

  res.status(200).json({
    status: "success",
    data: interactions,
  });
});

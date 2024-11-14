import Interaction from "../models/interactionsModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

// Create the interaction
export const createInteraction = catchAsync(async (req, res, next) => {
  const { content, role, type } = req.body;

  // Create a new interaction and save to the database
  const interaction = await Interaction.create({
    user: req.user.id,
    content: content,
    role: role,
    type: type,
  });

  if (!interaction)
    return next(new AppError("Failed to create the interaction.", 500));

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

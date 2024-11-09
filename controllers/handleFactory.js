import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id, {});

    if (!document) {
      return next(new AppError(`No document found with that ID`, 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: document,
      },
    });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const userId = req.user ? req.user.id : null;

    const data = { ...req.body };
    if (userId) {
      data.user_id = userId;
    }

    const document = await Model.create(data);

    res.status(201).json({
      status: "success",
      data: {
        data: document,
      },
    });
  });

export const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query; // Populate the reviews of virtual populate

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.userId) filter.user = req.params.userId;
    console.log(filter);

    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;

    // Send Response
    res.status(200).json({
      status: "success",
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });

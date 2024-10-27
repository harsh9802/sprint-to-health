import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";

// A delete handler function which acts as a universal delete function for all documents.
// It is called with the corresponding model as an argument and then it returns the delete function with including the input model.
// After calling that function, the delete operation on that model will be performed
export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // const id = req.params.id * 1;
    // const tour = tours.find((el) => el.id === id);
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
    // Assuming you want to update the document with data from the request body.
    // For example, updating the name of the document.
    // Object.assign(documents, req.body); // Merge the request body into the existing document object.
    // const id = req.params.id * 1;
    // const  document = documents.find((el) => el.id === id);

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
    // Include user_id from req.user if available (from authentication middleware)
    const userId = req.user ? req.user.id : null;

    // Create a new object that merges the user ID with other data in req.body
    const data = { ...req.body };
    if (userId) {
      data.user_id = userId;
    }

    // Use the combined data to create the document
    const document = await Model.create(data);

    res.status(201).json({
      status: "success",
      data: {
        data: document,
      },
    });
  });

// Get one document factory handler function
// popOptions for the case where we need to populate based on certain referencing
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

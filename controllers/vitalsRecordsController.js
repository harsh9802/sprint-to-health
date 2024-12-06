import mongoose, { Types } from "mongoose"; // Import ObjectId
import { encrypt, decrypt } from "../utils/encryption.js";
import VitalsRecord from "../models/vitalsRecordsModel.js";
import Vital from "../models/vitalsModel.js";
import * as factory from "./handleFactory.js";
import catchAsync from "../utils/catchAsync.js";

// Create new vital - requires the name of the vital for which record is to be created
export const createVitalsRecord = catchAsync(async (req, res, next) => {
  const records = req.body;
  console.log("req.user", req.user);

  const userId = req.user.id;

  // Check that the body contains an array
  if (!Array.isArray(records) || records.length === 0) {
    return res.status(400).json({
      status: "fail",
      message: "Request body must contain an array of vital records.",
    });
  }

  // Create an array to store each new vital record
  const newRecords = [];

  for (const record of records) {
    const { vital, value } = record;

    // Validate the vital name
    if (!vital || typeof vital !== "string") {
      return res.status(400).json({
        status: "fail",
        message: "Vital name is required and must be a string.",
      });
    }

    const trimmedName = vital.trim();
    const encryptedName = encrypt(trimmedName);

    // Find the vital ID based on the trimmed name
    const foundVital = await Vital.findOne({ name: encryptedName });
    if (!foundVital) {
      return res.status(400).json({
        status: "fail",
        message: `Vital with the name "${trimmedName}" does not exist.`,
      });
    }

    // Create each new record
    const newRecord = await VitalsRecord.create({
      vital_id: foundVital._id,
      user_id: userId,
      value,
    });

    newRecords.push(newRecord);
  }

  res.status(201).json({
    status: "success",
    data: {
      data: newRecords,
    },
  });
});

// Get vitals
export const getVitalsValuesForLast24Hours = catchAsync(
  async (req, res, next) => {
    const { userId, vital_names } = req.body; // Expecting userId and an array of vital names

    if (!userId) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a valid user ID.",
      });
    }

    if (!Array.isArray(vital_names) || vital_names.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide an array of vital names.",
      });
    }

    let vitalNamesEncrypted = vital_names.map((vitalName) => {
      return encrypt(vitalName);
    });

    // Convert userId to a mongoose ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find vital IDs that match the provided names
    const vitalRecords = await Vital.find({
      name: { $in: vitalNamesEncrypted },
    }).select("_id name");

    if (!vitalRecords.length) {
      return res.status(404).json({
        status: "fail",
        message: "No matching vitals found for the provided names.",
      });
    }

    const vitalIds = vitalRecords.map((vital) => vital._id);

    const vitalNameMap = vitalRecords.reduce((acc, vital) => {
      acc[vital._id.toString()] = vital.name; // Map vital ID to its name
      return acc;
    }, {});

    // Calculate the timestamp for 24 hours ago
    const duration = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000);

    // Aggregation pipeline to filter records for the last 24 hours
    const docs = await VitalsRecord.aggregate([
      {
        $match: {
          user_id: userObjectId,
          vital_id: { $in: vitalIds },
          timestamp: { $gte: duration }, // Match records from the last 24 hours
        },
      },
      {
        $sort: { timestamp: -1 }, // Sort by timestamp in descending order
      },
      {
        $group: {
          _id: "$vital_id",
          values: { $push: "$value" }, // Collect all values for each vital ID
        },
      },
    ]);

    // Transform the result into the desired format
    const result = docs.reduce((acc, doc) => {
      const vitalName = vitalNameMap[doc._id.toString()];

      // Decrypt each value in the 'values' array
      const decryptedValues = doc.values.map((encryptedValue) =>
        decrypt(encryptedValue)
      );

      acc[vitalName] = decryptedValues; // Map decrypted vital name to its array of decrypted values
      return acc;
    }, {});

    res.status(200).json({
      status: "success",
      data: result,
    });
  }
);

// Get the latest Vitals Records from all vitals for the logged in user
export const getAllLatestVitalsRecords = catchAsync(async (req, res, next) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const docs = await VitalsRecord.aggregate([
    {
      $match: { user_id: userId }, // Filter by logged-in user's ID
    },
    {
      $sort: { timestamp: -1 }, // Sort records by timestamp in descending order
    },
    {
      $group: {
        _id: "$vital_id", // Group by vital_id
        latestRecord: { $first: "$$ROOT" }, // Select the latest document in each group
      },
    },
    {
      $replaceRoot: { newRoot: "$latestRecord" }, // Replace root with the latest record
    },
    {
      $lookup: {
        // Join with the vitals collection to get vital details
        from: "vitals",
        localField: "vital_id",
        foreignField: "_id",
        as: "vitalDetails",
      },
    },
    {
      $unwind: "$vitalDetails", // Flatten the array from $lookup
    },
  ]);

  // Decrypt sensitive fields in vitals details after the aggregation
  docs.forEach((doc) => {
    if (doc.vitalDetails) {
      doc.vitalDetails.name = decrypt(doc.vitalDetails.name); // Decrypt sensitive fields like name
      doc.vitalDetails.unit = decrypt(doc.vitalDetails.unit); // Decrypt unit field if necessary
      doc.vitalDetails.description = decrypt(doc.vitalDetails.description); // Decrypt description if necessary
    }
    if (doc.value) {
      doc.value = parseFloat(decrypt(doc.value)); // Decrypt and convert back to a number for value
    }
  });

  res.status(200).json({
    status: "success",
    results: docs.length,
    data: {
      data: docs,
    },
  });
});

// Function to get the latest records for specific vitals based on provided vital names in an array
export const getLatestVitalsRecordsForVitals = catchAsync(
  async (req, res, next) => {
    const userId = new mongoose.Types.ObjectId(req.user.id); // user ID is stored in req.user.id from authentication middleware
    const { vital_names } = req.body; // Expects an array of vital names from request body

    if (!Array.isArray(vital_names) || vital_names.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide an array of vital names.",
      });
    }

    let vitalNamesEncrypted = vital_names.map((vitalName) => {
      return encrypt(vitalName);
    });

    // Step 1: Find all vital IDs that match the provided vital names
    const vitalIds = await Vital.find({
      name: { $in: vitalNamesEncrypted },
    }).select("_id");

    if (!vitalIds.length) {
      return res.status(404).json({
        status: "fail",
        message: "No matching vitals found for the provided names.",
      });
    }

    const vitalObjectIds = vitalIds.map((vital) => vital._id);

    // Step 2: Use the found vital IDs in the aggregation pipeline
    const docs = await VitalsRecord.aggregate([
      {
        $match: {
          user_id: userId,
          vital_id: { $in: vitalObjectIds }, // Match provided vital IDs
        },
      },
      {
        $sort: { timestamp: -1 }, // Sort records by timestamp in descending order
      },
      {
        $lookup: {
          // Join with the vitals collection to get vital details
          from: "vitals",
          localField: "vital_id",
          foreignField: "_id",
          as: "vitalDetails",
        },
      },
      {
        $unwind: "$vitalDetails", // Flatten the array from $lookup
      },
    ]);

    // Decrypt sensitive fields in vitals details after the aggregation
    docs.forEach((doc) => {
      if (doc.vitalDetails) {
        doc.vitalDetails.name = decrypt(doc.vitalDetails.name); // Decrypt sensitive fields like name
        doc.vitalDetails.unit = decrypt(doc.vitalDetails.unit); // Decrypt unit field if necessary
        doc.vitalDetails.description = decrypt(doc.vitalDetails.description); // Decrypt description if necessary
      }
      if (doc.value) {
        doc.value = parseFloat(decrypt(doc.value)); // Decrypt and convert back to a number for value
      }
    });

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: {
        data: docs,
      },
    });
  }
);

// export const getVitalsValuesForLast24Hours = catchAsync(
//   async (req, res, next) => {
//     const { userId, vital_names } = req.body; // Expecting userId and an array of vital names

//     if (!userId) {
//       return res.status(400).json({
//         status: "fail",
//         message: "Please provide a valid user ID.",
//       });
//     }

//     if (!Array.isArray(vital_names) || vital_names.length === 0) {
//       return res.status(400).json({
//         status: "fail",
//         message: "Please provide an array of vital names.",
//       });
//     }

//     // Convert userId to a mongoose ObjectId
//     const userObjectId = new mongoose.Types.ObjectId(userId);

//     // Find vital IDs that match the provided names
//     const vitalRecords = await Vital.find({ name: { $in: vital_names } }).select("_id name");

//     if (!vitalRecords.length) {
//       return res.status(404).json({
//         status: "fail",
//         message: "No matching vitals found for the provided names.",
//       });
//     }

//     const vitalIds = vitalRecords.map((vital) => vital._id);
//     const vitalNameMap = vitalRecords.reduce((acc, vital) => {
//       acc[vital._id.toString()] = vital.name; // Map vital ID to its name
//       return acc;
//     }, {});

//     // Calculate the timestamp for 24 hours ago
//     const last24Hours = new Date(Date.now() - 10000 * 60 * 60 * 1000);

//     // Aggregation pipeline to filter records for the last 24 hours
//     const docs = await VitalsRecord.aggregate([
//       {
//         $match: {
//           user_id: userObjectId,
//           vital_id: { $in: vitalIds },
//           timestamp: { $gte: last24Hours }, // Match records from the last 24 hours
//         },
//       },
//       {
//         $sort: { timestamp: -1 }, // Sort by timestamp in descending order
//       },
//       {
//         $group: {
//           _id: "$vital_id",
//           values: { $push: "$value" }, // Collect all values for each vital ID
//         },
//       },
//     ]);

//     // Transform the result into the desired format
//     const result = docs.reduce((acc, doc) => {
//       const vitalName = vitalNameMap[doc._id.toString()];
//       acc[vitalName] = doc.values; // Map vital name to its array of values
//       return acc;
//     }, {});

//     res.status(200).json({
//       status: "success",
//       data: result,
//     });
//   }
// );

// Get all vitals records in the database
export const getAllVitalsRecords = factory.getAll(VitalsRecord);
// Get one vitals record
export const getVitalsRecord = factory.getOne(VitalsRecord);

// Update vital function only for administrators
export const updateVitalsRecord = factory.updateOne(VitalsRecord);
// Delete vital
export const deleteVitalsRecord = factory.deleteOne(VitalsRecord);

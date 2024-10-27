import Vital from "../models/vitalsModel.js";
import * as factory from "./handleFactory.js";

// Create new vital
export const createVital = factory.createOne(Vital);

export const getAllVitals = factory.getAll(Vital);
export const getVital = factory.getOne(Vital);

// Update vitals function only for administrators
export const updateVital = factory.updateOne(Vital);
export const deleteVital = factory.deleteOne(Vital);

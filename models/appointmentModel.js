import mongoose from 'mongoose';

// Define the schema for appointments
const appointmentSchema = new mongoose.Schema({
  doctorName: { type: String, required: true },
  appointmentDate: { type: Date, required: true },
  location: { type: String, required: true },
  specialization: { type: String, required: true },
  appointmentType: { type: String, required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' } // Optional, if you want to link with Patient
});

// Create the model
const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
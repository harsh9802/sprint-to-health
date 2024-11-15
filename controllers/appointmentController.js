import Appointment from '../models/appointmentModel.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const app = express();


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// Controller to fetch all appointments
export const getAppointments = async (req, res) => {
  try {
    //app.use(express.static(path.join(__dirname, '../Public')));
    const appointments = await Appointment.find();
    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found' });
    }
    res.status(200).json(appointments);
    // res.render(path.join(__dirname, '../Public', 'appointments.html'));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
};

// Controller to fetch a single appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.sendfile('../Public/appointments.html');

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching the appointment' });
  }
};

// Controller to create a new appointment
export const createAppointment = async (req, res) => {
  try {
    const { doctorName, appointmentDate, location, specialization, appointmentType, patientId } = req.body;

    // Validate required fields
    if (!doctorName || !appointmentDate || !location || !specialization || !appointmentType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newAppointment = new Appointment({
      doctorName,
      appointmentDate,
      location,
      specialization,
      appointmentType,
      patientId,
    });

    await newAppointment.save();
    res.status(201).json({ message: 'Appointment created successfully', newAppointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating the appointment' });
  }
};

// Controller to delete an appointment
export const deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting the appointment' });
  }
};
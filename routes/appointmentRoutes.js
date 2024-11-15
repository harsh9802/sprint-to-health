import express from 'express';
import { 
  getAppointments, 
  getAppointmentById, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment 
} from '../controllers/appointmentController.js';

const router = express.Router();

// Route to get all appointments
router.get('/appointment', getAppointments);

// Route to get an appointment by ID
router.get('/appointmentid', getAppointmentById);

// Route to create a new appointment
router.post('/', createAppointment);

// Route to update an existing appointment
router.put('/:id', updateAppointment);

// Route to delete an appointment
router.delete('/:id', deleteAppointment);

export default router;
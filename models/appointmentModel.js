const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointmentTime: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'canceled'], default: 'pending' },
  confirmedBy: { type: String, default: null }, // Can be null initially
  confirmedDateTime: { type: Date, default: null }, // Can be null initially
  canceledBy: { type: String, default: null }, // Can be null initially
  canceledDateTime: { type: Date, default: null }, // Can be null initially
  cancelReason: { type: String },
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
// models/doctorModel.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  specialization: { type: String, required: true },
  availability: [{ type: String, required: true }], // Example: ['Monday 9AM-12PM', 'Wednesday 2PM-5PM']
  experience: { type: Number, required: true },
  phoneNo: { type: String, required: true },
  // qualification: { type: String, required: true },
  hospital: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
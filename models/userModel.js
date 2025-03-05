const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for the user
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNo: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['doctor', 'patient', 'admin'] }, // User roles
  specialization: { type: String }, // Optional for doctor role
  availability: [{ type: String }], // Optional for doctor role
  experience: { type: Number }, // Optional for doctor role
  hospital: { type: String },
  age: { type: Number },  // New field for age
  address: { type: String },  // New field for address
});


const User = mongoose.model('User', userSchema);
module.exports = User;
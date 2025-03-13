// server.js
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Import the auth routes
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');

dotenv.config(); // Load environment variables from .env

const app = express();

// Middleware
app.use(express.json()); // For parsing JSON data
app.use(cors()); // Allow cross-origin requests
// app.use(cors({
//   // origin: 'https://manohara91.github.io', // Allow GitHub Pages frontend
//   origin: *,
//    methods: 'GET,POST,PUT,DELETE',
//   allowedHeaders: 'Content-Type,Authorization'
// }));

// Connect to MongoDB
connectDB();

// Use auth routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patient', patientRoutes);

// Sample route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the Doctor Appointment API');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
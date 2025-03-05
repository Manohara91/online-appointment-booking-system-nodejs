const express = require('express');
const { addDoctor, getAllDoctors, getDoctorAppointments, removeDoctor,editDoctorDetails,updateDoctorAvailability } = require('../controllers/doctorController'); // Ensure correct import
const { verifyJWT, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

// Add doctor route
router.post('/add', verifyJWT, authorizeRole('admin'), addDoctor);  // Ensure addDoctor is passed as a callback
router.get('/all-doctors', verifyJWT, authorizeRole('admin'), getAllDoctors);
router.get('/doctor-appointments/:doctorId', verifyJWT, authorizeRole('doctor'), getDoctorAppointments);
router.delete('/remove-doctor/:doctorId', verifyJWT, authorizeRole('admin'), removeDoctor);
router.put('/edit-doctor-details/:doctorId', verifyJWT, authorizeRole('doctor'), editDoctorDetails);
router.post('/add-doctor-availability/:doctorId', verifyJWT, authorizeRole('doctor'), updateDoctorAvailability);



module.exports = router;

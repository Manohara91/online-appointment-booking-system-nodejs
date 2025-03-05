const express = require('express');
const { availableDoctors,
        bookAppointment,
        cancelAppointment,
        appointmentDetails,
        getAllPatients,
        getAllAppointments, 
        confirmAppointments,
        cancelAppointmentByPatient,
        cancelAppointments,
        patientProfile,
        checkAppointmentLimit,
        editPatientProfile,
        forgotPassword,
        rescheduleAppointment, 
        viewAppointments } = require('../controllers/patientController');
const { verifyJWT, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

// // View available doctors
router.get('/availableDoctors', verifyJWT, authorizeRole('patient'), availableDoctors);

// // Book an appointment
router.post('/appointments/book', verifyJWT, authorizeRole('patient'), bookAppointment);

// Cancel an appointment
router.post('/appointments/:appointmentId', verifyJWT, authorizeRole('patient'), cancelAppointment); 

// Get Booking Details
router.get('/appointmentDetails/:patientId', verifyJWT, authorizeRole('patient'), appointmentDetails);

// Get All Patient
router.get('/allPatient', verifyJWT, authorizeRole('admin'), getAllPatients);

// Get All Apponitments
router.get('/allAppointments', verifyJWT, authorizeRole('admin'), getAllAppointments);

//  confirm appointment
router.post('/confirmAppointment/:appointmentId', verifyJWT, authorizeRole('admin','doctor'), confirmAppointments); 

//  cancel appointments
router.post('/cancelAppointment/:appointmentId', verifyJWT, authorizeRole('admin','doctor'), cancelAppointments); 

// patient profile
router.get('/profile/:patientId', verifyJWT, authorizeRole('patient'), patientProfile); 

// check Appointment Limit
router.post('/checkAvailabilityLimit', verifyJWT, authorizeRole('patient'), checkAppointmentLimit); 


// edit profile detail
router.post('/editPatientProfile/:patientId', verifyJWT, authorizeRole('patient'), editPatientProfile); 

// edit profile detail
router.post('/forgotPassword', forgotPassword); 

// // Reschedule an appointment 
// router.patch('/appointments/:id', verifyJWT, authorizeRole('patient'), rescheduleAppointment);

// // View upcoming and past appointments
// router.get('/appointments', verifyJWT, authorizeRole('patient'), viewAppointments);

module.exports = router;

const Doctor = require('../models/doctorModel');
const Appointment = require('../models/appointmentModel');
const User = require('../models/userModel'); 
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// View available doctors
// exports.availableDoctors = async (req, res) => {
//   try {
//     const doctors = await User.find({ role: 'doctor' });
//     if (!doctors || doctors.length === 0) {
//         return res.json({ result: false, message: 'No doctors available' });
//       }
  
//       res.json({
//         result: true,
//         doctors
//       });
//   } catch (error) {
//     res.json({ result: false, error: 'Failed to fetch doctors' });
//   }
// };

// // Book an appointment
// exports.bookAppointment = async (req, res) => {
//   try {
//     const { doctorId, patientId, appointmentTime } = req.body;
//     console.log("req.body :", req.body);
    
//     // Validate required fields
//   if (!doctorId || !patientId || !appointmentTime) {
//     return res.json({ result: false, message: 'All fields are required' });
//   }
//   // Check if the doctor exists
//   const doctor = await User.findById(doctorId);
//   console.log("doctor :", doctor);
//   if (!doctor || doctor.role !== 'doctor') {
//     return res.json({ result: false, message: 'Doctor not found' });
//   }

//   // Check if the appointment time is available
//   if (!doctor.availability.includes(appointmentTime)) {
//     return res.json({ result: false, message: 'The doctor is not available at the selected time' });
//   }

//   // Create appointment record (you should create an `Appointment` model for this)
//   const newAppointment = new Appointment({
//     doctorId,
//     patientId,
//     appointmentTime,
//     status: 'pending', // Status can be 'pending', 'confirmed', or 'canceled'
//   });

//   await newAppointment.save();

//   res.json({
//     result: true,
//     message: 'Appointment booked successfully',
//     appointment: newAppointment
//   });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to book appointment' });
//   }
// };

// // Reschedule an appointment
// exports.rescheduleAppointment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { date, time } = req.body;
//     await Appointment.findByIdAndUpdate(id, { date, time });
//     res.status(200).json({ message: 'Appointment rescheduled successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to reschedule appointment' });
//   }
// };

// // View appointments
// exports.viewAppointments = async (req, res) => {
//   try {
//     const { patientId } = req.user;
//     const appointments = await Appointment.find({ patientId });
//     res.status(200).json(appointments);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch appointments' });
//   }
// };

// const mongoose = require('mongoose');
// const Appointment = require('../models/Appointment'); // Ensure you have this model

// Example email to send
const mailOptions = {
  from: process.env.EMAIL_USER,  // sender address
  to: 'ashwini.gr486@gmail.com',  // recipient address
  subject: 'Subject of your email',
  text: 'Body of the email',
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // Your Gmail address
      pass: process.env.EMAIL_PASSWORD,  // The App Password you generated
    },
    tls: {
      rejectUnauthorized: true,  // Ensure this is true for security
    },
  });

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
  const cancelAppointmentByDoctorOrAdmin = async (email, name, emailData) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Appointment Cancellation Notification',
        text: `
          Dear ${name},
  
          We regret to inform you that the appointment scheduled on ${emailData.appointmentTime} has been canceled.
  
          Appointment Details:
          - Patient Name: ${emailData.patientName}
          - Appointment Time: ${emailData.appointmentTime}
          - Cancellation Date: ${emailData.canceledDateTime}
          - Appointment Created On: ${emailData.appointmentCreatedAt}
  
          If you have any questions or need to reschedule, please contact us.
  
          Best regards,
          Online Booking Appointment System
        `,
      };
  
      console.log("mailOptions :", mailOptions);
  
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

const confirmAppointmentByDoctorOrAdmin = async (email, name, emailData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Appointment Confirmation',
      text: `
        Dear ${name},

        We are pleased to inform you that your appointment scheduled on ${emailData.appointmentTime} has been confirmed.

        Appointment Details:
        - Doctor: Dr. ${emailData.doctorName}
        - Hospital Address: ${emailData.hospitalAddress}
        - Appointment Time: ${emailData.appointmentTime}
        - Confirmation Date: ${emailData.confirmedDateTime}
        - Appointment Created On: ${emailData.appointmentCreatedAt}

        If you have any questions, please contact us.

        Best regards,
        Online Booking Appointment System
      `,
    };

    console.log("mailOptions :", mailOptions);

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
  

// // Send email function
// const sendEmailToDoctor = async (email, name, data) => {
//   console.log("email :", email);
//   console.log("name :", name);
//   console.log("data :", data);
  
  
  
//   return
//   try {
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Appointment Canceled',
//       text: `
//       Dear ${name},

//         We regret to inform you that your appointment scheduled on ${appointmentDetails.appointmentTime} has been canceled.

//         Appointment Details:
//         - Patient Name: ${appointmentDetails.patientName}
//         - Appointment Time: ${appointmentDetails.appointmentTime}
//         - Cancellation Date: ${appointmentDetails.canceledDateTime}
//         - Appointment Created On: ${appointmentDetails.appointmentCreatedAt}

//         If you have any questions or need to reschedule, please contact us.

//         Best regards,
//         Online Booking Appointment System
//       `,
//     };
//     console.log("mailOptions :", mailOptions);
    

//     await transporter.sendMail(mailOptions);
//     console.log('Email sent successfully!');
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// };

exports.availableDoctors = async (req, res) => {
    try {
      // Extract page and limit from query parameters
      const { page, limit } = req.query;
  
      // Set default values for page and limit if not provided
      const pageNumber = parseInt(page) || 1;  // Default to page 1
      const pageSize = parseInt(limit) || 8;   // Default to 5 per page
  
      // Calculate the number of documents to skip
      const skip = (pageNumber - 1) * pageSize;
  
      // Fetch doctors with pagination
      const doctors = await User.find({ role: 'doctor' })
        .skip(skip)
        .limit(pageSize);
  
      // Count the total number of doctors
      const totalDoctors = await User.countDocuments({ role: 'doctor' });
  
      // If no doctors are found, return a message
      if (doctors.length === 0) {
        return res.json({ result: false, message: 'No doctors available' });
      }
  
      // Respond with the list of doctors and total count
      res.json({
        result: true,
        doctors,
        totalDoctors,  // Return the total number of doctors for pagination
        pageNumber,    // Current page
        pageSize,      // Number of doctors per page
      });
    } catch (error) {
      console.error('Error fetching doctors:', error);
      res.json({ result: false, error: 'Failed to fetch doctors' });
    }
  };
  

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, appointmentTime } = req.body;

    console.log("req.body :", req.body);
    
    // Validate required fields
    if (!doctorId || !patientId || !appointmentTime) {
      return res.json({ result: false, message: 'All fields are required' });
    }

    // Validate doctorId and patientId are ObjectIds
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.json({ result: false, message: 'Invalid doctor ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.json({ result: false, message: 'Invalid patient ID' });
    }

    // Check if the doctor exists
    const doctor = await User.findById(doctorId);
    console.log("doctor :", doctor);
    if (!doctor || doctor.role !== 'doctor') {
      return res.json({ result: false, message: 'Doctor not found or not a doctor' });
    }

    // Check if the appointment time is available
    if (!doctor.availability || !doctor.availability.includes(appointmentTime)) {
      return res.json({ result: false, message: 'The doctor is not available at the selected time' });
    }

    // Create appointment record (you should create an `Appointment` model for this)
    const newAppointment = new Appointment({
      doctorId,
      patientId,
      appointmentTime,
      status: 'pending', // Status can be 'pending', 'confirmed', or 'canceled'
    });

    await newAppointment.save();

    res.json({
      result: true,
      message: 'Appointment booked successfully',
      appointment: newAppointment
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.json({ result: false, message: 'Failed to book appointment' });
  }
};

// Apppointment Details
// const mongoose = require('mongoose');
// const Appointment = require('../models/Appointment'); // Your Appointment model
// const User = require('../models/User'); // Your User model

// exports.appointmentDetails = async (req, res) => {
//     try {
//         const appointments = await Appointment.aggregate([
//             {
//                 $lookup: {
//                     from: 'users', // The name of the collection where doctor info is stored
//                     localField: 'doctorId', // Field in Appointment collection
//                     foreignField: '_id', // Field in User collection
//                     as: 'doctorDetails' // Alias for the result of the join
//                 }
//             },
//             {
//                 $unwind: {
//                     path: '$doctorDetails', // Unwind the array from $lookup to get a single object
//                     preserveNullAndEmptyArrays: true // This allows to keep appointments even if no doctor is found
//                 }
//             },
//             {
//                 $match: {
//                     'doctorDetails.role': 'doctor' // Only consider users who have the 'doctor' role
//                 }
//             },
//             {
//                 $sort: { createdAt: -1 } // Sort by createdAt (most recent first)
//             }
//         ]);

//         // Now, appointments will contain the doctor details as well, and only doctors will be included
//         res.json({ result: true, data: appointments });
//     } catch (error) {
//         console.log("error:", error);
//         res.json({ result: false, message: 'Failed to fetch appointment details' });
//     }
// } // worked api

// exports.appointmentDetails = async (req, res) => {
//     try {
//         const appointments = await Appointment.find()
//       .sort({ createdAt: -1 }) // Sort by createdAt (most recent first)
//     //   .populate('doctorId patientId')  // Populating doctor and patient details (optional, if you want full user info)
//     //   .exec();

//     res.json({ result: true, data: appointments });
//     } catch (error) {
//         console.log("error :", error);
//         res.json({ result: false, message: 'Failed to fetch book appointment details' });
        
//     }
// }

exports.appointmentDetails = async (req, res) => {
  try {
    // Fetch the patientId from the request params or body (since the user is logged in as a patient)
    const patientId = req.params; // Assuming patientId is passed as a URL param
    console.log("patientId :", patientId);
    

    // Convert patientId to ObjectId
    const patientObjectId = new mongoose.Types.ObjectId(patientId.patientId);

    // Fetch appointments for the given patientId
    const appointments = await Appointment.aggregate([
      {
        $match: {
          patientId: patientObjectId, // Match appointments by patientId
        },
      },
      {
        $lookup: {
          from: 'users', // The collection where doctor info is stored
          localField: 'doctorId', // Field in Appointment collection (doctorId)
          foreignField: '_id', // Field in User collection (doctor)
          as: 'doctorDetails', // Alias for the result of the join
        },
      },
      {
        $unwind: {
          path: '$doctorDetails', // Unwind the doctorDetails array (getting a single object)
          preserveNullAndEmptyArrays: true, // Preserve appointments even if doctor details are missing
        },
      },
      {
        $project: {
          _id: 1, // Include the appointment ID
          patientId: 1, // Include the patient ID
          appointmentTime: 1, // Include the appointment time
          status: 1, // Include the status of the appointment
          createdAt: 1, // Include createdAt timestamp
          updatedAt: 1, // Include updatedAt timestamp
          doctorDetails: 1, // Include doctor details (name, specialization, etc.)
        },
      },
      {
        $sort: { createdAt: -1 }, // Sort appointments by createdAt (most recent first)
      },
    ]);

    // Check if appointments are found
    if (appointments.length === 0) {
      return res.json({ result: false, message: 'No appointments found for the given patient' });
    }

    // Return the fetched appointments along with doctor details
    res.json({ result: true, data: appointments });
  } catch (error) {
    console.log("error:", error);
    res.json({ result: false, message: 'Failed to fetch appointment details' });
  }
};
exports.cancelAppointments = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { canceledBy, canceledDateTime, cancelReason } = req.body;

    // Validate request body
    if (!canceledBy || !canceledDateTime || !cancelReason) {
      return res.json({ result: false, error: "Missing required fields" });
    }

    // Find and update the appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        status: "canceled",
        canceledBy,
        canceledDateTime,
        cancelReason,
      },
      { new: true } // Returns the updated document
    );

    if (!updatedAppointment) {
      return res.json({ result: false, error: "Appointment not found" });
    }

    // Fetch patient details for sending the cancellation email to the doctor
    const patient = await User.findById(updatedAppointment.patientId);
    if (!patient) {
      return res.json({ result: false, message: 'Patient details not found' });
    }

    // Prepare the data to send in the email
    const emailData = {
      patientName: patient.name,
      patientEmail: patient.email,
      appointmentTime: updatedAppointment.appointmentTime,
      canceledDateTime: canceledDateTime,
      appointmentCreatedAt: updatedAppointment.createdAt,
    };

    // Send the cancellation email to the doctor
    await cancelAppointmentByDoctorOrAdmin(patient.email, patient.name, emailData);

    // Return success response
    return res.json({
      result: true,
      message: "Appointment canceled successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error canceling appointment:", error);
    return res.json({ result: false, error: "Internal server error" });
  }
};

exports.confirmAppointments = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { confirmedBy, confirmedDateTime } = req.body;

    // Validate request body
    if (!confirmedBy || !confirmedDateTime) {
      return res.json({ result: false, error: "Missing required fields" });
    }

    // Find and update the appointment status to confirmed
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        status: "confirmed",
        confirmedBy,
        confirmedDateTime,
      },
      { new: true } // Returns the updated document
    );

    if (!updatedAppointment) {
      return res.json({ result: false, error: "Appointment not found" });
    }

    // Fetch the doctor details (including hospital address)
    const doctor = await User.findById(updatedAppointment.doctorId);
    if (!doctor) {
      return res.json({ result: false, message: 'Doctor details not found' });
    }

    // Fetch the patient details for sending confirmation email
    const patient = await User.findById(updatedAppointment.patientId);
    if (!patient) {
      return res.json({ result: false, message: 'Patient details not found' });
    }

    // Prepare the email data to send
    const emailData = {
      patientName: patient.name,
      patientEmail: patient.email,
      doctorName: doctor.name,
      hospitalAddress: doctor.hospital,  // Assuming the doctor document has an 'address' field
      appointmentTime: updatedAppointment.appointmentTime,
      confirmedDateTime: confirmedDateTime,
      appointmentCreatedAt: updatedAppointment.createdAt,
    };

    // Send confirmation email to the patient
    await confirmAppointmentByDoctorOrAdmin(patient.email, patient.name, emailData);

    return res.json({
      result: true,
      message: "Appointment confirmed successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error confirming appointment:", error);
    return res.json({ result: false, error: "Internal server error" });
  }
};

// exports.cancelAppointments = async (req, res) => {
//   try {
//     const { appointmentId } = req.params;
//     const { canceledBy, canceledDateTime, cancelReason } = req.body;

//     // Validate request body
//     if (!canceledBy || !canceledDateTime || !cancelReason) {
//       return res.json({ result: false, error: "Missing required fields" });
//     }

//     // Find and update the appointment
//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       {
//         status: "canceled",
//         canceledBy,
//         canceledDateTime,
//         cancelReason,
//       },
//       { new: true } // Returns the updated document
//     );

//     if (!updatedAppointment) {
//       return res.json({ result: false, error: "Appointment not found" });
//     }

//     return res.json({
//       result: true,
//       message: "Appointment canceled successfully",
//       appointment: updatedAppointment,
//     });
//   } catch (error) {
//     console.error("Error canceling appointment:", error);
//     return res.json({ result: false, error: "Internal server error" });
//   }
// };

// Cancel an appointment
exports.cancelAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const { status } = req.body; // Status can be 'confirmed' or 'canceled'
  
    if (!['confirmed', 'canceled'].includes(status)) {
      return res.json({ result: false, message: 'Invalid status. It should be "confirmed" or "canceled".' });
    }
  
    try {
      // Find the appointment
      const appointment = await Appointment.findById(appointmentId);
      console.log("appointment :", appointment);
      if (!appointment) {
        return res.json({ result: false, message: 'Appointment not found' });
      }
  
      // Ensure the appointment belongs to the logged-in doctor or patient
      if (appointment.doctorId.toString() !== req.user.id && appointment.patientId.toString() !== req.user.id) {
        return res.json({ result: false, message: 'You can only manage your own appointments' });
      }
  
      // Update the appointment status
      appointment.status = status;
      await appointment.save();
  
      res.json({
        result: true,
        message: `Appointment ${status} successfully`,
        appointment
      });
    } catch (error) {
      console.error('Error managing appointment:', error);
      res.json({ result: false, message: `Server error: ${error.message}` });
    }
  }
  
// All Patients
  exports.getAllPatients = async (req, res) => {
    try {
      const { page, limit } = req.query;
      const pageNumber = parseInt(page) || 1;  // Default to page 1
      const pageSize = parseInt(limit) || 5;   // Default to 5 per page
      const skip = (pageNumber - 1) * pageSize;
      // Fetch all users with role 'patient'
      const patients = await User.find({ role: 'patient' })
      // const doctors = await User.find({ role: 'doctor' })
      // .select('name email')
      .skip(skip)
      .limit(pageSize);

      // Count the total number of patients
    const totalPatients = await User.countDocuments({ role: 'patient' });
  
      // If no patients found
      if (patients.length === 0) {
        return res.json({ result: false, message: 'No patients found' });
      }
  
      // Return the list of patients
      res.json({ result: true, patients: patients,totalPatients: totalPatients, });
    } catch (error) {
      console.error('Error fetching patients:', error);
      res.json({ result: false, message: 'Error fetching patients' });
    }
  };  

  // All Appointments
  // All Appointments
exports.getAllAppointments = async (req, res) => {
  try {
    console.log("req.query :", req.query);
    
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1; // Default to page 1
    const pageSize = parseInt(limit) || 5;  // Default to 5 per page
    const skip = (pageNumber - 1) * pageSize;

    // Fetch appointments and populate doctor and patient details
    const appointments = await Appointment.find({})
      .populate('doctorId', 'name email specialization') // Populates doctor details (specific fields)
      .populate('patientId', 'name email') // Populates patient details (specific fields)
      .skip(skip)
      .limit(pageSize);

    // Count the total number of appointments
    const totalAppointments = await Appointment.countDocuments({});

    // If no appointments found
    if (appointments.length === 0) {
      return res.json({ result: false, message: 'No appointments found' });
    }
    console.log("appointments :", appointments);
    
    // Return the list of appointments with doctor and patient details
    res.json({
      result: true,
      appointments,
      totalAppointments,
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.json({ result: false, message: 'Error fetching appointments' });
  }
};

// exports.confirmAppointments = async (req, res) => {
//   try {
//     const { appointmentId } = req.params;
//     const { confirmedBy, confirmedDateTime } = req.body;

//     // Validate request body
//     if (!confirmedBy || !confirmedDateTime) {
//       return res.json({result: false, error: "Missing required fields" });
//     }

//     // Find and update appointment
//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       {
//         status: "confirmed",
//         confirmedBy,
//         confirmedDateTime,
//       },
//       { new: true } // Returns the updated document
//     );

//     if (!updatedAppointment) {
//       return res.json({result: false, error: "Appointment not found" });
//     }

//     return res.json({
//       result: true,
//       message: "Appointment confirmed successfully",
//       appointment: updatedAppointment,
//     });
//   } catch (error) {
//     console.error("Error confirming appointment:", error);
//     return res.json({result: false, error: "Internal server error" });
//   }
// };



exports.patientProfile = async (req, res) => {
  const { patientId } = req.params; // Extract patientId from the URL parameters

  try {
    // Find the patient by ObjectId
    const patientProfile = await User.findById(patientId).exec();

    console.log("patientProfile :", patientProfile);

    if (!patientProfile) {
      // If patient is not found, return an error message
      return res.json({ result: false, message: 'Patient not found' });
    }

    // Return the patient details as a response
    res.json({
      result: true,
      message: 'Patient details fetched successfully',
      patientProfile // Sending patient details in response
    });
  } catch (error) {
    // Handle any errors during the process
    console.error('Error fetching patient profile:', error);
    res.json({ result: false, message: `Server error: ${error.message}` });
  }
};

exports.checkAppointmentLimit = async (req, res) => {
  try {
    const { doctorId, patientId, appointmentTime } = req.body;

    if (!doctorId || !patientId || !appointmentTime) {
      return res.json({ result: false, message: 'Missing required fields' });
    }

    const doctorObjectId = new mongoose.Types.ObjectId(doctorId);
    const patientObjectId = new mongoose.Types.ObjectId(patientId);

    console.log('Doctor ID:', doctorId);
    console.log('Patient ID:', patientId);
    console.log('Appointment Time (Requested):', appointmentTime);

    // Check if the patient has already booked this time slot
    const existingPatientAppointment = await Appointment.findOne({
      doctorId: doctorObjectId,
      patientId: patientObjectId,
      appointmentTime: appointmentTime, // Direct string comparison
      status: { $ne: 'canceled' },
    });

    if (existingPatientAppointment) {
      return res.json({ result: false, message: 'You have already booked this time slot' });
    }

    // Count appointments for this time slot
    const appointmentCount = await Appointment.countDocuments({
      doctorId: doctorObjectId,
      appointmentTime: appointmentTime, // Direct string comparison
      status: { $ne: 'canceled' },
    });

    console.log('Appointment Count for this slot:', appointmentCount);

    // Restrict booking if the limit is reached (assuming 2 slots)
    if (appointmentCount >= 10) {
      return res.json({ result: false, message: 'This time slot is fully booked' });
    }

    return res.json({ result: true, message: 'You can book this time slot' });

  } catch (error) {
    console.log('Error:', error);
    res.json({ result: false, message: 'Failed to check appointment limit' });
  }
};


exports.editPatientProfile = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const { name, phoneNo, email, age, address } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.json({ result: false, message: 'Invalid Patient ID format' });
    }

    // Find the user by ID and update the fields
    const user = await User.findByIdAndUpdate(
      patientId, // User ID from URL parameter
      {
        name,
        phoneNo,
        email,
        age,
        address
      },
      { new: true, runValidators: true } // Return updated user document with validation
    );

    if (!user) {
      return res.json({ result: false, message: 'User not found' });
    }

    return res.json({ result: true, message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    return res.json({ result: false, message: 'Server error', error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.json({ result: false, message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ result: false, message: "User not found" });
    }

    // Update user's password (plain text)
    await User.findByIdAndUpdate(user._id, { password });

    return res.json({ result: true, message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res.json({ result: false, message: "Server error", error: error.message });
  }
};



// exports.checkAppointmentLimit = async (req, res) => {
//   try {
//     const { doctorId, patientId, appointmentTime } = req.body;
//     const doctorObjectId = new mongoose.Types.ObjectId(doctorId);
//     const patientObjectId = new mongoose.Types.ObjectId(patientId);

//     console.log('Doctor ID:', doctorId);
//     console.log('Patient ID:', patientId);
//     console.log('Appointment Time (Requested):', appointmentTime);

//     // Fetch all appointments for the doctor for debugging
//     const allAppointments = await Appointment.find({ doctorId: doctorObjectId });
//     // console.log('All Appointments for this doctor:', allAppointments);

//     // Check if the patient has already booked this time slot
//     const existingPatientAppointment = await Appointment.findOne({
//       doctorId: doctorObjectId,
//       patientId: patientObjectId,
//       appointmentTime: new Date(appointmentTime),
//       status: { $ne: 'canceled' }
//     });

//     if (existingPatientAppointment) {
//       return res.json({ result: false, message: 'You have already booked this time slot' });
//     }

//     // Count total appointments for this slot
//     const appointmentCount = await Appointment.countDocuments({
//       doctorId: doctorObjectId,
//       appointmentTime: new Date(appointmentTime),
//       status: { $ne: 'canceled' }
//     });

//     console.log('Appointment Count for this slot:', appointmentCount);

//     // Restrict booking if the limit is reached (10)
//     if (appointmentCount >= 2) {
//       return res.json({ result: false, message: 'This time slot is fully booked' });
//     }

//     return res.json({ result: true, message: 'You can book this time slot' });

//   } catch (error) {
//     console.log('Error:', error);
//     res.json({ result: false, message: 'Failed to check appointment limit' });
//   }
// };


// exports.checkAppointmentLimit = async (req, res) => {
//   try {
//     const { doctorId, appointmentTime } = req.body;
//     const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

//     console.log('Doctor ID:', doctorId);
//     console.log('Appointment Time (Requested):', appointmentTime);

//     // Fetch all appointments for the doctor for debugging
//     const allAppointments = await Appointment.find({ doctorId: doctorObjectId });
//     console.log('All Appointments for this doctor:', allAppointments);

//     // Count appointments with the same time slot
//     const appointmentCount = await Appointment.countDocuments({
//       doctorId: doctorObjectId,
//       appointmentTime: new Date(appointmentTime), // Ensure proper date format
//       status: { $ne: 'canceled' }
//     });

//     console.log('Appointment Count for this slot:', appointmentCount);

//     if (appointmentCount >= 1) {
//       return res.json({ result: false, message: 'Appointment limit reached for this time slot' });
//     } else {
//       return res.json({ result: true, message: 'Book New Appointment time slot' });
//     }
//   } catch (error) {
//     console.log('Error:', error);
//     res.json({ result: false, message: 'Failed to check appointment limit' });
//   }
// };


// exports.checkAppointmentLimit = async (req, res) => {
//   try {
//     const { doctorId, appointmentTime } = req.body;

//     // Convert doctorId to ObjectId
//     const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

//     // Log the input values for debugging
//     console.log('Doctor ID:', doctorId);
//     console.log('Appointment Time:', appointmentTime);

//     // Count the existing appointments for the given time slot and doctor
//     const appointmentCount = await Appointment.countDocuments({
//       doctorId: doctorObjectId,
//       appointmentTime: appointmentTime,
//       status: { $ne: 'canceled' } // Exclude canceled appointments
//     });

//     // Log the count for debugging
//     console.log('Appointment Count:', appointmentCount);

//     // Check if the count is greater than or equal to 1
//     if (appointmentCount >= 2) {
//       return res.json({ result: false, message: 'Appointment limit reached for this time slot' });
//     } 
//     else {
//       return res.json({ result: true, message: 'Book New Appointment time slot' });
//     }
//   } catch (error) {
//     console.log('Error:', error);
//     res.json({ result: false, message: 'Failed to check appointment limit' });
//   }
// };

// exports.checkAppointmentLimit = async (req, res) => {
//   try {
//     const { doctorId, appointmentTime } = req.body;

//     // Convert doctorId to ObjectId
//     const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

//     // Count the existing appointments for the given time slot and doctor
//     const appointmentCount = await Appointment.countDocuments({
//       doctorId: doctorObjectId,
//       appointmentTime: appointmentTime,
//       status: { $ne: 'canceled' } // Exclude canceled appointments
//     });

//     // Check if the count is less than 10
//     if (appointmentCount > 1) {
//       return res.json({ result: true, message: 'Appointment limit reached for this time slot' });
//     }else{
//       return res.json({ result: false, message: 'Book New Appointment time slot' });
//     }

//     // Create the new appointment
//     // const newAppointment = new Appointment({
//     //   doctorId: doctorObjectId,
//     //   patientId: new mongoose.Types.ObjectId(patientId),
//     //   appointmentTime: appointmentTime,
//     //   status: 'scheduled', // Set the initial status
//     //   createdAt: new Date(),
//     //   updatedAt: new Date()
//     // });

//     // Save the new appointment
//     // await newAppointment.save();

//     // Return the created appointment
//     // res.json({ result: true, data: newAppointment });
//   } catch (error) {
//     console.log('Error:', error);
//     res.json({ result: false, message: 'Failed to create appointment' });
//   }
// };

  // exports.getAllAppointments = async (req, res) => {
  //   try {
  //     const { page, limit } = req.query;
  //     const pageNumber = parseInt(page) || 1;  // Default to page 1
  //     const pageSize = parseInt(limit) || 5;   // Default to 5 per page
  //     const skip = (pageNumber - 1) * pageSize;
  //     // Fetch all users with role 'patient'
  //     const appointments = await Appointment.find({})
  //     // const doctors = await User.find({ role: 'doctor' })
  //     // .select('name email')
  //     .skip(skip)
  //     .limit(pageSize);

  //     // Count the total number of patients
  //   const totalAppointments = await Appointment.countDocuments({});
  
  //     // If no patients found
  //     if (appointments.length === 0) {
  //       return res.json({ result: false, message: 'No appointments found' });
  //     }
  
  //     // Return the list of patients
  //     res.json({ result: true, appointments: appointments,totalAppointments: totalAppointments, });
  //   } catch (error) {
  //     console.error('Error fetching appointmnets:', error);
  //     res.json({ result: false, message: 'Error fetching appointmnets' });
  //   }
  // };  

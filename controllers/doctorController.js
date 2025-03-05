// const Doctor = require('../models/doctorModel');
// const Appointment = require('../models/appointmentModel');

// // Manage availability
// exports.manageAvailability = async (req, res) => {
//   try {
//     const { doctorId, availability } = req.body;
//     await Doctor.findByIdAndUpdate(doctorId, { availability });
//     res.status(200).json({ message: 'Availability updated successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to update availability' });
//   }
// };

// // Get appointments
// exports.getAppointments = async (req, res) => {
//   try {
//     const { doctorId } = req.user; // Assuming JWT contains doctorId
//     const appointments = await Appointment.find({ doctorId }).populate('patientId');
//     res.status(200).json(appointments);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch appointments' });
//   }
// };

// // Update appointment status
// exports.updateAppointmentStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
//     await Appointment.findByIdAndUpdate(id, { status });
//     res.status(200).json({ message: 'Appointment status updated successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to update appointment status' });
//   }
// };
// controllers/doctorController.js
// const Doctor = require('../models/doctorModel');
// const User = require('../models/userModel');

// const bcrypt = require('bcryptjs');
// const User = require('../models/userModel');
// const Doctor = require('../models/doctorModel');

// const bcrypt = require('bcryptjs');
// const User = require('../models/userModel'); // Ensure correct import of the User model
// const Doctor = require('../models/doctorModel'); // Ensure correct import of the Doctor model

// const bcrypt = require('bcryptjs');
// const User = require('../models/userModel'); // Ensure correct import of the User model

// exports.addDoctor = async (req, res) => {
//   try {
//     const { name, email, password, specialization, availability, experience, qualification } = req.body;

//     // Validate required fields
//     if (!name || !email || !password || !specialization || !availability || !experience || !qualification) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     // Check if availability is an array and contains at least one item
//     if (!Array.isArray(availability) || availability.length === 0) {
//       return res.status(400).json({ message: 'Availability should be a non-empty array' });
//     }

//     // Check if the user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email already registered' });
//     }

//     // Hash the password before saving
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create user with the role 'doctor' and doctor-specific details
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,  // Store the hashed password
//       role: 'doctor',  // Set role as doctor
//       specialization,
//       availability,
//       experience,
//       qualification,
//     });

//     await newUser.save();

//     res.status(201).json({
//       message: 'Doctor added successfully',
//       doctor: {
//         id: newUser._id,
//         name: newUser.name,
//         email: newUser.email,
//         specialization: newUser.specialization,
//         availability: newUser.availability,
//         experience: newUser.experience,
//         qualification: newUser.qualification,
//       },
//     });
//   } catch (error) {
//     console.error('Error adding doctor:', error);
//     res.status(500).json({ message: `Server error: ${error.message}` });  // Provide more detailed error information
//   }
// };

const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); // Adjust path as per your project structure
const Doctor = require('../models/doctorModel');
const Appointment = require('../models/appointmentModel');
const mongoose = require('mongoose');
// const Counter = require('../models/counter');  // Import the Counter model

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
  
  // Example email to send
  const mailOptions = {
    from: process.env.EMAIL_USER,  // sender address
    to: 'ashwini.gr486@gmail.com',  // recipient address
    subject: 'Subject of your email',
    text: 'Body of the email',
  };
  
  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
  

// Send email function
const sendEmailToDoctor = async (email, name, password) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Online Booking Appointment System',
      text: `Dear ${name},\n\nYou have been successfully added to the Online Booking Appointment System.\n\nHere are your login credentials:\n\nUsername (Email): ${email}\nPassword: ${password}\n\nPlease log in to confirm your availability and patient bookings.\n\nBest regards,\nOnline Booking Appointment System`,
    };
    console.log("mailOptions :", mailOptions);
    

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

exports.addDoctor = async (req, res) => {
  try {
    const { name, email, phoneNo, password, specialization, availability, experience, hospital } = req.body;

    // Validate required fields
    if (!name || !phoneNo || !email || !password || !specialization || !availability || !experience || !hospital) {
      return res.json({ result: false, message: 'All fields are required' });
    }

    // Check if availability is an array and contains at least one item
    if (!Array.isArray(availability) || availability.length === 0) {
      return res.json({ result: false, message: 'Availability should be a non-empty array' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ result: false, message: 'Email already registered' });
    }

    // Generate a doctorId manually or use MongoDB's ObjectId as the doctorId
    // const doctorId = new mongoose.Types.ObjectId(); // Generate a unique ObjectId as doctorId

    // Create the doctor user
    const newUser = new User({
      name,
      phoneNo,
      email,
      password, // Store the password as plain text (no hashing)
      role: 'doctor',  // Set role as doctor
      specialization,
      availability,
      experience,
      hospital
    });

    await newUser.save();
    console.log("Doctor added:", email);

    // Send email to the doctor with the login credentials (if needed)
    await sendEmailToDoctor(email, name, password);

    res.json({
      result: true,
      message: 'Doctor added successfully',
      doctor: {
        id: newUser._id,
        name: newUser.name,
        phoneNo: newUser.phoneNo,
        email: newUser.email,
        specialization: newUser.specialization,
        availability: newUser.availability,
        experience: newUser.experience,
        hospital: newUser.hospital,
      },
    });
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.json({ result: false, message: `Server error: ${error.message}` });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const { page, limit } = req.query;

    // Set default values if page or limit are not provided
    const pageNumber = parseInt(page) || 1;  // Default to page 1
    const pageSize = parseInt(limit) || 5;   // Default to 5 per page

    // Calculate the number of documents to skip
    const skip = (pageNumber - 1) * pageSize;

    // Fetch the doctors with pagination
    const doctors = await User.find({ role: 'doctor' })
      // .select('name email phoneNo specialization availability experience hospital')
      .skip(skip)
      .limit(pageSize);

    // Count the total number of doctors
    const totalDoctors = await User.countDocuments({ role: 'doctor' });

    // Respond with the list of doctors and total count
    res.status(200).json({
      message: 'Doctors fetched successfully',
      doctors: doctors || [],  // If no doctors, return an empty array
      totalDoctors: totalDoctors,
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};


// exports.getAllDoctors = async (req, res) => {
//     try {
//       // Fetch all users with the role 'doctor' and select only relevant fields
//       const doctors = await User.find({ role: 'doctor' }).select('name email specialization availability experience qualification');
  
//       // Check if no doctors are found
//       if (doctors.length === 0) {
//         return res.status(404).json({ message: 'No doctors found' });
//       }
  
//       // Respond with the list of doctors
//       res.status(200).json({
//         message: 'Doctors fetched successfully',
//         doctors: doctors,
//       });
//     } catch (error) {
//       console.error('Error fetching doctors:', error);
//       res.status(500).json({ message: `Server error: ${error.message}` });
//     }
//   };

// exports.getAllDoctors = async (req, res) => {
//   try {
//     // Extract page and limit from the query parameters, defaulting to 1 and 5 respectively
//     const page = parseInt(req.query.page) || 1; // Default page is 1 if not provided
//     const limit = parseInt(req.query.limit) || 5; // Default limit is 5 if not provided

//     // Calculate the number of items to skip (for pagination)
//     const skip = (page - 1) * limit;

//     // Fetch doctors with pagination, limit the fields returned to relevant ones
//     const doctors = await User.find({ role: 'doctor' })
//                               .select('name email specialization availability experience qualification')
//                               .skip(skip)
//                               .limit(limit);

//     // Fetch total number of doctors for pagination
//     const totalDoctors = await User.countDocuments({ role: 'doctor' });

//     // Check if no doctors are found
//     if (doctors.length === 0) {
//       return res.status(404).json({ message: 'No doctors found' });
//     }

//     // Respond with paginated doctors and total count
//     res.status(200).json({
//       message: 'Doctors fetched successfully',
//       doctors: doctors,
//       totalDoctors: totalDoctors, // Include the total count for pagination
//     });
//   } catch (error) {
//     console.error('Error fetching doctors:', error);
//     res.status(500).json({ message: `Server error: ${error.message}` });
//   }
// };


// exports.addDoctor = async (req, res) => {
//   try {
//     const { name, email, phoneNo, password, specialization, availability, experience, hospital } = req.body;

//     // Validate required fields
//     if (!name || !phoneNo || !email || !password || !specialization || !availability || !experience || !hospital) {
//       return res.json({ result: false, message: 'All fields are required' });
//     }

//     // Check if availability is an array and contains at least one item
//     if (!Array.isArray(availability) || availability.length === 0) {
//       return res.json({ result: false, message: 'Availability should be a non-empty array' });
//     }

//     // Check if the user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.json({ result: false, message: 'Email already registered' });
//     }

//     let doctorId;

//     // Generate unique doctor ID using counter
//     try {
//       // Find the counter document for doctorId
//       let counter = await Counter.findOne({ name: 'doctorId' });

//       if (!counter) {
//         // If the counter doesn't exist, create it
//         counter = new Counter({ name: 'doctorId', sequenceValue: 0 });
//         await counter.save();  // Save the new counter
//       }

//       // Increment the sequenceValue
//       counter.sequenceValue += 1;
//       await counter.save();  // Save the updated counter

//       doctorId = counter.sequenceValue;  // Use the updated sequenceValue for the doctorId
//     } catch (error) {
//       console.error("Error generating doctorId:", error);
//       return res.status(500).json({ result: false, message: 'Error generating doctorId' });
//     }

//     // Create the doctor user
//     const newUser = new User({
//       name,
//       phoneNo,
//       email,
//       password, // Store the password as plain text (no hashing)
//       role: 'doctor',  // Set role as doctor
//       specialization,
//       availability,
//       experience,
//       hospital,
//       doctorId, // Save the generated doctorId
//     });

//     await newUser.save();
//     console.log("Doctor added:", email);

//     // Send email to the doctor with the login credentials (if needed)
//     await sendEmailToDoctor(email, name, password);

//     res.json({
//       result: true,
//       message: 'Doctor added successfully',
//       doctor: {
//         id: newUser._id,
//         doctorId: newUser.doctorId,
//         name: newUser.name,
//         phoneNo: newUser.phoneNo,
//         email: newUser.email,
//         specialization: newUser.specialization,
//         availability: newUser.availability,
//         experience: newUser.experience,
//         hospital: newUser.hospital,
//       },
//     });
//   } catch (error) {
//     console.error('Error adding doctor:', error);
//     res.json({ result: false, message: `Server error: ${error.message}` });
//   }
// };

// exports.addDoctor = async (req, res) => {
//   try {
//     const { name, email, phoneNo, password, specialization, availability, experience, hospital } = req.body;

//     // Validate required fields
//     if (!name || !phoneNo || !email || !password || !specialization || !availability || !experience || !hospital) {
//       return res.json({ result: false, message: 'All fields are required' });
//     }

//     // Check if availability is an array and contains at least one item
//     if (!Array.isArray(availability) || availability.length === 0) {
//       return res.json({ result: false, message: 'Availability should be a non-empty array' });
//     }

//     // Check if the user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.json({ result: false, message: 'Email already registered' });
//     }

//     // let doctorId;
//     // try {
//     //   // Generate a unique doctor ID using Counter
//     //   let counter = await Counter.findOne({ name: 'doctorId' });

//     //   if (!counter) {
//     //     // If no counter, create one
//     //     counter = new Counter({ name: 'doctorId', sequenceValue: 1 });
//     //     await counter.save();
//     //   } else {
//     //     // Increment the counter
//     //     counter.sequenceValue += 1;
//     //     await counter.save();
//     //   }

//     //   doctorId = counter.sequenceValue;  // Ensure doctorId is set correctly
//     // } catch (error) {
//     //   console.error("Error generating doctorId:", error);
//     //   return res.status(500).json({ result: false, message: 'Error generating doctorId' });
//     // }

//     // Create the doctor user
//     const newUser = new User({
//       name,
//       phoneNo,
//       email,
//       password, // Store the password as plain text (no hashing)
//       role: 'doctor',  // Set role as doctor
//       specialization,
//       availability,
//       experience,
//       hospital,
//       doctorId, // Save the generated doctorId
//     });

//     await newUser.save();
//     console.log("Doctor added:", email);

//     // Send email to the doctor with the login credentials (if needed)
//     await sendEmailToDoctor(email, name, password);

//     res.json({
//       result: true,
//       message: 'Doctor added successfully',
//       doctor: {
//         id: newUser._id,
//         doctorId: newUser.doctorId,
//         name: newUser.name,
//         phoneNo: newUser.phoneNo,
//         email: newUser.email,
//         specialization: newUser.specialization,
//         availability: newUser.availability,
//         experience: newUser.experience,
//         hospital: newUser.hospital,
//       },
//     });
//   } catch (error) {
//     console.error('Error adding doctor:', error);
//     res.json({ result: false, message: `Server error: ${error.message}` });
//   }
// };


// exports.getAllDoctors = async (req, res) => {
//   try {
//     const { page, limit } = req.query;

//     // Set default values if page or limit are not provided
//     const pageNumber = parseInt(page) || 1;  // Default to page 1
//     const pageSize = parseInt(limit) || 5;   // Default to 5 per page

//     // Calculate the number of documents to skip
//     const skip = (pageNumber - 1) * pageSize;

//     // Fetch the doctors with pagination
//     const doctors = await User.find({ role: 'doctor' })
//       .select('name email phoneNo specialization availability experience hospital')
//       .skip(skip)
//       .limit(pageSize);

//     // Count the total number of doctors
//     const totalDoctors = await User.countDocuments({ role: 'doctor' });

//     // Check if no doctors are found
//     if (doctors.length === 0) {
//       return res.status(404).json({ message: 'No doctors found' });
//     }

//     // Respond with the list of doctors and total count
//     res.status(200).json({
//       message: 'Doctors fetched successfully',
//       doctors: doctors,
//       totalDoctors: totalDoctors,
//     });
//   } catch (error) {
//     console.error('Error fetching doctors:', error);
//     res.status(500).json({ message: `Server error: ${error.message}` });
//   }
// };


// const Appointment = require('../models/Appointment');
// const User = require('../models/User'); // Assuming you are using User model for doctor data
// const mongoose = require('mongoose');

// Fetch all booked appointments for a specific doctor

// exports.getDoctorAppointments = async (req, res) => {
//   try {
//     const doctorId = req.params; // Assuming the logged-in doctor ID is in req.user._id
//     // console.log("doctorId",doctorId);
    
//     const doctorObjectId = new mongoose.Types.ObjectId(doctorId.doctorId); // Convert to ObjectId
//     // const doctorObjectId = new mongoose.Types.ObjectId("6793515141bfd04625d7160e");

//     // Fetch appointments for the given doctor
//     const appointments = await Appointment.aggregate([
//       {
//         $match: { doctorId: doctorObjectId } // Match by doctorId (ensure it's ObjectId)
//       },
//       {
//         $lookup: {
//           from: 'users', // The collection name where doctors are stored
//           localField: 'doctorId', // Field in Appointment collection
//           foreignField: '_id', // Field in User collection (doctor)
//           as: 'doctorDetails' // Alias for the result of the join
//         }
//       },
//       {
//         $unwind: {
//           path: '$doctorDetails', // Unwind the doctorDetails array
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $project: {
//           'doctorDetails.password': 0, // Exclude sensitive info
//           'doctorDetails.email': 0,
//           'doctorDetails._id': 0, 
//           'doctorDetails.__v': 0
//         }
//       },
//       {
//         $sort: { createdAt: -1 } // Sort by the latest created appointment first
//       }
//     ]);

//     // Log the appointments for debugging
//     console.log('Appointments fetched:', appointments);

//     // Return the fetched appointments
//     res.json({ result: true, data: appointments });
//   } catch (error) {
//     console.log('Error:', error);
//     res.json({ result: false, message: 'Failed to fetch appointments for the doctor' });
//   }
// };

// exports.getDoctorAppointments = async (req, res) => {
//   try {
//     // Fetch doctorId from the URL params
//     const doctorId = req.params; // doctorId will be in req.params

//     // Convert doctorId to ObjectId
//     const doctorObjectId = new mongoose.Types.ObjectId(doctorId.doctorId);

//     // Fetch appointments for the given doctor
//     const appointments = await Appointment.aggregate([
//       {
//         $match: { doctorId: doctorObjectId } // Match by doctorId (ensure it's ObjectId)
//       },
//       {
//         $lookup: {
//           from: 'users', // The collection name where doctors are stored
//           localField: 'doctorId', // Field in Appointment collection
//           foreignField: '_id', // Field in User collection (doctor)
//           as: 'doctorDetails' // Alias for the result of the join
//         }
//       },
//       {
//         $unwind: {
//           path: '$doctorDetails', // Unwind the doctorDetails array (so we have doctor details as a single object)
//           preserveNullAndEmptyArrays: true // This will preserve appointments even if doctor details are missing
//         }
//       },
//       {
//         $group: {
//           _id: '$doctorId', // Group by doctorId so doctor details are shown only once
//           doctorDetails: { $first: '$doctorDetails' }, // Get the first doctorDetails as common info
//           appointments: {
//             $push: { // Push all the appointment details into an array
//               _id: '$appointmentId', // Use the proper field name for appointment ID
//               patientId: '$patientId',
//               appointmentTime: '$appointmentTime',
//               status: '$status',
//               createdAt: '$createdAt',
//               updatedAt: '$updatedAt'
//             }
//           }
//         }
//       },
//       {
//         $project: {
//           _id: 0, // Remove _id from the grouped result
//           doctorDetails: 1, // Keep doctor details
//           appointments: 1 // Keep the appointments array
//         }
//       },
//       {
//         $sort: { 'appointments.createdAt': -1 } // Sort appointments by createdAt in descending order (most recent first)
//       }
//     ]);

//     // Log the appointments for debugging
//     console.log('Appointments fetched:', appointments);

//     // Return the fetched appointments with doctor details
//     res.json({ result: true, data: appointments });
//   } catch (error) {
//     console.log('Error:', error);
//     res.json({ result: false, message: 'Failed to fetch appointments for the doctor' });
//   }
// };

// exports.getDoctorAppointments = async (req, res) => {
//   try {
//     // Fetch doctorId from the URL params
//     const doctorId = req.params; // doctorId will be in req.params

//     // Convert doctorId to ObjectId
//     const doctorObjectId = new mongoose.Types.ObjectId(doctorId.doctorId);

//     // Fetch appointments for the given doctor
//     const appointments = await Appointment.aggregate([
//       {
//         $match: { doctorId: doctorObjectId } // Match by doctorId (ensure it's ObjectId)
//       },
//       {
//         $lookup: {
//           from: 'users', // The collection name where doctor info is stored
//           localField: 'doctorId', // Field in Appointment collection
//           foreignField: '_id', // Field in User collection (doctor)
//           as: 'doctorDetails' // Alias for the result of the join
//         }
//       },
//       {
//         $unwind: {
//           path: '$doctorDetails', // Unwind the doctorDetails array (so we have doctor details as a single object)
//           preserveNullAndEmptyArrays: true // This will preserve appointments even if doctor details are missing
//         }
//       },
//       {
//         $lookup: {
//           from: 'users', // The collection name where patient info is stored
//           localField: 'patientId', // Field in Appointment collection
//           foreignField: '_id', // Field in User collection (patient)
//           as: 'patientDetails' // Alias for the result of the join
//         }
//       },
//       {
//         $unwind: {
//           path: '$patientDetails', // Unwind the patientDetails array
//           preserveNullAndEmptyArrays: true // This will preserve appointments even if patient details are missing
//         }
//       },
//       {
//         $group: {
//           _id: '$doctorId', // Group by doctorId so doctor details are shown only once
//           doctorDetails: { $first: '$doctorDetails' }, // Get the first doctorDetails as common info
//           appointments: {
//             $push: { // Push all the appointment details into an array
//               _id: '$_id', // Use the proper field name for appointment ID
//               patientId: '$patientId',
//               patientName: '$patientDetails.name', // Patient's name
//               appointmentTime: '$appointmentTime',
//               status: '$status',
//               createdAt: '$createdAt',
//               updatedAt: '$updatedAt'
//             }
//           }
//         }
//       },
//       {
//         $project: {
//           _id: 0, // Remove _id from the grouped result
//           doctorDetails: 1, // Keep doctor details
//           appointments: 1 // Keep the appointments array
//         }
//       },
//       {
//         $sort: { 'appointments.createdAt': -1 } // Sort appointments by createdAt in descending order (most recent first)
//       }
//     ]);

//     // Log the appointments for debugging
//     console.log('Appointments fetched:', appointments);

//     // Return the fetched appointments with doctor and patient details
//     res.json({ result: true, data: appointments });
//   } catch (error) {
//     console.log('Error:', error);
//     res.json({ result: false, message: 'Failed to fetch appointments for the doctor' });
//   }
// }; worked

// exports.getDoctorAppointments = async (req, res) => {
//   try {
//     // Fetch doctorId from the URL params
//     const doctorId = req.params; // doctorId will be in req.params

//     // Convert doctorId to ObjectId
//     const doctorObjectId = new mongoose.Types.ObjectId(doctorId.doctorId);

//     // First, check if doctor exists in the 'users' collection
//     const doctor = await User.findById(doctorObjectId); // Assuming the doctor is in the 'users' collection

//     if (!doctor) {
//       return res.json({
//         result: false,
//         message: 'Doctor not found'
//       });
//     }

//     // Fetch appointments only if the doctor exists
//     const appointments = await Appointment.aggregate([
//       {
//         $match: { doctorId: doctorObjectId } // Match appointments by doctorId (ensure it's ObjectId)
//       },
//       {
//         $lookup: {
//           from: 'users', // The collection name where doctor info is stored
//           localField: 'doctorId', // Field in Appointment collection
//           foreignField: '_id', // Field in User collection (doctor)
//           as: 'doctorDetails' // Alias for the result of the join
//         }
//       },
//       {
//         $unwind: {
//           path: '$doctorDetails', // Unwind the doctorDetails array (so we have doctor details as a single object)
//           preserveNullAndEmptyArrays: true // This will preserve appointments even if doctor details are missing
//         }
//       },
//       {
//         $lookup: {
//           from: 'users', // The collection name where patient info is stored
//           localField: 'patientId', // Field in Appointment collection
//           foreignField: '_id', // Field in User collection (patient)
//           as: 'patientDetails' // Alias for the result of the join
//         }
//       },
//       {
//         $unwind: {
//           path: '$patientDetails', // Unwind the patientDetails array
//           preserveNullAndEmptyArrays: true // This will preserve appointments even if patient details are missing
//         }
//       },
//       {
//         $group: {
//           _id: '$doctorId', // Group by doctorId so doctor details are shown only once
//           doctorDetails: { $first: '$doctorDetails' }, // Get the first doctorDetails as common info
//           appointments: {
//             $push: { // Push all the appointment details into an array
//               _id: '$appointmentId', // Use the proper field name for appointment ID
//               patientId: '$patientId',
//               patientName: '$patientDetails.name', // Patient's name
//               appointmentTime: '$appointmentTime',
//               status: '$status',
//               createdAt: '$createdAt',
//               updatedAt: '$updatedAt'
//             }
//           }
//         }
//       },
//       {
//         $project: {
//           // _id: 1, // Remove _id from the grouped result
//           doctorDetails: 1, // Keep doctor details
//           appointments: { $ifNull: ['$appointments', []] } // Ensure appointments array is always there, even if empty
//         }
//       },
//       {
//         $sort: { 'appointments.createdAt': -1 } // Sort appointments by createdAt in descending order (most recent first)
//       }
//     ]);

//     // Check if appointments exist and send the response accordingly
//     if (appointments.length > 0) {
//       const doctorDetails = appointments[0].doctorDetails;
//       const appointmentData = appointments[0].appointments || [];
//       res.json({
//         result: true,
//         data: [
//           {
//             doctorDetails: doctorDetails,
//             appointments: appointmentData
//           }
//         ]
//       });
//     } else {
//       // If no appointments, just return doctor details
//       res.json({
//         result: true,
//         data: [
//           {
//             doctorDetails: doctor // Return doctor details if no appointments
//           }
//         ]
//       });
//     }
//   } catch (error) {
//     console.log('Error:', error);
//     res.json({ result: false, message: 'Failed to fetch doctor appointments' });
//   }
// };

// exports.getDoctorAppointments = async (req, res) => {
//   try {
//     // Fetch doctorId from the URL params
//     const doctorId = req.params; // doctorId will be in req.params

//     // Convert doctorId to ObjectId
//     const doctorObjectId = new mongoose.Types.ObjectId(doctorId.doctorId);

//     // First, check if doctor exists in the 'users' collection
//     const doctor = await User.findById(doctorObjectId); // Assuming the doctor is in the 'users' collection

//     if (!doctor) {
//       return res.json({
//         result: false,
//         message: 'Doctor not found'
//       });
//     }

//     // Fetch appointments only if the doctor exists
//     const appointments = await Appointment.aggregate([
//       {
//         $match: { doctorId: doctorObjectId } // Match appointments by doctorId (ensure it's ObjectId)
//       },
//       {
//         $lookup: {
//           from: 'users', // The collection name where doctor info is stored
//           localField: 'doctorId', // Field in Appointment collection
//           foreignField: '_id', // Field in User collection (doctor)
//           as: 'doctorDetails' // Alias for the result of the join
//         }
//       },
//       {
//         $unwind: {
//           path: '$doctorDetails', // Unwind the doctorDetails array (so we have doctor details as a single object)
//           preserveNullAndEmptyArrays: true // This will preserve appointments even if doctor details are missing
//         }
//       },
//       {
//         $lookup: {
//           from: 'users', // The collection name where patient info is stored
//           localField: 'patientId', // Field in Appointment collection
//           foreignField: '_id', // Field in User collection (patient)
//           as: 'patientDetails' // Alias for the result of the join
//         }
//       },
//       {
//         $unwind: {
//           path: '$patientDetails', // Unwind the patientDetails array
//           preserveNullAndEmptyArrays: true // This will preserve appointments even if patient details are missing
//         }
//       },
//       {
//         $group: {
//           _id: '$doctorId', // Group by doctorId so doctor details are shown only once
//           doctorDetails: { $first: '$doctorDetails' }, // Get the first doctorDetails as common info
//           appointments: {
//             $push: { // Push all the appointment details into an array
//               _id: '$_id', // Include the _id field from the appointments collection
//               patientId: '$patientId',
//               patientName: '$patientDetails.name', // Patient's name
//               appointmentTime: '$appointmentTime',
//               status: '$status',
//               createdAt: '$createdAt',
//               updatedAt: '$updatedAt'
//             }
//           }
//         }
//       },
//       {
//         $project: {
//           doctorDetails: 1, // Keep doctor details
//           appointments: { $ifNull: ['$appointments', []] } // Ensure appointments array is always there, even if empty
//         }
//       },
//       {
//         $sort: { 'appointments.createdAt': -1 } // Sort appointments by createdAt in descending order (most recent first)
//       }
//     ]);

//     // Check if appointments exist and send the response accordingly
//     if (appointments.length > 0) {
//       const doctorDetails = appointments[0].doctorDetails;
//       const appointmentData = appointments[0].appointments || [];
//       res.json({
//         result: true,
//         data: [
//           {
//             doctorDetails: doctorDetails,
//             appointments: appointmentData
//           }
//         ]
//       });
//     } else {
//       // If no appointments, just return doctor details
//       res.json({
//         result: true,
//         data: [
//           {
//             doctorDetails: doctor // Return doctor details if no appointments
//           }
//         ]
//       });
//     }
//   } catch (error) {
//     console.log('Error:', error);
//     res.json({ result: false, message: 'Failed to fetch doctor appointments' });
//   }
// };

// exports.removeDoctor = async (req, res) => {
//   try {
//     const doctorId = req.params.doctorId; // Assuming doctorId is passed as a URL param
//     console.log("doctorId :", doctorId);

//     // Convert doctorId to ObjectId
//     const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

//     // Step 1: Delete appointments related to the doctor
//     const deletedAppointments = await Appointment.deleteMany({ doctorId: doctorObjectId });

//     if (deletedAppointments.deletedCount === 0) {
//       return res.json({ result: false, message: 'No appointments found for the given doctor' });
//     }

//     // Step 2: Delete doctor details from the User collection
//     const deletedDoctor = await User.findByIdAndDelete(doctorObjectId);

//     if (!deletedDoctor) {
//       return res.json({ result: false, message: 'Doctor not found' });
//     }

//     // Return success response after deleting the doctor and their appointments
//     res.json({ result: true, message: 'Doctor and all related appointments deleted successfully' });
//   } catch (error) {
//     console.log("error:", error);
//     res.json({ result: false, message: 'Failed to delete doctor and appointments' });
//   }
// };

// exports.getDoctorAppointments = async (req, res) => {
//   try {
//     // Fetch doctorId from the URL params
//     const doctorId = req.params; // doctorId will be in req.params

//     // Convert doctorId to ObjectId
//     const doctorObjectId = new mongoose.Types.ObjectId(doctorId.doctorId);

//     // First, check if doctor exists in the 'users' collection
//     const doctor = await User.findById(doctorObjectId); // Assuming the doctor is in the 'users' collection

//     if (!doctor) {
//       return res.json({
//         result: false,
//         message: 'Doctor not found'
//       });
//     }

//     // Fetch appointments only if the doctor exists
//     const appointments = await Appointment.aggregate([
//       {
//         $match: { doctorId: doctorObjectId } // Match appointments by doctorId (ensure it's ObjectId)
//       },
//       {
//         $lookup: {
//           from: 'users', // The collection name where doctor info is stored
//           localField: 'doctorId', // Field in Appointment collection
//           foreignField: '_id', // Field in User collection (doctor)
//           as: 'doctorDetails' // Alias for the result of the join
//         }
//       },
//       {
//         $unwind: {
//           path: '$doctorDetails', // Unwind the doctorDetails array (so we have doctor details as a single object)
//           preserveNullAndEmptyArrays: true // This will preserve appointments even if doctor details are missing
//         }
//       },
//       {
//         $lookup: {
//           from: 'users', // The collection name where patient info is stored
//           localField: 'patientId', // Field in Appointment collection
//           foreignField: '_id', // Field in User collection (patient)
//           as: 'patientDetails' // Alias for the result of the join
//         }
//       },
//       {
//         $unwind: {
//           path: '$patientDetails', // Unwind the patientDetails array
//           preserveNullAndEmptyArrays: true // This will preserve appointments even if patient details are missing
//         }
//       },
//       {
//         $group: {
//           _id: '$doctorId', // Group by doctorId so doctor details are shown only once
//           doctorDetails: { $first: '$doctorDetails' }, // Get the first doctorDetails as common info
//           appointments: {
//             $push: '$$ROOT' // Push all the appointment details into an array
//           }
//         }
//       },
//       {
//         $project: {
//           doctorDetails: 1, // Keep doctor details
//           appointments: { $ifNull: ['$appointments', []] } // Ensure appointments array is always there, even if empty
//         }
//       },
//       {
//         $sort: { 'appointments.createdAt': -1 } // Sort appointments by createdAt in descending order (most recent first)
//       }
//     ]);

//     // Check if appointments exist and send the response accordingly
//     if (appointments.length > 0) {
//       const doctorDetails = appointments[0].doctorDetails;
//       const appointmentData = appointments[0].appointments || [];
//       res.json({
//         result: true,
//         data: [
//           {
//             doctorDetails: doctorDetails,
//             appointments: appointmentData
//           }
//         ]
//       });
//     } else {
//       // If no appointments, just return doctor details
//       res.json({
//         result: true,
//         data: [
//           {
//             doctorDetails: doctor // Return doctor details if no appointments
//           }
//         ]
//       });
//     }
//   } catch (error) {
//     console.log('Error:', error);
//     res.json({ result: false, message: 'Failed to fetch doctor appointments' });
//   }
// };

exports.getDoctorAppointments = async (req, res) => {
  try {
    // Fetch doctorId from the URL params
    const doctorId = req.params.doctorId;

    // Convert doctorId to ObjectId
    const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

    // Fetch appointments for the given doctor
    const appointments = await Appointment.aggregate([
      {
        $match: { doctorId: doctorObjectId } // Match by doctorId (ensure it's ObjectId)
      },
      {
        $lookup: {
          from: 'users', // The collection name where doctor info is stored
          localField: 'doctorId', // Field in Appointment collection
          foreignField: '_id', // Field in User collection (doctor)
          as: 'doctorDetails' // Alias for the result of the join
        }
      },
      {
        $unwind: {
          path: '$doctorDetails', // Unwind the doctorDetails array (so we have doctor details as a single object)
          preserveNullAndEmptyArrays: true // This will preserve appointments even if doctor details are missing
        }
      },
      {
        $lookup: {
          from: 'users', // The collection name where patient info is stored
          localField: 'patientId', // Field in Appointment collection
          foreignField: '_id', // Field in User collection (patient)
          as: 'patientDetails' // Alias for the result of the join
        }
      },
      {
        $unwind: {
          path: '$patientDetails', // Unwind the patientDetails array
          preserveNullAndEmptyArrays: true // This will preserve appointments even if patient details are missing
        }
      },
      {
        $group: {
          _id: '$doctorId', // Group by doctorId so doctor details are shown only once
          doctorDetails: { $first: '$doctorDetails' }, // Get the first doctorDetails as common info
          appointments: {
            $push: { // Push all the appointment details into an array
              _id: '$_id', // Use the proper field name for appointment ID
              patientId: '$patientId',
              patientName: '$patientDetails.name', // Patient's name
              appointmentTime: '$appointmentTime',
              status: '$status',
              createdAt: '$createdAt',
              updatedAt: '$updatedAt'
            }
          }
        }
      },
      {
        $project: {
          _id: 0, // Remove _id from the grouped result
          doctorDetails: 1, // Keep doctor details
          appointments: 1 // Keep the appointments array
        }
      },
      {
        $sort: { 'appointments.createdAt': -1 } // Sort appointments by createdAt in descending order (most recent first)
      }
    ]);

    // If no appointments found, ensure doctor details are still included with an empty appointments array
    if (appointments.length === 0) {
      const doctorDetails = await User.findById(doctorObjectId).lean();
      if (doctorDetails) {
        appointments.push({
          doctorDetails,
          appointments: []
        });
      }
    }

    // Log the appointments for debugging
    console.log('Appointments fetched:', appointments);

    // Return the fetched appointments with doctor and patient details
    res.json({ result: true, data: appointments });
  } catch (error) {
    console.log('Error:', error);
    res.json({ result: false, message: 'Failed to fetch appointments for the doctor' });
  }
};
exports.removeDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId; // Assuming doctorId is passed as a URL param
    console.log("doctorId :", doctorId);

    // Convert doctorId to ObjectId
    const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

    // Step 1: Delete appointments related to the doctor
    await Appointment.deleteMany({ doctorId: doctorObjectId });

    // Step 2: Delete doctor details from the User collection
    const deletedDoctor = await User.findByIdAndDelete(doctorObjectId);

    if (!deletedDoctor) {
      return res.json({ result: false, message: 'Doctor not found' });
    }

    // Return success response after deleting the doctor and their appointments
    res.json({ result: true, message: 'Doctor and all related appointments deleted successfully' });
  } catch (error) {
    console.log("error:", error);
    res.json({ result: false, message: 'Failed to delete doctor and appointments' });
  }
};

exports.editDoctorDetails = async (req, res) => {
  try {
    const doctorId = req.params.doctorId; // Extract doctorId from URL
    const { name, phoneNo, email, specialization, availability, experience, hospital } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.json({ result: false, message: 'Invalid Doctor ID format' });
    }

    // Find the user by ID and update the fields
    const user = await User.findByIdAndUpdate(
      doctorId, // User ID from URL parameter
      {
        name,
        phoneNo,
        email,
        specialization,
        availability,
        experience,
        hospital,
      },
      { new: true, runValidators: true } // Return updated user document with validation
    );

    if (!user) {
      return res.json({ result: false, message: 'User not found' });
    }

    return res.json({ result: true, message: 'User updated successfully', user });
  } catch (error) {
    console.error(error);
    return res.json({ result: false, message: 'Server error', error: error.message });
  }
};


exports.updateDoctorAvailability = async (req, res) => {
  try {
    // Fetch doctorId from the request body or params
    const doctorId = req.params.doctorId;
    const newAvailability = req.body.availability; // Assuming availability is sent in the request body

    // Convert doctorId to ObjectId
    const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

    // Find the doctor by ID and update the availability array
    const updatedDoctor = await User.findByIdAndUpdate(
      doctorObjectId,
      { $addToSet: { availability: { $each: newAvailability } } }, // Add new availability values to the array
      { new: true } // Return the updated document
    );

    // Check if the doctor was found and updated
    if (!updatedDoctor) {
      return res.json({ result: false, message: 'Doctor not found' });
    }

    // Return the updated doctor details
    res.json({ result: true, data: updatedDoctor });
  } catch (error) {
    console.log('Error:', error);
    res.json({ result: false, message: 'Failed to update doctor availability' });
  }
};

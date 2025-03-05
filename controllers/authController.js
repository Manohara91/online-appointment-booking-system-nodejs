// controllers/authController.js
// const User = require('../models/userModel');
// const jwt = require('jsonwebtoken'); // For generating JWT
// const bcrypt = require('bcryptjs');

// // Function for User Registration
// // const registerUser = async (req, res) => {
// //   const { name, email, password, role } = req.body;

// //   // Check if the user already exists
// //   const userExists = await User.findOne({ email });
// //   if (userExists) {
// //     return res.status(400).json({ message: 'User already exists' });
// //   }

// //   // Create a new user
// //   const user = new User({
// //     name,
// //     email,
// //     password,
// //     role,
// //   });

// //   try {
// //     // Save the user to the database
// //     await user.save();

// //     // Generate JWT token
// //     const token = jwt.sign(
// //       { id: user._id, role: user.role },
// //       process.env.JWT_SECRET,
// //       { expiresIn: '1h' } // Token expiration
// //     );

// //     res.status(201).json({ message: 'User registered successfully', token });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: 'Server Error' });
// //   }
// // };

// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');
// const Doctor = require('../models/doctorModel');
// const mongoose = require('mongoose');

// const registerUser = async (req, res) => {
//   const { name, email, password, role } = req.body;

//   // Check if the user already exists
//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     return res.status(400).json({ message: 'User already exists' });
//   }

//   // Create a new user without hashing the password
//   const user = new User({
//     name,
//     email,
//     password, // Store the password as plain text
//     role,
//   });

//   try {
//     // Save the user to the database
//     await user.save();

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' } // Token expiration
//     );

//     res.status(201).json({ message: 'User registered successfully', token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };




// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });
//     console.log("user :", user);
    
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Compare the entered password with the stored password hash
//     const isMatch = await user.matchPassword(password);
//     console.log("isMatch :", isMatch);
    

//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '3h' }
//     );

//     res.status(200).json({ message: 'Login successful', token });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// const registerUser = async (req, res) => {
//   const { name, email, password, role, phone } = req.body;

//   // Check if the user already exists
//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     return res.json({ message: 'User already exists' });
//   }

//   // Create a new user with the plain text password (without hashing)
//   const user = new User({
//     name,
//     email,
//     password, // Store the plain text password
//     role,
//     phone
//   });

//   try {
//     // Save the user to the database
//     await user.save();

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' } // Token expiration
//     );

//     res.json({result:true, message: 'User has been registered successfully', token });
//   } catch (error) {
//     console.error(error);
//     res.json({result:false, message: 'Server Error' });
//   }
// };

// const Counter = require('../models/counter'); // Import the Counter model

// const registerUser = async (req, res) => {
//   const { name, email, password, role } = req.body;

//   // Check if the user already exists
//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     return res.json({ message: 'User already exists' });
//   }

//   // Generate patientId using a counter
//   let patientId;
//   try {
//     const counter = await Counter.findOneAndUpdate(
//       { name: 'patientId' }, // This ensures we are getting the right counter
//       { $inc: { sequenceValue: 1 } }, // Increment the counter by 1
//       { new: true, upsert: true } // Create the counter if it doesn't exist
//     );
//     patientId = counter.sequenceValue; // The incremented patientId
//   } catch (error) {
//     return res.json({ message: 'Error generating patientId', error });
//   }

//   // Create a new user with the plain text password (without hashing)
//   const user = new User({
//     name,
//     email,
//     password, // Store the plain text password
//     role,
//     patientId, // Add the generated patientId
//   });

//   try {
//     // Save the user to the database
//     await user.save();

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' } // Token expiration
//     );

//     res.json({ result: true, message: 'User has been registered successfully', token });
//   } catch (error) {
//     console.error(error);
//     res.json({ result: false, message: 'Server Error' });
//   }
// };

// const registerUser = async (req, res) => {
//   const { name, email, password, role } = req.body;

//   // Check if the user already exists
//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     return res.json({ message: 'User already exists' });
//   }

//   // Create a new user with the plain text password (without hashing)
//   const user = new User({
//     name,
//     email,
//     password, // Store the plain text password
//     role,
//     patientId: new mongoose.Types.ObjectId(), // Using Mongo's ObjectId as a patientId
//   });

//   try {
//     // Save the user to the database
//     await user.save();

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' } // Token expiration
//     );

//     res.json({ result: true, message: 'User has been registered successfully', token });
//   } catch (error) {
//     console.error(error);
//     res.json({ result: false, message: 'Server Error' });
//   }
// };

// const registerUser = async (req, res) => {
//   const { name, email, password, role } = req.body;

//   // Check if the user already exists
//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     return res.json({ message: 'User already exists' });
//   }

//   let patientId;
//   try {
//     const counter = await Counter.findOneAndUpdate(
//       { name: 'patientId' },
//       { $inc: { sequenceValue: 1 } },
//       { new: true, upsert: true }
//     );
//     patientId = counter.sequenceValue; // Ensure patientId is set correctly
//     if (!patientId) {
//       throw new Error('Failed to generate patientId');
//     }
//   } catch (error) {
//     console.error('Error generating patientId:', error);
//     return res.json({ message: 'Error generating patientId', error }); 
//   }

//   // Create a new user with the plain text password (no hashing)
//   const user = new User({
//     name,
//     email,
//     password,
//     role,
//     patientId, // Add the generated patientId
//   });

//   try {
//     // Save the user to the database
//     await user.save();

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.json({ result: true, message: 'User has been registered successfully', token });
//   } catch (error) {
//     console.error('Error saving user:', error);
//     res.json({ result: false, message: 'Server Error', error });
//   }
// };

// const registerUser = async (req, res) => {
//   const { name, email, password, role } = req.body;

//   // Check if the user already exists
//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     return res.json({ message: 'User already exists' });
//   }

//   let patientId;
//   try {
//     // Generate a unique patient ID using Counter
//     const counter = await Counter.findOneAndUpdate(
//       { name: 'patientId' },
//       { $inc: { sequenceValue: 1 } },
//       { new: true, upsert: true }  // If no counter, create one
//     );
//     patientId = counter.sequenceValue;  // Ensure patientId is set correctly

//     if (!patientId) {
//       throw new Error('Failed to generate patientId');
//     }
//   } catch (error) {
//     console.error('Error generating patientId:', error);
//     return res.json({ message: 'Error generating patientId', error });
//   }

//   // Create the new user with the patientId
//   const user = new User({
//     name,
//     email,
//     password,
//     role,
//     patientId, // Add the generated patientId
//   });

//   try {
//     // Save the user to the database
//     await user.save();

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.json({ result: true, message: 'User has been registered successfully', token });
//   } catch (error) {
//     console.error('Error saving user:', error);
//     res.json({ result: false, message: 'Server Error', error });
//   }
// };


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const mongoose = require('mongoose');

const registerUser = async (req, res) => {
  const { name, email, password, role, phoneNo, age, address } = req.body;

  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.json({ message: 'User already exists' });
  }

  // Create a new user with the plain text password (without hashing)
  const user = new User({
    name,
    email,
    password, // Store the plain text password
    role,
    phoneNo: phoneNo,
    age: age,
    address: address
  });

  try {
    // Save the user to the database
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expiration
    );

    res.json({ result: true, message: 'User has been registered successfully', token });
  } catch (error) {
    console.error(error);
    res.json({ result: false, message: 'Server Error' });
  }
};



const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({result:false, message: 'Invalid credentials' });
    }

    // Compare the entered password with the stored plain text password
    if (user.password !== password) {
      return res.json({result:false, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );

    res.json({result:true, message: 'User has been logged in successfully', token });
  } catch (error) {
    console.error('Login error:', error);
    res.json({result:false, message: 'Server Error' });
  }
};








module.exports = {
  registerUser,
  loginUser,
};

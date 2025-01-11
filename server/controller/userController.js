const User = require("../model/userModel");
const asyncHandler = require('express-async-handler');
const generateToken = require("../utils");
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');

// Register User
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    } else if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    } else if (password.length > 20) {
      return res.status(400).json({ message: "Password must not be up to 20 characters" });
    }
     // check if user already exists
        
     const userExists = await User.findOne({ email })
     if(userExists) {
         return res.status(400).json({message: 'Email aleady exists'});
     }

     const user = await User.create({firstName, lastName, email, password})
     const token = generateToken(user._id);

     res.cookie('token', token, {
         path: '/',
         httpOnly: true,
         expires: new Date(Date.now() + 1000 * 86400),   //expires within 24hrs
         sameSite: 'none',
         secure: true
     })

     // Send a success response with user details and token
     if(user) {
         const { _id, firstName, lastName, email } = user;
         res.status(201).json({_id, firstName, lastName, email})
     } else {
         console.log(error);
        res.status(400).json({ message: "Invalid Data" });
     }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// uploading/updating a user's profile picture
const uploadProfilePicture = asyncHandler(async (req, res) => {
  try {
      const userId = req.params.userId;

      // Find the user
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Update the profile picture
      user.profilePicture = {
          image: req.file.buffer,       // Save binary data
          contentType: req.file.mimetype // Save MIME type
      };

      await user.save();
      res.status(200).json({message: 'Profile picture updated successfully' });
  } catch (err) {
      res.status(500).json({error: err.message });
  }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  try {
    const {email, password} = req.body;
    let user = await User.findOne({email})

    // Check if the admin exists
    if(!user) {
        return res.status(404).json({message: 'User Not Found!'})
    }
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return res.status(400).json({message: 'Invalid Credentials'})
    }

    const token = generateToken(user._id);
    res.cookie('token', token, {
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),   //expires within 24hrs
        sameSite: 'none',
        secure: true
    })

    const {_id, firstName, lastName} = user;
    res.status(201).json({_id, firstName, lastName, email, token})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get User 
const getUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;  // Get ID from authenticated user
    const user = await User.findById(userId);
    
    if(!user) {
      return res.status(404).json({message: 'User Not Found!'})
    }
    
    const {_id, firstName, lastName, email} = user;
    return res.status(200).json({_id, firstName, lastName, email});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Internal Server Error'})
  }
});

// Update User
const updateUser = asyncHandler(async(req, res) => {
  try {
    const userId = req.userId;  // Get ID from authenticated user
    const {firstName, lastName, password} = req.body;
    
    const user = await User.findById(userId);
    if(!user) {
      return res.status(404).json({message: 'User not found'})
    }
    
    // Update only if it's the same user
    if(user._id.toString() !== userId) {
      return res.status(403).json({message: 'Not authorized to update this user'});
    }
    
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.password = password || user.password;

    await user.save();
    res.status(200).json(user);
  } catch(error) {
    console.error(error);
    res.status(500).json({message: 'Internal Server Error'})
  }
});

// DeleteUser

const deleteUser = asyncHandler(async(req, res) => {
  try {
    const userId = req.userId;  // Get ID from authenticated user
    const user = await User.findById(userId);
    
    if(!user) {
      return res.status(404).json({message: 'User not found'})
    }
    
    // Delete only if it's the same user
    if(user._id.toString() !== userId) {
      return res.status(403).json({message: 'Not authorized to delete this user'});
    }
    
    await user.deleteOne();
    res.status(200).json({message: 'User deleted successfully'})
  } catch(error) {
    console.error(error);
    res.status(500).json({message: 'Internal Server Error'})
  }
});

//logOutUser
const logoutUser = asyncHandler(async(req, res) => {
  res.cookie('token', '', {
      path: '/',
      httpOnly: true,
      expires: new Date(0),  
      sameSite: 'none',
      secure: true
  })
  return res.status(200).json({message: 'Logout Successful'})
})

// Rate limiting is a security measure that controls how many requests a user (identified by IP address or other identifiers) can make to your API within a specific time window.

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

module.exports = { registerUser, uploadProfilePicture, loginUser, logoutUser, getUser, deleteUser, updateUser, limiter };
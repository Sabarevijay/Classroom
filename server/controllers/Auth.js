import UserModel from "../models/user.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Function to validate email domain
const validateEmailDomain = (email) => {
  const domain = email.substring(email.lastIndexOf('@') + 1);
  return domain.toLowerCase() === 'bitsathy.ac.in';
};

// Function to determine role based on email
const determineRole = (email) => {
  const charBeforeAt = email.charAt(email.indexOf('@') - 1);
  if (/[a-zA-Z]/.test(charBeforeAt)) {
    return 'admin';
  } else if (/[0-9]/.test(charBeforeAt)) {
    return 'user';
  }
  return 'user'; // Default role if condition doesn't match
};

const Register = async (req, res) => {
  try {
    const { Register, email, password } = req.body;
    if (!Register || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate email domain
    if (!validateEmailDomain(email)) {
      return res.status(400).json({
        success: false,
        message: "Email must belong to bitsathy.ac.in domain",
      });
    }

    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return res.status(409).json({
        success: false,
        message: "User Already Exists",
      });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    
    // Determine role based on email
    const role = determineRole(email);

    const NewUser = new UserModel({
      Register,
      email,
      password: hashedPassword,
      role, // Assign role
    });
    await NewUser.save();
    return res.status(201).json({
      success: true,
      message: "User Registered successfully",
      user: {
        email: NewUser.email,
        role: NewUser.role
      },
    });
  } catch (error) {
    console.log('Register error:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate email domain
    if (!validateEmailDomain(email)) {
      return res.status(400).json({
        success: false,
        message: "Email must belong to bitsathy.ac.in domain",
      });
    }

    const FindUser = await UserModel.findOne({ email });
    if (!FindUser) {
      return res.status(400).json({
        success: false,
        message: "No user found",
      });
    }

    // Verify role consistency
    const expectedRole = determineRole(email);
    if (FindUser.role !== expectedRole) {
      return res.status(403).json({
        success: false,
        message: "Role mismatch. Please contact support.",
      });
    }

    const comparePassword = await bcryptjs.compare(password, FindUser.password);
    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: FindUser._id, email: FindUser.email, role: FindUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { 
        email: FindUser.email,
        role: FindUser.role
      },
      token,
    });
  } catch (error) {
    console.log('Login error:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const Logout = async (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.log('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No user ID found in token",
      });
    }

    const user = await UserModel.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('getUsers error:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, sub: googleId } = ticket.getPayload();

    // Validate email domain
    if (!validateEmailDomain(email)) {
      return res.status(400).json({
        success: false,
        message: "Email must belong to bitsathy.ac.in domain",
      });
    }

    let role = 'user';
    const charBeforeAt = email.charAt(email.indexOf('@') - 1);
    if (/[a-zA-Z]/.test(charBeforeAt)) {
      role = 'admin';
    } else if (/[0-9]/.test(charBeforeAt)) {
      role = 'user';
    }

    let user = await UserModel.findOne({ email });
    if (!user) {
      user = new UserModel({
        googleId,
        email,
        name,
        role,
      });
      await user.save();
    }

    const jwtToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const redirectUrl = role === 'admin' ? '/home' : '/home';
    res.status(200).json({
      success: true,
      message: "Google Login successful",
      user: { email: user.email, role: user.role },
      token: jwtToken,
      redirectUrl,
    });
  } catch (error) {
    console.error('googleLogin error:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export { Register, Login, Logout, getUsers, googleLogin };
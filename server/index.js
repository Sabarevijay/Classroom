import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import DBcon from "./utils/db.js";
import AuthRoutes from "./routes/Auth.js";
import ClassRoutes from "./routes/Class.js";
import OTPRoutes from "./routes/otp.js";
import AttendanceRoutes from "./routes/attendance.js";
import cors from 'cors';
import StudentRoutes from "./routes/students.js";
import path from 'path';
import QuizRoutes from "./routes/Quiz.js";
import FacultyClassRoutes from "./routes/faculty.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// MongoDB connection and GridFS setup
let gridfsBucket;

// Call DBcon to establish the MongoDB connection
DBcon().catch((error) => {
  console.error('Failed to connect to MongoDB:', error);
  process.exit(1); // Exit the process if MongoDB connection fails
});

// Wait for the MongoDB connection to be established before initializing GridFS
mongoose.connection.on('connected', () => {
  console.log('MongoDB is Connected');
  // Initialize GridFSBucket after connection is established
  try {
    gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'fs', // Name of the GridFS bucket (fs.files and fs.chunks collections)
    });
    console.log('GridFS initialized');
  } catch (error) {
    console.error('Failed to initialize GridFS:', error);
    process.exit(1); // Exit the process if GridFS initialization fails
  }
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1); // Exit the process if MongoDB connection fails
});

const allowedOrigins = [
  'http://localhost:5173',
  'http://10.70.2.38',
  'https://classroom.bitsathy.ac.in',
  'https://classroom-lime-mu.vercel.app',
  'https://classroom-798mphos9-sabarevijays-projects.vercel.app',
  'https://accounts.google.com'
];

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: (origin, callback) => {
    const normalizedOrigin = origin && origin.endsWith('/') ? origin.slice(0, -1) : origin;
    if (!origin || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  req.gridfsBucket = gridfsBucket; // Attach gridfsBucket to req for use in controllers
  next();
});

// Serve static files for images and quizzes (optional, only if needed for other static assets)
app.use('/images', express.static(path.join(path.resolve(), 'public/images')));
app.use('/quizzes', express.static(path.join(path.resolve(), 'public/quizzes')));

app.get("/", (req, res) => {
  res.send("Hello from classroom backend");
});

app.use('/auth', AuthRoutes);
app.use('/class', ClassRoutes);
app.use('/quizes', QuizRoutes);
app.use('/otp', OTPRoutes);
app.use('/attendance', AttendanceRoutes);
app.use('/students', StudentRoutes);
app.use('/facultyclass', FacultyClassRoutes);

const server = app.listen(PORT, () => {
  console.log(`App is Running on the Port ${PORT}`);
});

server.setTimeout(300000); // Set timeout to 300 seconds (5 minutes)
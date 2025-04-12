// import express from "express";
// import dotenv from "dotenv";
// import DBcon from "./utils/db.js";
// import AuthRoutes from "./routes/Auth.js";
// import ClassRoutes from "./routes/Class.js";
// import OTPRoutes from "./routes/otp.js";
// import AttendanceRoutes from "./routes/attendance.js";
// import cors from 'cors';
// import StudentRoutes from "./routes/students.js";
// import path from 'path'; 
// import QuizRoutes from "./routes/Quiz.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 8000;

// DBcon();

// const allowedOrigins = [
//     'http://localhost:5173',
//     'https://classroom-lime-mu.vercel.app',
//     'https://classroom-798mphos9-sabarevijays-projects.vercel.app', 
//     'https://accounts.google.com' 
// ];

// app.use(express.json());
// app.use(cors({
//     origin: (origin, callback) => {
//         const normalizedOrigin = origin && origin.endsWith('/') ? origin.slice(0, -1) : origin;
//         if (!origin || allowedOrigins.includes(normalizedOrigin)) {
//             callback(null, true);
//         } else {
//             // console.log(`Blocked by CORS: ${origin}`);
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true,
// }));

// app.use((req, res, next) => {
//     res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
//     next();
// });

// // Serve static files for images and quizzes
// app.use('/images', express.static(path.join(path.resolve(), 'public/images')));
// app.use('/quizzes', express.static(path.join(path.resolve(), 'public/quizzes')));

// app.get("/", (req, res) => {
//     res.send("Hello from classroom backend");
// });

// app.use('/auth', AuthRoutes);
// app.use('/class', ClassRoutes);
// app.use('/quizes', QuizRoutes);
// // Includes quiz routes
// app.use('/otp', OTPRoutes);
// app.use('/attendance', AttendanceRoutes);
// app.use('/students', StudentRoutes);

// app.listen(PORT, () => {
//     console.log(`App is Running on the Port ${PORT}`);
// });



import express from "express";
import dotenv from "dotenv";
import DBcon from "./utils/db.js";
import AuthRoutes from "./routes/Auth.js";
import ClassRoutes from "./routes/Class.js";
import OTPRoutes from "./routes/otp.js";
import AttendanceRoutes from "./routes/attendance.js";
import cors from 'cors';
import StudentRoutes from "./routes/students.js";
import QuizRoutes from "./routes/Quiz.js";
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import upload from './middleware/Multer.js';
import fs from 'fs';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://classroom-lime-mu.vercel.app',
      'https://classroom-798mphos9-sabarevijays-projects.vercel.app',
      'https://accounts.google.com'
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 8000;

const imagesDir = path.join(path.resolve(), 'public/images');
const quizzesDir = path.join(path.resolve(), 'public/quizzes');
fs.mkdirSync(imagesDir, { recursive: true });
fs.mkdirSync(quizzesDir, { recursive: true });

DBcon();

const allowedOrigins = [
  'http://localhost:5173',
  'https://classroom-lime-mu.vercel.app',
  'https://classroom-798mphos9-sabarevijays-projects.vercel.app',
  'https://accounts.google.com'
];

app.use(express.json());
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
  req.io = io; // Attach io to req for use in controllers
  next();
});

app.use('/images', express.static(path.join(path.resolve(), 'public/images')));
app.use('/quizzes', express.static(path.join(path.resolve(), 'public/quizzes')));

app.get("/", (req, res) => {
  res.send("Hello from classroom backend");
});

app.use('/auth', AuthRoutes);
app.use('/class', ClassRoutes);
app.use('/quizes', QuizRoutes(upload));
app.use('/otp', OTPRoutes);
app.use('/attendance', AttendanceRoutes);
app.use('/students', StudentRoutes);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinClass', ({ classId, userEmail }) => {
    socket.join(classId);
    console.log(`User ${userEmail} with socket ${socket.id} joined classroom: ${classId}`);
  });

  socket.on('joinQuiz', ({ quizId, classId, userEmail }) => {
    socket.join(quizId); // Join quiz-specific room
    console.log(`User ${userEmail} with socket ${socket.id} joined quiz: ${quizId} in class: ${classId}`);
  });

  socket.on('requestCurrentQuestion', ({ quizId, classId }) => {
    console.log(`User with socket ${socket.id} requested current question for quiz: ${quizId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`App is Running on the Port ${PORT}`);
});
import express from "express";
import upload from "../middleware/Multer.js";
import authMiddleware from "../middleware/Authmiddleware.js";
import { createQuiz, deleteQuiz, downloadQuiz, getQuizzes, scheduleQuiz, startQuiz, submitQuiz } from "../controllers/Quiz.js";

const QuizRoutes = express.Router();
QuizRoutes.post('/quiz/create', upload.array('questionImage',10), createQuiz); // Use upload.array to handle multiple images dynamically
QuizRoutes.get('/quiz/:id', getQuizzes);
QuizRoutes.post('/quiz/start/:id', startQuiz);
QuizRoutes.post('/quiz/schedule/:id', scheduleQuiz);
QuizRoutes.post('/quiz/delete/:id', deleteQuiz);
QuizRoutes.get('/quiz/download/:id', downloadQuiz);
QuizRoutes.post('/quiz/submit/:id', authMiddleware, submitQuiz);
export default QuizRoutes;


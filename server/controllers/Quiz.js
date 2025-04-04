import QuizModel from "../models/QuizModel.js";
import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit";
import StudentsModel from "../models/students.js";

const createQuiz = async (req, res) => {
    try {
      console.log('Raw req.body:', req.body);
      const { title, classId, questions } = req.body;
  
      if (!title || !classId) {
        console.log('Validation failed: Title or classId missing', { title, classId });
        return res.status(400).json({ success: false, message: "Title and classId are required" });
      }
  
      // Parse questions if it’s a JSON string
      let parsedQuestions;
      if (typeof questions === 'string') {
        try {
          parsedQuestions = JSON.parse(questions);
        } catch (e) {
          console.log('Failed to parse questions JSON:', e);
          return res.status(400).json({ success: false, message: "Invalid questions format" });
        }
      } else {
        parsedQuestions = questions; // Handle case where it’s already an array (unlikely with current frontend)
      }
  
      // Validate parsed questions
      if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
        console.log('Validation failed: No valid questions provided', { parsedQuestions });
        return res.status(400).json({ success: false, message: "At least one question is required" });
      }
  
      let fileIndex = 0;
      const finalQuestions = parsedQuestions.map((q, i) => {
        const image = req.files && req.files[fileIndex] && req.files[fileIndex].fieldname === 'questionImage'
          ? req.files[fileIndex++].filename
          : null;
  
        const options = Array.isArray(q.options) ? q.options.map(opt => ({
          text: opt.text,
          isCorrect: opt.isCorrect === 'true' || opt.isCorrect === true
        })) : [];
  
        return {
          image,
          text: q.text,
          options,
          marks: parseInt(q.marks) || 1,
          timeLimit: q.timeLimit ? parseInt(q.timeLimit) : null
        };
      });
  
      console.log('Parsed questions:', finalQuestions);
  
      if (finalQuestions.some(q => !q.text || q.options.length < 2)) {
        console.log('Validation failed: Invalid question data');
        return res.status(400).json({ success: false, message: "Each question must have text and at least two options" });
      }
  
      const totalMarks = finalQuestions.reduce((sum, q) => sum + (q.marks || 0), 0);
      const quiz = await QuizModel.create({ title, classId, questions: finalQuestions, totalMarks });
      res.status(201).json({ success: true, quiz });
    } catch (error) {
      console.error('Error creating quiz:', error.stack);
      res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
  };

  
  const getQuizzes = async (req, res) => {
    try {
      const { id } = req.params;
      const quizzes = await QuizModel.find({ classId: id });
      const students = await StudentsModel.find({ ClassId: id });
      const totalStudents = students.length;
      const quizStats = quizzes.map(quiz => ({
        ...quiz._doc,
        totalStudents,
        attended: quiz.submissions.length,
        notAttended: totalStudents - quiz.submissions.length
      }));
      res.status(200).json({ success: true, quizzes: quizStats });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  const startQuiz = async (req, res) => {
    try {
      const { id } = req.params;
      await QuizModel.findByIdAndUpdate(id, { started: true });
      res.status(200).json({ success: true, message: "Quiz started" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  const scheduleQuiz = async (req, res) => {
    try {
      const { id } = req.params;
      const { startTime, endTime } = req.body;
      await QuizModel.findByIdAndUpdate(id, { startTime, endTime });
      res.status(200).json({ success: true, message: "Quiz scheduled" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  const deleteQuiz = async (req, res) => {
    try {
      const { id } = req.params;
      await QuizModel.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: "Quiz deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  const downloadQuiz = async (req, res) => {
    try {
      const { id } = req.params;
      const quiz = await QuizModel.findById(id);
      if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });
  
      const doc = new PDFDocument();
      const fileName = `${quiz.title.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
      const filePath = path.join(path.resolve(), "public", "quizzes", fileName);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);
  
      doc.fontSize(20).text(quiz.title, { align: 'center' });
      quiz.questions.forEach((q, i) => {
        doc.moveDown();
        doc.fontSize(14).text(`Q${i + 1}: ${q.text} (${q.marks} marks)`);
        if (q.image) {
          const imagePath = path.join(path.resolve(), "public", "images", q.image);
          if (fs.existsSync(imagePath)) {
            doc.image(imagePath, { width: 200 });
          } else {
            doc.text("(Image not found)");
          }
        }
        q.options.forEach((opt, j) => {
          doc.fontSize(12).text(`${j + 1}. ${opt.text} ${opt.isCorrect ? '(Correct)' : ''}`);
        });
      });
      doc.end();
  
      stream.on('finish', () => {
        res.download(filePath, fileName, (err) => {
          if (err) {
            console.error("Download error:", err);
            res.status(500).json({ success: false, message: "Error downloading file" });
          }
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error("Error deleting file:", unlinkErr);
          });
        });
      });
    } catch (error) {
      console.error("Download error:", error);
      res.status(500).json({ success: false, message: "Error generating quiz PDF" });
    }
  };
  
  const submitQuiz = async (req, res) => {
    try {
      const { id } = req.params;
      const { answers, feedback } = req.body;
      const quiz = await QuizModel.findById(id);
      let mark = 0;
      quiz.questions.forEach((q, i) => {
        if (answers[i] === q.options.find(opt => opt.isCorrect)?.text) mark += q.marks;
      });
      quiz.submissions.push({ user: req.user.email, answers, mark, feedback });
      await quiz.save();
      res.status(200).json({ success: true, mark });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  export {
    createQuiz, getQuizzes, startQuiz, scheduleQuiz, deleteQuiz, downloadQuiz, submitQuiz
  };
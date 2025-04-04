import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  questions: [{
    image: { type: String },
    text: { type: String, required: true },
    options: [{ text: { type: String, required: true }, isCorrect: { type: Boolean, required: true } }],
    marks: { type: Number, required: true },
    timeLimit: { type: Number }
  }],
  totalMarks: { type: Number },
  started: { type: Boolean, default: false },
  startTime: { type: Date },
  endTime: { type: Date },
  submissions: [{
    user: { type: String },
    answers: [{ type: String }],
    mark: { type: Number },
    feedback: { type: String }
  }]
}, { timestamps: true });

const QuizModel = mongoose.model('Quiz', quizSchema);
export default QuizModel;
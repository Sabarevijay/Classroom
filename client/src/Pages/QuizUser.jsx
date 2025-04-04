import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SecondNavUs from '../Components/SecondNavUs';
import { classGet, classPost } from '../services/Endpoint';
import toast from 'react-hot-toast';

const styles = `
  .page-container { 
    background-color: #d3d8e0; 
    min-height: 100vh; 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    padding: 20px; 
  }
  .card-container { 
    background-color: #fff; 
    border-radius: 1rem; 
    box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
    width: 100%; 
    max-width: 700px; 
    padding: 0 2rem 2rem; 
    margin-top: 1rem; 
    display: flex; 
    flex-direction: column; 
    gap: 1.5rem; 
  }
  .second-nav { 
    background-color: #fff; 
    border-top-left-radius: 1rem; 
    border-top-right-radius: 1rem; 
    padding: 0rem 0; 
    margin: 0 -2rem; 
  }
  .class-name { 
    font-size: 2.5rem; 
    font-weight: 800; 
    color: #6b48ff; 
    text-align: center; 
  }
  .section-title { 
    font-size: 1.5rem; 
    font-weight: 700; 
    color: #000; 
    margin-bottom: 1.5rem; 
    text-align: center; 
  }
  .quiz-card { 
    border: 1px solid #e5e7eb; 
    padding: 1rem; 
    border-radius: 0.5rem; 
    margin: 0.5rem 0; 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    background-color: #f9fafb; 
  }
  .action-button { 
    padding: 0.3rem 0.8rem; 
    border-radius: 0.3rem; 
    border: none; 
    cursor: pointer; 
    margin-left: 0.5rem; 
    background-color: #6b48ff; 
    color: #fff; 
    font-weight: 600; 
  }
  .timer { 
    font-size: 1rem; 
    color: #f44336; 
  }
  .flag-button { 
    background-color: #ff9800; 
    color: #fff; 
    padding: 0.2rem 0.5rem; 
    border-radius: 0.3rem; 
  }
  .spinner { 
    width: 4rem; 
    height: 4rem; 
    border: 4px solid #6b48ff; 
    border-top: 4px solid transparent; 
    border-radius: 50%; 
    animation: spin 1s linear infinite; 
  }
  @keyframes spin { 
    0% { transform: rotate(0deg); } 
    100% { transform: rotate(360deg); } 
  }
  .question-container { 
    margin-top: 1rem; 
    padding: 1rem; 
    border: 1px solid #e5e7eb; 
    border-radius: 0.5rem; 
    background-color: #f9fafb; 
  }
  .option-container { 
    display: flex; 
    align-items: center; 
    gap: 0.5rem; 
    margin-bottom: 0.5rem; 
  }
  .button-row { 
    display: flex; 
    justify-content: space-between; 
    margin-top: 1rem; 
  }
`;

const QuizUser = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classResponse = await classGet(`/class/getclass/${id}`);
        const quizResponse = await classGet(`/quizes/quiz/${id}`);
        setClassData(classResponse.data.classData);
        setQuizzes(quizResponse.data.quizzes || []);
      } catch (error) {
        toast.error('Failed to load data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (activeQuiz && activeQuiz.questions && activeQuiz.questions[currentQuestionIndex]?.timeLimit) {
      setTimeLeft(activeQuiz.questions[currentQuestionIndex].timeLimit);
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setCurrentQuestionIndex(Math.min(activeQuiz.questions.length - 1, currentQuestionIndex + 1));
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeQuiz, currentQuestionIndex]);

  const handleAttendQuiz = (quiz) => {
    const canStart = quiz.started || (quiz.startTime && new Date(quiz.startTime) <= new Date());
    if (!canStart) {
      toast.error('Quiz has not started yet');
      return;
    }
    if (!quiz.questions || quiz.questions.length === 0) {
      toast.error('Quiz has no questions');
      return;
    }
    setActiveQuiz(quiz);
    setAnswers({});
    setFlaggedQuestions([]);
    setCurrentQuestionIndex(0);
  };

  const handleSubmitQuiz = async () => {
    try {
      const response = await classPost(`/quizes/quiz/submit/${activeQuiz._id}`, { answers, feedback });
      setQuizzes(quizzes.map(q => q._id === activeQuiz._id ? { ...q, resultMark: response.data.mark } : q));
      setActiveQuiz(null);
      setFeedback('');
      toast.success('Quiz submitted successfully');
    } catch (error) {
      toast.error('Failed to submit quiz');
    }
  };

  const toggleFlag = (index) => {
    setFlaggedQuestions(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-screen"><div className="spinner"></div></div>;

  return (
    <div className="page-container">
      <style>{styles}</style>
      <div className="card-container">
        <div className="second-nav"><SecondNavUs classId={id} /></div>
        <h2 className="class-name">{classData?.ClassName || 'No class data'}</h2>
        <div className="content-container">
          <h3 className="section-title">Quizzes</h3>
          {quizzes.map(quiz => (
            <div key={quiz._id} className="quiz-card">
              <span>
                {quiz.title} - {quiz.startTime ? new Date(quiz.startTime).toLocaleString() : 'Not Started'} - 
                {quiz.questions?.length || 0} Questions - {quiz.totalMarks || 0} Marks 
                {quiz.resultMark !== undefined ? `- Result: ${quiz.resultMark}` : ''}
              </span>
              <button className="action-button" onClick={() => handleAttendQuiz(quiz)}>Attend Quiz</button>
            </div>
          ))}
          {activeQuiz && activeQuiz.questions && activeQuiz.questions.length > 0 && (
            <div className="question-container">
              <h4>{activeQuiz.questions[currentQuestionIndex]?.text || 'No question available'}</h4>
              {activeQuiz.questions[currentQuestionIndex]?.image && (
                <img 
                  src={`${import.meta.env.VITE_SERVER_APP_URL}/images/${activeQuiz.questions[currentQuestionIndex].image}`} 
                  alt="Question" 
                  style={{ maxWidth: '100%', margin: '1rem 0' }} 
                />
              )}
              {activeQuiz.questions[currentQuestionIndex]?.timeLimit && (
                <div className="timer">Time Left: {timeLeft}s</div>
              )}
              {activeQuiz.questions[currentQuestionIndex]?.options?.map((opt, i) => (
                <div key={i} className="option-container">
                  <input 
                    type="radio" 
                    name={`q${currentQuestionIndex}`} 
                    checked={answers[currentQuestionIndex] === opt.text} 
                    onChange={() => setAnswers({ ...answers, [currentQuestionIndex]: opt.text })} 
                  />
                  <span>{opt.text}</span>
                </div>
              ))}
              {/* <button 
                className="flag-button" 
                onClick={() => toggleFlag(currentQuestionIndex)}
              >
                {flaggedQuestions.includes(currentQuestionIndex) ? 'Unflag' : 'Flag'}
              </button> */}
              <div className="button-row">
                <div>
                  <button 
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))} 
                    disabled={currentQuestionIndex === 0}
                    className="action-button"
                  >
                    Previous
                  </button>
                  <button 
                    onClick={() => setCurrentQuestionIndex(Math.min(activeQuiz.questions.length - 1, currentQuestionIndex + 1))} 
                    disabled={currentQuestionIndex === activeQuiz.questions.length - 1}
                    className="action-button"
                  >
                    Next
                  </button>
                </div>
                <button onClick={handleSubmitQuiz} className="action-button">Submit Quiz</button>
              </div>
              <textarea 
                value={feedback} 
                onChange={e => setFeedback(e.target.value)} 
                placeholder="Feedback" 
                style={{ width: '100%', padding: '0.5rem', marginTop: '1rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizUser;
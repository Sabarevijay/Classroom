import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SecondNav from '../Components/SecondNav';
import { classGet, classPost, downloadFile } from '../services/Endpoint';
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
  .quiz-card:hover { 
    background-color: #f1f5f9; 
  }
  .form-modal { 
    position: fixed; 
    top: 50%; 
    left: 50%; 
    transform: translate(-50%, -50%); 
    background-color: #fff; 
    padding: 2rem; 
    border-radius: 1rem; 
    box-shadow: 0 0 15px rgba(0,0,0,0.3); 
    z-index: 1000; 
    width: 90%; 
    max-width: 600px; 
    max-height: 80vh; 
    overflow-y: auto; 
  }
  .form-modal h3 { 
    font-size: 1.5rem; 
    font-weight: 600; 
    color: #333; 
    margin-bottom: 1rem; 
  }
  .form-input { 
    width: 100%; 
    padding: 0.75rem; 
    border: 1px solid #d1d5db; 
    border-radius: 0.5rem; 
    margin-bottom: 1rem; 
    font-size: 1rem; 
    color: #333; 
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.1); 
  }
  .form-input:focus { 
    outline: none; 
    border-color: #6b48ff; 
    box-shadow: 0 0 0 3px rgba(107, 72, 255, 0.2); 
  }
  .form-input::placeholder { 
    color: #999; 
  }
  .form-button { 
    padding: 0.5rem 1rem; 
    background-color: #6b48ff; 
    color: #fff; 
    border: none; 
    border-radius: 0.5rem; 
    cursor: pointer; 
    font-weight: 600; 
    margin: 0.5rem; 
  }
  .form-button:hover { 
    background-color: #5a3de6; 
  }
  .action-button { 
    padding: 0.3rem 0.8rem; 
    border-radius: 0.3rem; 
    border: none; 
    cursor: pointer; 
    margin-left: 0.5rem; 
    font-weight: 600; 
  }
  .start-button { 
    background-color: #4CAF50; 
    color: #fff; 
  }
  .delete-button { 
    background-color: #f44336; 
    color: #fff; 
  }
  .download-button { 
    background-color: #2196F3; 
    color: #fff; 
  }
  .schedule-button { 
    background-color: #ff9800; 
    color: #fff; 
  }
  .feedback-card { 
    border: 1px solid #e5e7eb; 
    padding: 1rem; 
    border-radius: 0.5rem; 
    margin-top: 1rem; 
    background-color: #f9fafb; 
  }
  .feedback-card h4 { 
    font-size: 1.2rem; 
    font-weight: 600; 
    color: #333; 
    margin-bottom: 1rem; 
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
  .schedule-modal { 
    position: fixed; 
    top: 50%; 
    left: 50%; 
    transform: translate(-50%, -50%); 
    background-color: #fff; 
    padding: 2rem; 
    border-radius: 1rem; 
    box-shadow: 0 0 15px rgba(0,0,0,0.3); 
    z-index: 1000; 
    width: 90%; 
    max-width: 400px; 
  }
  .question-section { 
    border: 1px solid #e5e7eb; 
    padding: 1rem; 
    border-radius: 0.5rem; 
    margin-bottom: 1rem; 
    background-color: #f9fafb; 
  }
  .question-section h4 { 
    font-size: 1.2rem; 
    font-weight: 600; 
    color: #333; 
    margin-bottom: 0.5rem; 
  }
`;

const QuizAdmin = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleQuizId, setScheduleQuizId] = useState(null);
  const [scheduleData, setScheduleData] = useState({ startTime: '', endTime: '' });
  const [quizForm, setQuizForm] = useState({ 
    title: '', 
    questions: [{ image: null, text: '', options: [{ text: '', isCorrect: false }], marks: 1, timeLimit: null }] 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classResponse = await classGet(`/class/getclass/${id}`);
        const quizResponse = await classGet(`/quizes/quiz/${id}`);
        setClassData(classResponse.data.classData);
        setQuizzes(quizResponse.data.quizzes || []);
      } catch (error) {
        console.error('Error creating quiz:', error);
        // toast.error('Failed to load data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const validateForm = () => {
    if (!quizForm.title.trim()) {
      toast.error('Quiz title is required');
      return false;
    }
    for (let i = 0; i < quizForm.questions.length; i++) {
      const q = quizForm.questions[i];
      if (!q.text.trim()) {
        toast.error(`Question ${i + 1} text is required`);
        return false;
      }
      if (q.options.length < 2) {
        toast.error(`Question ${i + 1} must have at least 2 options`);
        return false;
      }
      if (!q.options.some(opt => opt.isCorrect)) {
        toast.error(`Question ${i + 1} must have at least one correct option`);
        return false;
      }
      if (!q.marks || q.marks <= 0) {
        toast.error(`Question ${i + 1} must have a valid mark (greater than 0)`);
        return false;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].text.trim()) {
          toast.error(`Option ${j + 1} in Question ${i + 1} is required`);
          return false;
        }
      }
    }
    return true;
  };

  const handleCreateQuiz = async () => {
    if (!validateForm()) return;
  
    try {
      const formData = new FormData();
      formData.append('title', quizForm.title);
      formData.append('classId', id);
      const questionsData = quizForm.questions.map((q, i) => ({
        text: q.text,
        marks: q.marks,
        timeLimit: q.timeLimit || null,
        options: q.options
      }));
      formData.append('questions', JSON.stringify(questionsData));
      quizForm.questions.forEach((q, i) => {
        if (q.image) formData.append(`questionImage${i}`, q.image); // Note: Updated to match backend
      });
  
      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
  
      const response = await classPost('/quizes/quiz/create', formData);
      setQuizzes([...quizzes, response.data.quiz]);
      setShowForm(false);
      setQuizForm({
        title: '',
        questions: [{ image: null, text: '', options: [{ text: '', isCorrect: false }], marks: 1, timeLimit: null }]
      });
      toast.success('Quiz created successfully');
    } catch (error) {
      console.error('Error creating quiz:', error.response?.data || error.message);
      toast.error(`Failed to create quiz: ${error.response?.data?.message || error.message}`);
    }
  };



  const handleStartQuiz = async (quizId) => {
    try {
      await classPost(`/quizes/quiz/start/${quizId}`);
      setQuizzes(quizzes.map(q => q._id === quizId ? { ...q, started: true } : q));
      toast.success('Quiz started');
    } catch (error) {
      toast.error('Failed to start quiz');
    }
  };




  const handleScheduleQuiz = async () => {
    try {
      await classPost(`/quizes/quiz/schedule/${scheduleQuizId}`, scheduleData);
      setQuizzes(quizzes.map(q => q._id === scheduleQuizId ? { ...q, startTime: scheduleData.startTime, endTime: scheduleData.endTime } : q));
      setShowScheduleModal(false);
      setScheduleQuizId(null);
      setScheduleData({ startTime: '', endTime: '' });
      toast.success('Quiz scheduled');
    } catch (error) {
      toast.error('Failed to schedule quiz');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await classPost(`/quizes/quiz/delete/${quizId}`);
        setQuizzes(quizzes.filter(q => q._id !== quizId));
        toast.success('Quiz deleted');
      } catch (error) {
        toast.error('Failed to delete quiz');
      }
    }
  };

  const handleDownloadQuiz = async (quizId, title) => {
    try {
      const response = await downloadFile(`/quizes/quiz/download/${quizId}`);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download quiz. Please disable ad-blockers or try again.');
    }
  };

  const handleAddQuestion = () => {
    setQuizForm({
      ...quizForm,
      questions: [...quizForm.questions, { image: null, text: '', options: [{ text: '', isCorrect: false }], marks: 1, timeLimit: null }]
    });
  };

  const handleAddOption = (questionIndex) => {
    const newQuestions = [...quizForm.questions];
    newQuestions[questionIndex].options.push({ text: '', isCorrect: false });
    setQuizForm({ ...quizForm, questions: newQuestions });
  };

  const handleClearForm = () => {
    setQuizForm({ title: '', questions: [{ image: null, text: '', options: [{ text: '', isCorrect: false }], marks: 1, timeLimit: null }] });
    setShowForm(false);
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-screen"><div className="spinner"></div></div>;

  return (
    <div className="page-container">
      <style>{styles}</style>
      <div className="card-container">
        <div className="second-nav"><SecondNav classId={id} /></div>
        <h2 className="class-name">{classData?.ClassName || 'No class data'}</h2>
        <div className="content-container">
          <h3 className="section-title">Quizzes</h3>
          <button className="form-button" onClick={() => setShowForm(true)}>Create Quiz</button>
          {quizzes.map(quiz => (
            <div key={quiz._id} className="quiz-card">
              <div>
                <h4>{quiz.title}</h4>
                <p>{quiz.questions.length} Questions - {quiz.totalMarks || 0} Marks</p>
                <p>Total Students: {quiz.totalStudents} | Attended: {quiz.attended} | Not Attended: {quiz.notAttended}</p>
              </div>
              <div>
                <button 
                  className="action-button start-button" 
                  onClick={(e) => { e.stopPropagation(); handleStartQuiz(quiz._id); }} 
                  disabled={quiz.started}
                >
                  Start Quiz
                </button>
                <button 
                  className="action-button schedule-button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setScheduleQuizId(quiz._id);
                    setShowScheduleModal(true);
                  }}
                >
                  Schedule Quiz
                </button>
                <button 
                  className="action-button delete-button" 
                  onClick={(e) => { e.stopPropagation(); handleDeleteQuiz(quiz._id); }}
                >
                  Delete
                </button>
                <button 
                  className="action-button download-button" 
                  onClick={(e) => { e.stopPropagation(); handleDownloadQuiz(quiz._id, quiz.title); }}
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showForm && (
        <div className="form-modal">
          <h3>Create Quiz</h3>
          <input 
            className="form-input" 
            value={quizForm.title} 
            onChange={e => setQuizForm({ ...quizForm, title: e.target.value })} 
            placeholder="Quiz Title" 
          />
          {quizForm.questions.map((q, i) => (
            <div key={i} className="question-section">
              <h4>Question {i + 1}</h4>
              <input 
                type="file" 
                onChange={e => {
                  const newQuestions = [...quizForm.questions];
                  newQuestions[i].image = e.target.files[0];
                  setQuizForm({ ...quizForm, questions: newQuestions });
                }} 
              />
              <input 
                className="form-input" 
                value={q.text} 
                onChange={e => {
                  const newQuestions = [...quizForm.questions];
                  newQuestions[i].text = e.target.value;
                  setQuizForm({ ...quizForm, questions: newQuestions });
                }} 
                placeholder="Question" 
              />
              {q.options.map((opt, j) => (
                <div key={j} className="option-container">
                  <input 
                    type="checkbox" 
                    checked={opt.isCorrect} 
                    onChange={e => {
                      const newQuestions = [...quizForm.questions];
                      newQuestions[i].options[j].isCorrect = e.target.checked;
                      setQuizForm({ ...quizForm, questions: newQuestions });
                    }} 
                  />
                  <input 
                    className="form-input" 
                    value={opt.text} 
                    onChange={e => {
                      const newQuestions = [...quizForm.questions];
                      newQuestions[i].options[j].text = e.target.value;
                      setQuizForm({ ...quizForm, questions: newQuestions });
                    }} 
                    placeholder={`Option ${j + 1}`} 
                  />
                </div>
              ))}
              <button 
                className="form-button" 
                onClick={() => handleAddOption(i)}
              >
                Add Option
              </button>
              <input 
                className="form-input" 
                type="number"
                placeholder="Marks"  
                value={q.marks} 
                onChange={e => {
                  const newQuestions = [...quizForm.questions];
                  newQuestions[i].marks = parseInt(e.target.value) || 1;
                  setQuizForm({ ...quizForm, questions: newQuestions });
                }} 
                // placeholder="Marks" 
              />
              <input 
                className="form-input" 
                type="number" 
                value={q.timeLimit || ''} 
                onChange={e => {
                  const newQuestions = [...quizForm.questions];
                  newQuestions[i].timeLimit = parseInt(e.target.value) || null;
                  setQuizForm({ ...quizForm, questions: newQuestions });
                }} 
                placeholder="Time Limit (seconds, optional)" 
              />
            </div>
          ))}
          <div className="button-row">
            <button className="form-button" onClick={handleAddQuestion}>Add Question</button>
            <div>
              <button className="form-button" onClick={handleCreateQuiz}>Submit</button>
              <button 
                className="form-button" 
                onClick={handleClearForm} 
                style={{ backgroundColor: '#e5e7eb', color: '#333' }}
              >
                Clear Form
              </button>
            </div>
          </div>
        </div>
      )}
      {showScheduleModal && (
        <div className="schedule-modal">
          <h3>Schedule Quiz</h3>
          <label>Start Time:</label>
          <input 
            type="datetime-local" 
            className="form-input" 
            value={scheduleData.startTime} 
            onChange={e => setScheduleData({ ...scheduleData, startTime: e.target.value })} 
          />
          <label>End Time:</label>
          <input 
            type="datetime-local" 
            className="form-input" 
            value={scheduleData.endTime} 
            onChange={e => setScheduleData({ ...scheduleData, endTime: e.target.value })} 
          />
          <div className="button-row">
            <button className="form-button" onClick={handleScheduleQuiz}>Schedule</button>
            <button 
              className="form-button" 
              onClick={() => setShowScheduleModal(false)} 
              style={{ backgroundColor: '#e5e7eb', color: '#333' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizAdmin;
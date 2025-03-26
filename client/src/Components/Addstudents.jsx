import React, { useEffect, useRef, useState } from 'react'
import { addstudentsPost,  classGet,  deleteRequest,  get } from '../services/Endpoint'
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import SecondNav from './SecondNav';



const styles = `
  /* Page Background */
    .class-name {
    font-size: 2.5rem;
    font-weight: 800;
    color: #6b48ff;
    margin-bottom: 0.2rem;
  }

  .page-container {
    background-color: #d3d8e0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 200px 20px 20px;
    position: relative;
  }

  /* Headings */
  .section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #000;
    margin-bottom: 1.5rem;
  }

  /* Form Container */
  .form-container {
    width: 100%;
    max-width: 600px;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background-color: #fff;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .form-label {
    display: block;
    font-size: 1.1rem;
    font-weight: 600;
    color: #000;
    margin-bottom: 0.5rem;
  }

  .form-input {
    width: 100%;
    padding: 0.75rem;
    background-color: #fff;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    color: #333;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .form-input:focus {
    outline: none;
    border-color: #6b48ff;
    box-shadow: 0 0 0 3px rgba(107, 72, 255, 0.2);
  }

  .form-button {
    width: 50%;
    margin-top:20px;
    padding: 0.75rem;
    background-color: #6b48ff;
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
  }

  .form-button:hover {
    background-color: #5a3de6;
    cursor: pointer; /* Ensure cursor is pointer on hover */
    transform: scale(1.02); /* Slight scale effect for better UX */
  }

  .form-button:disabled {
    background-color: #a3a3a3;
    cursor: not-allowed;
  }

  /* Table Styles */
  .students-table {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    border-collapse: collapse;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .students-table thead {
    background-color: #1a2526;
    color: #fff;
  }

  .students-table th {
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
  }

  .students-table tbody tr:nth-child(odd) {
    background-color: #f1f7ff;
  }

  .students-table tbody tr:nth-child(even) {
    background-color: #fff;
  }

  .students-table td {
    padding: 12px 16px;
    font-size: 14px;
    color: #333;
  }

  .delete-button {
    color: #dc3545;
    transition: color 0.2s, transform 0.2s;
  }

  .delete-button:hover {
    color: #b02a37;
    cursor: pointer; /* Ensure cursor is pointer on hover */
    transform: scale(1.1); /* Slight scale effect for better UX */
  }

  /* Notification Modal */
  .notification-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 15px 5px rgba(107, 72, 255, 0.3),
                0 0 15px 5px rgba(0, 122, 255, 0.3);
    text-align: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-in-out;
  }

  .notification-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .notification-message {
    font-size: 1rem;
    font-weight: 400;
  }

  .notification-success .notification-title,
  .notification-success .notification-message {
    color: #28a745;
  }

  .notification-error .notification-title,
  .notification-error .notification-message {
    color: #dc3545;
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -60%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }

  /* No Data Message */
  .no-data {
    text-align: center;
    color: #666;
    font-size: 1.1rem;
    padding: 2rem;
    background-color: #f9fafb;
    border-radius: 0.5rem;
  }

  /* Loading Spinner */
  .spinner {
    width: 4rem;
    height: 4rem;
    border: 4px solid #6b48ff;
    border-top: 4px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Addstudents = () => {
  const { id } = useParams(); 
  const effectRan = useRef(false);
  // console.log("Class ID from params:", id);
  const [students, setStudents] = useState([]);
  const [registerNumber, setRegisterNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [classData, setClassData] = useState('')
  const [notification, setNotification] = useState(null); 


  const showNotification = (title, message, type) => {
    setNotification({ title, message, type });
    setTimeout(() => setNotification(null), 2000); 
  };

  const getStudents=async()=>{
    try {
      setIsLoading(true);
      const response= await get(`/students/getstudents`,{ classId: id })
      // const sortedClass = response.data.getclass.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setStudents(response.data.students || []);
    } catch (error) {
      // console.log("Error fetching students",error)
      // toast.error("Failed to fetch students");
      // showNotification('Error', 'Failed to fetch students', 'error');
    } finally{
      setIsLoading(false)
    }
    
  }
  useEffect(() => {
    if (effectRan.current === false) {
      getStudents();
    } 
    return () => {
      effectRan.current = true;
    };
  }, []);

  const handleDelete = async (register) => {
    try {
        setIsLoading(true);
        const response = await deleteRequest(`/students/deletestudents`, {
            Register: register,
            classId: id,  
        });
        showNotification('Success', response.data.message, 'success');
        // toast.success(response.data.message);
        getStudents();  
    } catch (error) {
        console.error("Error deleting student", error);
        // toast.error(error.response?.data?.message || "Failed to delete student");
        showNotification('Error', error.response?.data?.message || 'Failed to delete student', 'error');
    } finally {
        setIsLoading(false);
    }
};
useEffect(() => {
  const fetchClassData = async () => {
    try {
      const response = await classGet(`/class/getclass/${id}`);
      setClassData(response.data.classData);
      // console.log(response.data.classData)
    } catch (error) {
      console.error("Failed to fetch class data:", error);
      setError('Failed to load class data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

 

  fetchClassData();
}, [id]);
  

  const handleSubmit=async(e)=>{
    e.preventDefault()
   try {
    setIsLoading(true)
    const response = await addstudentsPost('/students/addstudents', { Register:registerNumber, classId: id  });;
    setRegisterNumber("")
    // closeModal()
    // toast.success("Student Added successfully ")
    showNotification('Success', 'Student added successfully', 'success');
    getStudents();
   } catch (error) {
    console.log(error)
    if (error.response.status === 409) {
      // toast.error(error.response.data.message); 
      showNotification('Error', error.response.data.message, 'error');
    } else {
      // toast.error("An unexpected error occurred");
      showNotification('Error', 'An unexpected error occurred', 'error');
    }
   }
   finally{
    setIsLoading(false)
  }


  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

 


  }
  return (
    <div className="page-container">
    {/* Inject the CSS styles */}
    <style>{styles}</style>
    <SecondNav classId={id} />
    <h2 className="class-name">{classData ? classData.ClassName : 'No class data available'}</h2>
    <div className="form-container">
      {/* <h2 className="section-title text-center">Add via Register Number:</h2> */}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          {/* <label className="form-label">Register Number:</label> */}
          <input
            type="text"
            placeholder="Enter Register number"
            className="form-input"
            value={registerNumber}
            onChange={(e) => setRegisterNumber(e.target.value)}
            required
          />
        </div>

        <div className="text-center">
          <button type="submit" className="form-button" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>
    </div>

    <div className="w-full max-w-2xl">
      <h2 className="section-title text-center">Registered Students</h2>

      {students.length === 0 ? (
        <div className="no-data">
          <p>No students found. Add your first student above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="students-table">
            <thead>
              <tr>
                <th>S.no</th>
                <th>Register Number</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((register, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{register}</td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDelete(register)}
                      className="delete-button"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

    {/* Notification Modal */}
    {notification && (
      <div className={`notification-modal notification-${notification.type}`}>
        <div className="notification-title">{notification.title}</div>
        <div className="notification-message">{notification.message}</div>
      </div>
    )}
  </div>
  )
}

export default Addstudents

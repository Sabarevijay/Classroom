import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addstudentsPost, classGet, get, getUser, post } from '../services/Endpoint';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
// import axios from 'axios';

const styles = `
  /* Page Background */
  .page-container {
    background-color: #d3d8e0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 130px 20px 20px;
    position: relative;
  }

  /* Headings */
  .class-name {
    font-size: 2.5rem;
    font-weight: 800;
    color: #6b48ff;
    margin-bottom: 1rem;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #000;
    margin-bottom: 1.5rem;
  }

  /* Form Styles */
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

  .form-select {
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

  .form-select:focus {
    outline: none;
    border-color: #6b48ff;
    box-shadow: 0 0 0 3px rgba(107, 72, 255, 0.2);
  }

  .form-button {
    padding: 0.75rem 1.5rem;
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
    cursor: pointer;
    transform: scale(1.02);
  }

  /* Add Students Button */
  .add-students-button {
    color: #6b48ff;
    transition: transform 0.2s;
  }

  .add-students-button:hover {
    transform: scale(1.15);
    cursor: pointer;
  }

  /* Button Row */
  .button-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem; /* Increased spacing between dropdown and buttons */
  }

  /* Space for OTP Card */
  .otp-card-space {
    min-height: 150px; /* Reserve space for the OTP card */
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Search and Filter Styles */
  .table-controls {
    width: 100%;
    max-width: 600px;
    margin-bottom: 1rem;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .search-input {
    width: 200px; /* Reduced width for a minimal look */
    padding: 0.5rem 0.75rem; /* Smaller padding for a compact design */
    background-color: #fff;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.9rem; /* Smaller font size */
    color: #333;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .search-input:focus {
    outline: none;
    border-color: #6b48ff;
    box-shadow: 0 0 0 3px rgba(107, 72, 255, 0.2);
  }

  .search-input::placeholder {
    color: #999; /* Lighter placeholder text */
    font-style: italic;
  }

  .filter-select {
    width: 120px; /* Reduced width for a minimal look */
    padding: 0.5rem 0.75rem; /* Smaller padding */
    background-color: #fff;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.9rem; /* Smaller font size */
    color: #333;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .filter-select:focus {
    outline: none;
    border-color: #6b48ff;
    box-shadow: 0 0 0 3px rgba(107, 72, 255, 0.2);
  }

  /* Table Styles */
  .attendance-table {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    border-collapse: collapse;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .attendance-table thead {
    background-color: #1a2526;
    color: #fff;
  }

  .attendance-table th {
    padding: 16px 20px; /* Increased padding for better spacing */
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    line-height: 1.5; /* Better vertical alignment */
  }

  .attendance-table th.sortable {
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .attendance-table th.sortable:hover {
    background-color: #2a3b3c;
  }

  .attendance-table th.sortable::after {
    content: '↕';
    margin-left: 0.5rem;
    font-size: 12px;
  }

  .attendance-table tbody tr:nth-child(odd) {
    background-color: #f1f7ff;
  }

  .attendance-table tbody tr:nth-child(even) {
    background-color: #fff;
  }

  .attendance-table td {
    padding: 16px 20px; /* Increased padding for better spacing */
    font-size: 14px;
    color: #333;
    line-height: 1.5; /* Better vertical alignment */
  }

  /* Success Card */
  .success-card {
    position: absolute;
    top: 400px; /* Position it above the table */
    background-color: #fff; /* White background */
    color: #000; /* Black text for readability */
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 15px 5px rgba(107, 72, 255, 0.3), /* Purple blur */
              0 0 15px 5px rgba(0, 122, 255, 0.3); /* Blue blur */
    text-align: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-in-out;
  }

  .success-card.boom {
    animation: boom 0.5s ease-in-out forwards;
  }

  .otp-value {
    font-size: 2.5rem;
    font-weight: 800;
    color: #28a745; /* Green OTP */
    margin-bottom: 0.5rem;
  }

  .timer-text {
    font-size: 1rem;
    font-weight: 400;
    color: #333; /* Darker text for readability */
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes boom {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.8;
    }
    100% {
      transform: scale(0);
      opacity: 0;
    }
  }

  /* No Data Message */
  .no-data {
    text-align: center;
    color: #666;
    font-size: 1.1rem;
    margin-top: 2rem;
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

const ClassAdmin = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(20);
  const [attendance, setAttendance] = useState([]);
  const [hour,setHour]=useState("");
  const [showSuccessCard, setShowSuccessCard] = useState(false); // State for success card
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [sortOrder, setSortOrder] = useState('asc'); // State for sorting order
  const [hourFilter, setHourFilter] = useState(''); // State for hour filter
  const navigate =useNavigate()
  
  


  const addStudentsRedirect=()=>{
     navigate(`/admin/classadmin/${id}/addStudents`)
  }


  const generateOTP = async () => {
    if (!hour || hour === "-- Select Hour --") {
      toast.error("Please select an hour before generating OTP.");
      return;
    }
    const newOtp = Math.floor(10000 + Math.random() * 900000).toString();
    setOtp(newOtp);
    setTimeLeft(20);
    setShowSuccessCard(true); 
    try {
      await post('/otp/generate', { otp: newOtp, classId: id, hour });
      toast.success("OTP generated successfully!");
      setHour("")
    } catch (error) {
      console.error("Failed to generate OTP:", error);
      toast.error("Failed to generate OTP. Please try again.");
      setShowSuccessCard(false);
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
    fetchAttendanceData();

  
  }, [id]);


  const fetchAttendanceData = async () => {
    try {
      const response = await get('/attendance/getattendance');
      const today = new Date().toISOString().split('T')[0]; 
      // console.log(today)
  
      const userAttendance = response.data.attendance.filter(record => {
        const recordDate = new Date(record.createdAt).toISOString().split('T')[0]; 
        return record.classId === id && recordDate === today;
      });
  
      setAttendance(userAttendance);
    } catch (error) {
      console.error("Failed to fetch attendance data:", error);
    }
  };
  

  useEffect(() => {
    if (timeLeft > 0 && otp) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
      
    } else if (timeLeft === 0) {
      setOtp('');
      setShowSuccessCard(false);
      fetchAttendanceData();
    }
  }, [timeLeft, otp]);

  const filteredAndSortedAttendance = attendance
  .filter((record) => {
    // Filter by search term (register number)
    const matchesSearch = record.user.toLowerCase().includes(searchTerm.toLowerCase());
    // Filter by hour
    const matchesHour = hourFilter ? record.hour === hourFilter : true;
    return matchesSearch && matchesHour;
  })
  .sort((a, b) => {
    // Sort by register number
    if (sortOrder === 'asc') {
      return a.user.localeCompare(b.user);
    } else {
      return b.user.localeCompare(a.user);
    }
  });

// Toggle sort order
const toggleSortOrder = () => {
  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
};

  if (isLoading) {
    return (
     <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className="page-container">
    {/* Inject the CSS styles */}
    <style>{styles}</style>

    <h2 className="class-name">{classData ? classData.ClassName : 'No class data available'}</h2>

    <form className="form-container">
      {/* Select Time */}
      <div className="mb-6">
        <label className="form-label">Select Time:</label>
        <select
          className="form-select"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
        >
          <option value="">-- Select Hour --</option>
          <option value="I Hour">I Hour</option>
          <option value="II Hour">II Hour</option>
          <option value="III Hour">III Hour</option>
          <option value="IV Hour">IV Hour</option>
          <option value="V Hour">V Hour</option>
          <option value="VI Hour">VI Hour</option>
          <option value="VII Hour">VII Hour</option>
        </select>
      </div>

      {/* Button Row: Generate OTP and Add Students */}
      <div className="button-row">
        <button type="button" className="form-button" onClick={generateOTP}>
          Generate OTP
        </button>
        <button className="add-students-button" onClick={addStudentsRedirect}>
          <UserPlus size={32} />
        </button>
      </div>
    </form>

    {/* Space for OTP Card */}
    <div className="otp-card-space">
      {showSuccessCard && otp && (
        <div className={`success-card ${timeLeft === 0 ? 'boom' : ''}`}>
          <div className="otp-value">{otp}</div>
          <div className="timer-text">Expires in {timeLeft}s</div>
        </div>
      )}
    </div>

    {attendance.length > 0 ? (
      <div className="w-full max-w-2xl mt-8">
        <h3 className="section-title">Attendance Details</h3>

        {/* Table Controls: Search and Filter */}
        <div className="table-controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search by Register Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={hourFilter}
            onChange={(e) => setHourFilter(e.target.value)}
          >
            <option value="">All Hours</option>
            <option value="I Hour">I Hour</option>
            <option value="II Hour">II Hour</option>
            <option value="III Hour">III Hour</option>
            <option value="IV Hour">IV Hour</option>
            <option value="V Hour">V Hour</option>
            <option value="VI Hour">VI Hour</option>
            <option value="VII Hour">VII Hour</option>
          </select>
        </div>

        <table className="attendance-table">
          <thead>
            <tr>
              <th className="sortable" onClick={toggleSortOrder}>
                Register Number {sortOrder === 'asc' ? '↑' : '↓'}
              </th>
              <th>Status</th>
              <th>Hour</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedAttendance.map((record) => (
              <tr key={record._id}>
                <td>{record.user}</td>
                <td>{record.status}</td>
                <td>{record.hour}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="no-data">No attendance data found</div>
    )}
  </div>
  );
};


export default ClassAdmin;

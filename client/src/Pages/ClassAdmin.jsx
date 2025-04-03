import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { classGet, get, post } from '../services/Endpoint';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import SecondNav from '../Components/SecondNav';

const styles = `
  /* Page Background */
  .page-container {
    background-color: #d3d8e0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    position: relative;
  }

  /* Card Container for all content */
  .card-container {
    background-color: #fff;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 700px;
    padding: 0 2rem 2rem 2rem;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Style for SecondNav to merge with the top of the card */
  .second-nav {
    background-color: #fff;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    padding: 0rem 0;
    margin: 0 -2rem;
    // border-bottom: 1px solid #e5e7eb;
  }

  /* Headings */
  .class-name {
    font-size: 2.5rem;
    font-weight: 800;
    color: #6b48ff;
    margin-bottom: 0.2rem;
    text-align: center;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #000;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  /* Form Styles */
  .form-container {
    width: 100%;
    padding: 1.5rem;
    background-color: transparent;
    border: none;
    box-shadow: none;
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

  .add-students-button {
    color: #6b48ff;
    transition: transform 0.2s;
  }

  .add-students-button:hover {
    transform: scale(1.15);
    cursor: pointer;
  }

  .button-row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1.5rem;
  }

  .otp-card-space {
    min-height: 150px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .table-controls {
    width: 100%;
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .search-input {
    width: 450px;
    padding: 0.5rem 0.75rem;
    background-color: #fff;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.9rem;
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
    color: #999;
    font-style: italic;
  }

  .filter-select {
    width: 120px;
    padding: 0.5rem 0.75rem;
    background-color: #fff;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    color: #333;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .filter-select:focus {
    outline: none;
    border-color: #6b48ff;
    box-shadow: 0 0 0 3px rgba(107, 72, 255, 0.2);
  }

  .attendance-table {
    width: 100%;
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
    padding: 16px 20px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    line-height: 1.5;
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
    padding: 16px 20px;
    font-size: 14px;
    color: #333;
    line-height: 1.5;
  }

  .success-card {
    position: relative;
    top: auto;
    background-color: #fff;
    color: #000;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 15px 5px rgba(107, 72, 255, 0.3),
              0 0 15px 5px rgba(0, 122, 255, 0.3);
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
    color:  #6b48ff;
    margin-bottom: 0.5rem;
  }

  .timer-text {
    font-size: 1rem;
    font-weight: 400;
    color: #333;
  }

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

  .no-data {
    text-align: center;
    color: #666;
    font-size: 1.1rem;
    margin-top: 2rem;
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
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .card-container {
      padding: 0 1rem 1rem 1rem;
      margin-top: 0.5rem;
    }

    .second-nav {
      margin: 0 -1rem;
      padding: 0.75rem 0;
    }

    .class-name {
      font-size: 1.8rem;
    }

    .search-input {
      width: 100%;
      max-width: 300px;
    }

    .filter-select {
      width: 100px;
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
  const [hour, setHour] = useState('');
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc' for hour sorting
  const [hourFilter, setHourFilter] = useState('');
  const navigate = useNavigate();

  const addStudentsRedirect = () => {
    navigate(`/admin/classadmin/${id}/addStudents`);
  };

  const fetchAttendanceData = async () => {
    try {
      const response = await get('/attendance/getattendance');
      const today = new Date().toISOString().split('T')[0];
      const userAttendance = response.data.attendance.filter((record) => {
        const recordDate = new Date(record.createdAt).toISOString().split('T')[0];
        return record.classId === id && recordDate === today;
      });
      setAttendance(userAttendance);
    } catch (error) {
      console.error('Failed to fetch attendance data:', error);
    }
  };

  const generateOTP = async () => {
    if (!hour || hour === '-- Select Hour --') {
      toast.error('Please select an hour before generating OTP.');
      return;
    }
    const newOtp = Math.floor(10000 + Math.random() * 900000).toString();
    setOtp(newOtp);
    setTimeLeft(15);
    setShowSuccessCard(true);
    try {
      await post('/otp/generate', { otp: newOtp, classId: id, hour });
      toast.success('OTP generated successfully!');
      setHour('');
    } catch (error) {
      console.error('Failed to generate OTP:', error);
      toast.error('Failed to generate OTP. Please try again.');
      setShowSuccessCard(false);
    }
  };

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await classGet(`/class/getclass/${id}`);
        setClassData(response.data.classData);
      } catch (error) {
        console.error('Failed to fetch class data:', error);
        setError('Failed to load class data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassData();
    fetchAttendanceData();
  }, [id]);

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

  // Sorting logic based on "Hour"
  const filteredAndSortedAttendance = attendance
    .filter((record) => {
      const matchesSearch = record.user.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesHour = hourFilter ? record.hour === hourFilter : true;
      return matchesSearch && matchesHour;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.hour.localeCompare(b.hour); // Sort by hour ascending
      } else {
        return b.hour.localeCompare(a.hour); // Sort by hour descending
      }
    });

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
      <style>{styles}</style>
      <div className="card-container">
        <div className="second-nav">
          <SecondNav classId={id} />
        </div>
        <h2 className="class-name">{classData ? classData.ClassName : 'No class data available'}</h2>
        <form className="form-container">
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

          <div className="button-row">
            <button type="button" className="form-button" onClick={generateOTP}>
              Generate OTP
            </button>
          </div>
        </form>
        <div className="otp-card-space">
          {showSuccessCard && otp && (
            <div className={`success-card ${timeLeft === 0 ? 'boom' : ''}`}>
              <div className="otp-value">{otp}</div>
              <div className="timer-text">Expires in {timeLeft}s</div>
            </div>
          )}
        </div>

        {attendance.length > 0 ? (
          <div className="w-full">
            <h3 className="section-title">Attendance Details</h3>

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
                  <th>Register Number</th>
                  <th>Status</th>
                  <th className="sortable" onClick={toggleSortOrder}>
                    Hour {sortOrder === 'asc' ? '↑' : '↓'}
                  </th>
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
    </div>
  );
};

export default ClassAdmin;
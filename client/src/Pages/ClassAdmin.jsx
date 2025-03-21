import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addstudentsPost, classGet, get, getUser, post } from '../services/Endpoint';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
// import axios from 'axios';

const ClassAdmin = () => {
  const { id } = useParams();
  const [isModalOpen,setIsModalOpen]=useState(false)
  const [registerNumber,setRegisterNumber]=useState("")
  const [classData, setClassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(20);
  const [attendance, setAttendance] = useState([]);
  const [hour,setHour]=useState("");
  const navigate =useNavigate()
  
  

  // const openModal=()=>{
  //   setIsModalOpen(true)
  // }
  // const closeModal=()=>{
  //   setIsModalOpen(false)
  //   setRegisterNumber("")
  // }

  const addStudentsRedirect=()=>{
     navigate(`/admin/classadmin/${classId}/addStudents`)
  }

  const generateOTP = async () => {
    if (!hour) {
      toast.error("Please select an hour before generating OTP.");
      return;
    }
    const newOtp = Math.floor(10000 + Math.random() * 900000).toString();
    setOtp(newOtp);
    setTimeLeft(20);
    try {
      await post('/otp/generate', { otp: newOtp, classId: id, hour });
      toast.success("OTP generated successfully!");
      setHour("--Select Hour--")
    } catch (error) {
      console.error("Failed to generate OTP:", error);
      toast.error("Failed to generate OTP. Please try again.");
    }
  
  };
  

  // const handleSubmit=async(e)=>{
  //   e.preventDefault()
  //  try {
  //   setIsLoading(true)
  //   const response = await addstudentsPost('/students/addstudents', { Register:registerNumber, classId: id  });
  //   // console.log('Students added:', response.data);
  //   setRegisterNumber("")
  //   closeModal()
  //   toast.success("Student Added successfully ")
  //  } catch (error) {
  //   // console.log(error)
  //   if (error.response.status === 409) {
  //     toast.error(error.response.data.message); 
      
  //   } else {
  //     toast.error("An unexpected error occurred");
  //   }
  //  }
  //  finally{
  //   setIsLoading(false)
  // }


  // }

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
  // const fetchAttendanceData = async () => {
  //   try {
  //     const response = await get('/attendance/getattendance');
  //     // console.log("Attendance response:", response.data); 
  //     const userAttendance = response.data.attendance.filter(record =>  record.classId === id);
  //     setAttendance(userAttendance);
  //   } catch (error) {
  //     console.error("Failed to fetch attendance data:", error);
  //   }
  // };

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
      fetchAttendanceData();
    }
  }, [timeLeft, otp]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-100 to-gray-300 min-h-screen flex flex-col items-center">
      <h2 className="text-4xl font-extrabold mb-8 text-blue-700" style={{marginTop:'130px'}}>{classData ? classData.ClassName : 'No class data available'}</h2>
          <div>
            <button className=" text-black  w-10 h-10 flex items-center justify-center absolute right-35 transform transition-transform hover:scale-115" style={{cursor:'pointer'}}
            onClick={addStudentsRedirect}
            >
              <UserPlus size={54} />
            </button>
          </div>

          {/* {isModalOpen && (
        <div className="absolute inset-0 flex items-center justify-center z-50 top-25 ">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg border border-gray-300 relative ">
            
            <button 
              className="absolute right-4 top-4 text-black" 
              style={{cursor:'pointer'}}
              onClick={closeModal}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </button>

            <h2 className="text-xl font-semibold mb-6 text-center ">
              Enter the Students register number:
            </h2>

            <form onSubmit={handleSubmit} >
              <input
                type="text"
                placeholder="register number"
                className="w-100 pr-3 border border-gray-300 rounded mb-4 text-gray-400"
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value)}
                required
              />

              <div className="text-center mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}

      {/* <div className="w-full max-w-lg mb-6">
        <label className="block font-semibold mb-2 text-lg">Select Date:</label>
        <input type="date" className="w-full p-3 border border-gray-400 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div> */}

      {/* <div className="w-full max-w-lg mb-6">
        <label className="block font-semibold mb-2 text-lg">Select Time:</label>
        <select className="w-full p-3 border border-gray-400 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="08:00">I Hour</option>
          <option value="09:00">II Hour</option>
          <option value="10:00">III Hour</option>
          <option value="11:00">IV Hour</option>
          <option value="12:00">V Hour</option>
          <option value="13:00">VI Hour</option>
          <option value="14:00">VII Hour</option>
        </select>
      </div>

      <div className="w-full max-w-lg flex gap-4 mb-8">
       
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg" onClick={generateOTP} >Generate OTP</button>
        {otp && (
      <div className="mt-4 text-lg font-medium text-gray-800">
        Current OTP: <span className="text-blue-600">{otp}</span> (Expires in {timeLeft}s)
      </div>
    )}
      </div> */}

<form className="w-full max-w-lg mb-8 p-6 border border-gray-300 rounded-lg shadow-md">
      {/* Select Time */}
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-lg">Select Time:</label>
        <select
          className="w-full p-3 border border-gray-400 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* OTP Generation Button & Display */}
      <div className="flex gap-4 items-center">
        <button
        type='button'
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
          onClick={generateOTP}
        >
          Generate OTP
        </button>

        {otp && (
          <div className="text-lg font-medium text-gray-800">
            Current OTP: <span className="text-blue-600">{otp}</span> (Expires in
            {timeLeft}s)
          </div>
        )}
      </div>
    </form>

      

{attendance.length > 0 ?(
        <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-xl mt-8">
          <h3 className="text-xl font-bold mb-4 text-blue-700">Attendance Details</h3>
          <ul className="list-none p-0">
            {attendance.map((record) => (
              <li key={record._id} className="bg-blue-100 p-4 rounded-lg mb-3 flex justify-between items-center shadow-sm">
                <span className="font-medium text-blue-700">{record.user}</span>
                <span className="text-lg font-semibold">Status: {record.status}</span>
                <span className="italic text-gray-600">{record.hour}</span>
              </li>
            ))}
          </ul>
        </div>
      ): (
        <div className="text-center text-gray-600 text-lg mt-8">No attendance data found</div>)}
    </div>
  );
};


export default ClassAdmin;

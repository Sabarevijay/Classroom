import React, { useState , useEffect} from 'react'
import { classGet, get, getUser, post } from '../services/Endpoint';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';



const ClassStudents = () => {
  const { id } = useParams();
  const [submittedOtp, setSubmittedOtp] = useState('');
  const [status, setStatus] = useState('absent');
  const [registerNumber, setRegisterNumber] = useState('');
  // const [isLoading, setIsLoading] = useState(true)
  const [attendance, setAttendance] = useState([]);
  const [classData, setClassData] = useState(null);
  const [hour,setHour]=useState("")
  

  const submitOTP = async () => {
    if (!submittedOtp || !hour) {
      setStatus('Please enter an OTP and select an hour ');
      return;
  }

  if (!classData) {
    setStatus('Class data not available');
    return;
  }

  const alreadyMarked = attendance.some(record => record.hour === hour);
  if (alreadyMarked) {
    toast.error(`Attendance for ${hour} is already marked.`);
    setHour("--Select Hour--")
    setSubmittedOtp("")
    return;
  }
  // console.log("Submitted OTP:", submittedOtp); 

    try {
     
      const response = await post('/otp/submit', { otp: submittedOtp ,user: registerNumber, classId: classData._id ,hour :hour });
      // console.log("Response from server:", response.data);

      
      setStatus(response.data.status);
      setHour("--Select Hour--")
      setSubmittedOtp("")
      fetchAttendance(registerNumber,classData._id);     
      
    
    } catch (error) {
      if (error.response.status === 400) {
        setSubmittedOtp("")
        toast.error(error.response.data.message); 
        
      }
      else if(error.response.status === 402){
        setSubmittedOtp("")
        toast.error(error.response.data.message); 
      }
      
      else {
        toast.error("An unexpected error occurred");
      }
      // console.log('Error submitting OTP',error)
      setStatus('Error submitting OTP');
    }
  };

  // const fetchAttendance = async (registerNumber,classId) => {
  //   try {
  //     const response = await get('/attendance/getattendance');
  //     const userAttendance = response.data.attendance.filter(record => record.user === registerNumber&& record.classId === classId);
  //     setAttendance(userAttendance);
  //   } catch (error) {
  //     console.error("Failed to fetch attendance data:", error);
  //   }
  // };
  const fetchAttendance = async (registerNumber, classId) => {
    try {
      const response = await get('/attendance/getattendance');
  
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  
      const userAttendance = response.data.attendance.filter(record => {
        const recordDate = new Date(record.createdAt).toISOString().split('T')[0]; // Convert createdAt to YYYY-MM-DD
        return record.user === registerNumber && record.classId === classId && recordDate === today;
      });
  
      setAttendance(userAttendance);
    } catch (error) {
      console.error("Failed to fetch attendance data:", error);
    }
  };
  


  const fetchClassData = async () => {
    try {
      const classresponse = await classGet(`/class/getclass/${id}`);
      setClassData(classresponse.data.classData);
      // console.log(classresponse.data.classData)
    } catch (error) {
      console.error("Failed to fetch class data:", error);
      // setError('Failed to load class data. Please try again later.');
    } 
  };
  
  useEffect(() => {
    const fetchUser = async () => {      
      try {
      
        const response = await getUser() 
        const userData = response.data.user; 
        // console.log(userData.Register); 
    
        setRegisterNumber(userData.Register);
    
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };  
    

    fetchClassData();
    fetchUser();
       
  }, []);

  useEffect(() => {
    if (registerNumber) {
      fetchAttendance(registerNumber,classData._id);
    }
  }, [registerNumber,classData]);
  

  return (
    <div className="p-5 bg-gray-300 min-h-screen flex flex-col items-center" style={{paddingTop:'130px'}}>
      <h2 className="text-4xl font-extrabold mb-8 text-blue-700" >{classData ? classData.ClassName : 'No class data available'}</h2>
    <h2 className="text-2xl font-bold mb-5">Student Attendance</h2>
    
    
    {registerNumber ? (
  <div className="text-xl font-medium mb-5 text-blue-700">
    Register Number: {registerNumber}
  </div>
) : (
  <div className="text-xl font-medium mb-5 text-yellow-600 flex items-center">
    <span>Loading register number .</span>
    
    <span className="ml-1 flex">
      <span className="h-4 w-4 bg-yellow-600 rounded-full mx-0.5 animate-bounce" 
            style={{animationDelay: "0ms"}}></span>
      <span className="h-4 w-4 bg-yellow-600 rounded-full mx-0.5 animate-bounce" 
            style={{animationDelay: "150ms"}}></span>
      <span className="h-4 w-4 bg-yellow-600 rounded-full mx-0.5 animate-bounce" 
            style={{animationDelay: "300ms"}}></span>
    </span>
  </div>
)}

    {/* <div className="w-full max-w-sm mb-4">
      <label className="block font-semibold mb-1">Select Date:</label>
      <input type="date" className="w-full p-2 border border-gray-400 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      
      />
    </div> */}
    <form 
  className="w-full max-w-sm mb-6"
  onSubmit={(e) => {
    e.preventDefault();  // Prevent page reload
    submitOTP();
  }}
>
  <div className="mb-6">
    <label className="block font-semibold mb-2 text-lg">Select Time:</label>
    <select 
      className="w-full p-2 border border-gray-400 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={hour}
      onChange={(e) => setHour(e.target.value)}
      required
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

  <div className="mb-4">
    <label className="block font-semibold mb-1">Enter OTP:</label>
    <input 
      type="text" 
      className="w-full p-2 border border-gray-400 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={submittedOtp}
      onChange={(e) => setSubmittedOtp(e.target.value)}
      placeholder="Enter OTP"
      required
    />
  </div>

  <button 
    type="submit" 
    className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
  >
    Submit OTP
  </button>
</form>

    {status && (
        <div className={`mt-4 text-lg font-medium ${status === 'present' ? 'text-green-600' : 'text-red-600'}`}>
          Status: {status} 
        </div>
      )}

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
  )
}

export default ClassStudents

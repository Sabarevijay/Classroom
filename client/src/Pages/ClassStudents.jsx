import axios from 'axios';
import React, { useState , useEffect} from 'react'
import { getUser } from '../services/Endpoint';

const ClassStudents = () => {
  const [submittedOtp, setSubmittedOtp] = useState('');
  const [status, setStatus] = useState('absent');
  const [registerNumber, setRegisterNumber] = useState('');
  

  const submitOTP = async () => {
    if (!submittedOtp) {
      setStatus('Please enter an OTP');
      return;
  }
  // console.log("Submitted OTP:", submittedOtp); 

    try {
     
      const response = await axios.post('http://localhost:8000/otp/submit', { otp: submittedOtp ,user: registerNumber });
      // console.log("Response from server:", response.data);
      setStatus(response.data.status);
      setSubmittedOtp("")
      
      // window.location.reload()
    } catch (error) {
      setStatus('Error submitting OTP');
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      // console.log("Register number state:", registerNumber)
      try {
        const response = await getUser('/auth/getusers'); 
        const userData = response.data.getUser;   
        console.log(userData);
        // setRegisterNumber(response.data.getUser); 
        
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };
    fetchUser();
  }, []);
  

  return (
    <div className="p-5 bg-gray-300 min-h-screen flex flex-col items-center" style={{marginTop:'150px'}}>
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

    <div className="w-full max-w-sm mb-4">
      <label className="block font-semibold mb-1">Select Date:</label>
      <input type="date" className="w-full p-2 border border-gray-400 rounded-md text-lg"
      
      />
    </div>

    <div className="w-full max-w-sm mb-4">
      <label className="block font-semibold mb-1">Enter OTP:</label>
      <input type="text" className="w-full p-2 border border-gray-400 rounded-md text-lg"
      value={submittedOtp}
      onChange={(e) => setSubmittedOtp(e.target.value)}
      placeholder="Enter OTP"
       />

    </div>

    <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
    onClick={submitOTP}>
      Submit OTP
    </button>
    {status && (
        <div className={`mt-4 text-lg font-medium ${status === 'present' ? 'text-green-600' : 'text-red-600'}`}>
          Status: {status} 
        </div>
      )}
  </div>
  )
}

export default ClassStudents

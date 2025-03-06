import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AdminOTP = () => {
    const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(20);

  const generateOTP = async () => {
    const newOtp = Math.floor(10000 + Math.random() * 900000).toString();
    setOtp(newOtp);
    setTimeLeft(20);
    await axios.post('http://localhost:8000/otp/generate', { otp: newOtp });
  };

  useEffect(() => {
    if (timeLeft > 0 && otp) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setOtp('');
    }
  }, [timeLeft, otp]);
  return (
    <div className="p-6 bg-gray-100 rounded-2xl shadow-lg">
    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-2xl transition" onClick={generateOTP}>
      Generate OTP
    </button>
    {otp && (
      <div className="mt-4 text-lg font-medium text-gray-800">
        Current OTP: <span className="text-blue-600">{otp}</span> (Expires in {timeLeft}s)
      </div>
    )}
  </div>
  )
}

export default AdminOTP

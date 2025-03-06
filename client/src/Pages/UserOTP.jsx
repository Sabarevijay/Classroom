import React, { useState } from 'react'
import axios from 'axios'

const UserOTP = () => {

    const [submittedOtp, setSubmittedOtp] = useState('');
  const [status, setStatus] = useState('');

  const submitOTP = async () => {
    try {
      const response = await axios.post('http://localhost:8000/otp/submit', { otp: submittedOtp ,user: "SomeUserName" });
      setStatus(response.data.status);
    } catch (error) {
      setStatus('Error submitting OTP');
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-2xl shadow-lg">
      <input
        type="text"
        value={submittedOtp}
        onChange={(e) => setSubmittedOtp(e.target.value)}
        placeholder="Enter OTP"
        className="border border-gray-300 rounded-2xl p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-2xl mt-4 transition" onClick={submitOTP}>
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

export default UserOTP

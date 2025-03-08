import React from 'react'

const ClassStudents = () => {
  return (
    <div className="p-5 bg-gray-300 min-h-screen flex flex-col items-center">
    <h2 className="text-2xl font-bold mb-5">Student Attendance</h2>

    <div className="w-full max-w-sm mb-4">
      <label className="block font-semibold mb-1">Select Date:</label>
      <input type="date" className="w-full p-2 border border-gray-400 rounded-md text-lg" />
    </div>

    <div className="w-full max-w-sm mb-4">
      <label className="block font-semibold mb-1">Enter OTP:</label>
      <input type="text" className="w-full p-2 border border-gray-400 rounded-md text-lg" />
    </div>

    <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition">
      Submit OTP
    </button>
  </div>
  )
}

export default ClassStudents

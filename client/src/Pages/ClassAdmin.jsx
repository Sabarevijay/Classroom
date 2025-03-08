import React from 'react'

const ClassAdmin = () => {
  const students = [
    { id: "7376241MZ154", name: "LAKSHEN V", time: "08:45 am to 09:40 am" },
    { id: "7376241MZ155", name: "VAISHAK K", time: "08:55 am to 09:45 am" },
    { id: "7376241EC164", name: "HARIHARAN P", time: "08:55 am to 09:45 am" },
    { id: "7376241EC183", name: "JAYASURYA", time: "08:55 am to 09:45 am" },
  ];
  return (
    <div className="p-5 bg-gray-300 min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-5">Robotics</h2>
      
      <div className="w-full max-w-lg mb-4">
        <label className="block font-semibold mb-1">Select Date:</label>
        <input type="date" className="w-full p-2 border border-gray-400 rounded-md text-lg" />
      </div>

      <div className="w-full max-w-lg mb-4">
        <label className="block font-semibold mb-1">Select Time:</label>
        <select className="w-full p-2 border border-gray-400 rounded-md text-lg">
          <option value="08:00">08:00 AM</option>
          <option value="09:00">09:00 AM</option>
          <option value="10:00">10:00 AM</option>
          <option value="11:00">11:00 AM</option>
          <option value="12:00">12:00 PM</option>
          <option value="13:00">01:00 PM</option>
          <option value="14:00">02:00 PM</option>
        </select>
      </div>

      <div className="w-full max-w-lg flex gap-4 mb-4">
        <input type="text" placeholder="Enter OTP" className="flex-1 p-2 border border-gray-400 rounded-md text-lg" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Generate OTP</button>
      </div>

      <div className="w-full max-w-2xl bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Recent Attendance ({students.length} Students)</h3>
        <ul className="list-none p-0">
          {students.map((student, index) => (
            <li key={index} className="bg-gray-200 p-2 rounded-md mb-2 flex justify-between">
              <span className="font-semibold">{student.id}</span>
              <span className="text-center flex-1">{student.name}</span>
              <span className="italic text-right">({student.time})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ClassAdmin

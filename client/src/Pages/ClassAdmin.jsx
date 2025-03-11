import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { classGet } from '../services/Endpoint';

const ClassAdmin = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const students = [
    { id: "7376241MZ154", name: "LAKSHEN V", time: "08:45 am to 09:40 am" },
    { id: "7376241MZ155", name: "VAISHAK K", time: "08:55 am to 09:45 am" },
    { id: "7376241EC164", name: "HARIHARAN P", time: "08:55 am to 09:45 am" },
    { id: "7376241EC183", name: "JAYASURYA", time: "08:55 am to 09:45 am" },
  ];

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await classGet(`/class/getclass/${id}`);
        setClassData(response.data.class);
      } catch (error) {
        console.error("Failed to fetch class data:", error);
        setError('Failed to load class data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchClassData();
  }, [id]);

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
      <h2 className="text-4xl font-extrabold mb-8 text-blue-700" style={{marginTop:'130px'}}>{classData?.ClassName || 'Class'}</h2>

      <div className="w-full max-w-lg mb-6">
        <label className="block font-semibold mb-2 text-lg">Select Date:</label>
        <input type="date" className="w-full p-3 border border-gray-400 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="w-full max-w-lg mb-6">
        <label className="block font-semibold mb-2 text-lg">Select Time:</label>
        <select className="w-full p-3 border border-gray-400 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="08:00">08:00 AM</option>
          <option value="09:00">09:00 AM</option>
          <option value="10:00">10:00 AM</option>
          <option value="11:00">11:00 AM</option>
          <option value="12:00">12:00 PM</option>
          <option value="13:00">01:00 PM</option>
          <option value="14:00">02:00 PM</option>
        </select>
      </div>

      <div className="w-full max-w-lg flex gap-4 mb-8">
        <input type="text" placeholder="Enter OTP" className="flex-1 p-3 border border-gray-400 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg">Generate OTP</button>
      </div>

      <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-xl">
        <h3 className="text-xl font-bold mb-4 text-blue-700">Recent Attendance ({students.length} Students)</h3>
        <ul className="list-none p-0">
          {students.map((student, index) => (
            <li key={index} className="bg-blue-100 p-4 rounded-lg mb-3 flex justify-between items-center shadow-sm">
              <span className="font-medium text-blue-700">{student.id}</span>
              <span className="text-lg font-semibold">{student.name}</span>
              <span className="italic text-gray-600">({student.time})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClassAdmin;

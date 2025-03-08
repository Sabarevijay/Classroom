import React from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        
        <div 
          className="min-h-screen pt-32 flex items-center justify-center"
          style={{ 
            paddingTop: "calc(114px + 2rem)",
            paddingLeft: "calc(129px + 2rem)", 
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 justify-items-center">
            <div 
              className="w-100 h-52 bg-[#35A935] rounded-3xl flex items-center justify-center text-white font-bold text-xl shadow-md transform transition-transform hover:scale-105"
              style={{ marginLeft: '20px' }}
            >
              Robotics
            </div>
            <div 
              className="w-100 h-52 bg-[#35A9A3] rounded-3xl flex items-center justify-center text-white font-bold text-xl shadow-md transform transition-transform hover:scale-105"
            >
              Data Structure
            </div>
            <div 
              className="w-100 h-52 bg-[#A93F35] rounded-3xl flex items-center justify-center text-white font-bold text-xl shadow-md transform transition-transform hover:scale-105"
              style={{ marginLeft: '20px' }} 
            >
              Digital Electronics
            </div>
            <div 
              className="w-100 h-52 bg-[#C9B858] rounded-3xl flex items-center justify-center text-white font-bold text-xl shadow-md transform transition-transform hover:scale-105"
            >
              ML
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
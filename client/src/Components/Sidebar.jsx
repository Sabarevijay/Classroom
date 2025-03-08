import React, { useState } from "react";
import { Home, Archive, AlignJustify } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`h-screen bg-[#677DA5] fixed top-0 left-0 transition-all duration-300 ${
        isOpen ? "w-64" : "w-[129px]"
      }`}
    >
      {/* Top Section - Menu Button */}
      <div className="p-4 justify-start">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          <AlignJustify size={80} />
        </button>
      </div>

      <div className="flex flex-col items-center absolute -top-4 md:top-35"> 
        <img
          src="/src/assets/user-profile.jpeg" 
          alt="Profile"
          className="w-20 h-20 rounded-full mr-3"
        />
        {isOpen && <span className="text-white font-semibold text-[30px] absolute left-25 top-6">User</span>}
        {/* {/<hr className="w-10/12 border-white mt-4" />} */}
      </div>

      <nav className="flex flex-col items-center mt-24 space-y-6">
        <div className="flex items-center text-white p-3 hover:bg-gray-300 hover:text-black rounded cursor-pointer absolute -top-4 md:top-70">
          <Home size={45} />
          {isOpen && <span className="ml-4 font-medium text-[30px] ">Home</span>}
        </div>

        <div className="flex items-center text-white p-3 hover:bg-gray-300 hover:text-black rounded cursor-pointer absolute -top-4 md:top-90">
          <Archive size={45} />
          {isOpen && <span className="ml-4 font-medium text-[30px]">Archived Class</span>}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
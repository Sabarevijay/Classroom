import React from 'react';
import { Plus, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav 
      className="fixed top-0 left-[129px] right-0 bg-[#BDC7D9] shadow-sm z-50 flex items-center justify-between px-6" 
      style={{ height: "95px" }}
    >
      {/* Left Section (Logo + Text) */}
      <div className="flex items-center space-x-4">
        <img 
          src="/logo2.png" 
          alt="BIT ClassRoom Logo" 
          className="h-[100px] w-[100px]"
        />
        <span className="text-[40px] font-semibold text-[#3A2C76]">BIT ClassRoom</span>
      </div>

      {/* Right Section (Buttons) */}
      <div className="flex items-center space-x-4 ">
        <button className="border-2 border-black text-black rounded-full w-10 h-10 flex items-center justify-center absolute right-35">
          <Plus size={25} />
        </button>
        <button className="rounded-full w-10 h-10 flex items-center justify-center absolute right-15">
          <User size={35} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
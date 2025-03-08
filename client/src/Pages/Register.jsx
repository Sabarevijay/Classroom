import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div
    className="min-h-screen w-full flex items-center bg-cover bg-center bg-no-repeat"

      style={{
        backgroundImage: "url('/Login bg.jpg')",
      }}
    >
   <div className="flex flex-col items-center rounded-full">
            <div className=" w-[80px] sm:w-[100px] md:w-[80px] lg:w-[300px] max-w-[500px] "> {/* Extra div for left-right padding */}
            </div></div>
      {/* White Box (Narrow & Responsive) */}
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 md:p-10 w-[350px] sm:w-[400px] md:w-[450px] max-w-[450px]">
      <div className="flex flex-col items-center rounded-full">
            <div className="w-[2px] h-[10px] "> {/* Extra div for left-right padding */}
            </div></div>
        {/* Logo & Heading */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
          <img src="/logo2.png" alt="Logo" className="w-16 sm:w-24 md:w-24 lg:w-28" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Registration</h2>
        </div>

        {/* Spacing Divider */}
        <div className="h-6 sm:h-8 md:h-6"></div>

        {/* Form */}
        <form>
        <div className="text-center">
  <label htmlFor="image" className="block text-lg font-medium text-gray-700">Profile Picture</label>
  <div className="flex justify-center mt-4">
    <img 
      src='https://img.freepik.com/premium-vector/round-gray-circle-with-simple-human-silhouette-light-gray-shadow-around-circle_213497-4963.jpg?uid=R153508185&ga=GA1.1.749508214.1739944068&semt=ais_hybrid'
      alt="avatar" 
      className="rounded-full w-28 h-28 object-cover cursor-pointer border-2 border-gray-300 hover:border-blue-500 transition"
     
      
       // Click event to trigger file input
    />
  </div>
  <input 
    type="file" 
    className="hidden" // Hide the file input
    id="image" 
    accept="image/*" 
    
  />
</div>
          {/* Register Number */}
          <div>
            <label className="block text-[20px] font-medium text-gray-900 [text-indent:1rem] sm:[text-indent:1.5rem] md:[text-indent:1.5rem]">Register Number</label>
            {/* Extra spacing between label and input */}
            <div className="h-4 sm:h-6 md:h-4"></div>
            <div className="flex items-center rounded-full">
            <div className="w-[15px] "> {/* Extra div for left-right padding */}
            </div>
            <div className="w-[92%] mx-auto">
            <input
              type="text"
              className="w-full h-10 sm:h-12 [text-indent:1rem] sm:[text-indent:1.25rem] pr-3 sm:pr-4 rounded-full bg-gray-200 focus:ring-2 focus:ring-indigo-400"
              required
            />
            </div>
          </div></div>

          {/* Extra Divider */}
          <div className="h-6 sm:h-8 md:h-6"></div>

          {/* Bitsathy Mail */}
          <div>
            <label className="block text-[20px] font-medium text-gray-900 [text-indent:1rem] sm:[text-indent:1.5rem] md:[text-indent:1.5rem]">Bitsathy Mail</label>
            <div className="h-4 sm:h-6 md:h-4"></div>
            <div className="flex items-center rounded-full">
            <div className="w-[15px] "> {/* Extra div for left-right padding */}
            </div>
            <div className="w-[92%] mx-auto"> 
            <input
              type="email"
              className="w-full h-10 sm:h-12 [text-indent:1rem] sm:[text-indent:1.25rem] pr-3 sm:pr-4 rounded-full bg-gray-200 focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div></div></div>

          {/* Extra Divider */}
          <div className="h-6 sm:h-8 md:h-6"></div>

          {/* Password */}
          <div>
            <label className="block text-[20px] font-medium text-gray-900 [text-indent:1rem] sm:[text-indent:1.5rem] md:[text-indent:1.5rem]">Password</label>
            <div className="h-4 sm:h-6 md:h-4"></div>
            <div className="flex items-center rounded-full">
            <div className="w-[15px] "> {/* Extra div for left-right padding */}
            </div>
            <div className="w-[92%] mx-auto"> 
            <input
              type="password"
              className="w-full h-10 sm:h-12 [text-indent:1rem] sm:[text-indent:1.25rem] pr-3 sm:pr-4 rounded-full bg-gray-200 focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div></div></div>

          {/* Extra Divider */}
          <div className="h-8 sm:h-10 md:h-8"></div>

          {/* Sign Up Button */}
          <div>
          <div className="flex items-center rounded-full">
            <div className="w-[15px] "> {/* Extra div for left-right padding */}
            </div>
            <div className="w-[92%] mx-auto"> 
            <button className="w-full h-10 sm:h-12 text-white bg-blue-500 rounded-full hover:bg-blue-600 transition">
              Sign Up
            </button>
          </div></div></div>

          {/* Extra Divider */}
          <div className="h-6 sm:h-8 md:h-6"></div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-700 text-sm sm:text-base">
              Already have an account?{" "}
              <Link to="/" className="text-blue-700 underline font-semibold">
                Login
              </Link>
            </p>
          </div>
          <div className="flex items-center rounded-full">
            <div className="w-[8px] h-[10px] "> {/* Extra div for left-right padding */}
            </div>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
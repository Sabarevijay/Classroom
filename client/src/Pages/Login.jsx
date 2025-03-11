import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../services/Endpoint";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const Login = () => {

  const navigate=useNavigate()
  const dispatch=useDispatch()
    const [value, setValue] = useState({
      email:"",
      password:""
  })
  const handleChange=(e)=>{
    setValue({
        ...value,
        [e.target.name]:e.target.value
    })
}
const handleSubmit=async(e)=>{
  try {
      e.preventDefault()
      const response=await post(`/auth/login`,value,{
          withCredentials: true
        })
        localStorage.setItem('token', response.data.token);
      const data =response.data
      if (response.status===200) {
          navigate('/home')
          toast.success(data.message)
          dispatch(SetUser(data.user))
      }
      else{
          toast.error("User not found")
      }
      

  } catch (error) {
      console.log(error)
  }
}

  return (
    <>    
    <div
    className="min-h-screen w-full flex items-center bg-cover bg-center bg-no-repeat"

      style={{
        // backgroundImage: "url('/Login bg.jpg')",
        // backgroundSize: "140%", // Zoom in (increase size)
        // backgroundPosition: "bottom left", // Align to bottom-left
        backgroundImage: "url('/Login bg.jpg')",
      }} // Background image
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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Login</h2>
        </div>
        
         {/* Spacing Divider */}
         <div className="h-6 sm:h-8 md:h-6"></div>

{/* Form */}

        <form  onSubmit={handleSubmit}>
        
          {/* Bitsathy Mail */}
          <div>
            <label htmlFor="email" className="block text-[20px] font-medium text-gray-900 [text-indent:1rem] sm:[text-indent:1.5rem] md:[text-indent:1.5rem]">E-Mail</label>
            <div className="h-4 sm:h-6 md:h-4"></div>
            <div className="flex items-center rounded-full">
            <div className="w-[15px] "> {/* Extra div for left-right padding */}
            </div>
            <div className="w-[92%] mx-auto"> 
            <input
              type="email"
              name='email'
              value={value.email}
              onChange={handleChange}
               id="email"
              className="w-full h-10 sm:h-12 [text-indent:1rem] sm:[text-indent:1.25rem] pr-3 sm:pr-4 rounded-full bg-gray-200 focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div></div></div>

          {/* Extra Divider */}
          <div className="h-6 sm:h-8 md:h-6"></div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-[20px] font-medium text-gray-900 [text-indent:1rem] sm:[text-indent:1.5rem] md:[text-indent:1.5rem]">Password</label>
            <div className="h-4 sm:h-6 md:h-4"></div>
            <div className="flex items-center rounded-full">
            <div className="w-[15px] "> {/* Extra div for left-right padding */}
            </div>
            <div className="w-[92%] mx-auto"> 
            <input
              type="password"
              value={value.password}
              onChange={handleChange}                           
              name='password'
              id="password"
              className="w-full h-10 sm:h-12 [text-indent:1rem] sm:[text-indent:1.25rem] pr-3 sm:pr-4 rounded-full bg-gray-200 focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div></div></div>

          {/* Extra Divider */}
          <div className="h-8 sm:h-10 md:h-8"></div>
          
          
         
           {/* Sign In Button */}
          
          <div className="flex items-center rounded-full">
            <div className="w-[15px] "> {/* Extra div for left-right padding */}
            </div>
            <div className="w-[92%] mx-auto"> 
            <button className="w-full h-10 sm:h-12 text-white bg-blue-500 rounded-full hover:bg-blue-600 transition " >
              Sign In
            </button>
          </div></div>

          {/* Extra Divider */}
          <div className="h-6 sm:h-8 md:h-6"></div>
          {/* Register Link */}
          <p className="text-sm text-gray-700 text-center mt-4">
            Don’t have an account?{"  "}
            <Link to="/register" className="text-blue-700 underline font-semibold ml-[50px]">
              Register
            </Link>
          </p>
          
          <div className="flex items-center rounded-full">
            <div className="w-[8px] h-[10px] "> {/* Extra div for left-right padding */}
            </div>
            </div>
        </form>
      </div>
    </div>
    </>
  );
  
};

export default Login;
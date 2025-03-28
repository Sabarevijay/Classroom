import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Spline from "@splinetool/react-spline";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";
import { get, post } from "../services/Endpoint";

const GoogleLogin1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const saveUserData = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleGoogleSuccess = async (response) => {
    try {
      setIsLoading(true);
      const userInfo = jwtDecode(response.credential);
      
      const res = await post("/api/auth/google", {
        token: response.credential,
      });

      const userData = {
        name: userInfo.name,
        email: userInfo.email,
        imageUrl: userInfo.picture,
      };

      saveUserData(userData);
      
      if (rememberMe) {
        localStorage.setItem("token", res.data.token);
      } else {
        sessionStorage.setItem("token", res.data.token);
      }

      toast.success("Login Successful!");
      navigate(res.data.redirectUrl || "/home");
    } catch (error) {
      console.error("Google Login Failed:", error);
      toast.error(error.response?.data?.message || "Google Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Login Failed", error);
    toast.error("Google Login Failed. Please try again.");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await post("/api/auth/login", formData);
      
      const userRes = await get("/api/user/profile", {
        headers: { Authorization: `Bearer ${res.data.token}` }
      });

      const userData = {
        name: userRes.data.name,
        email: userRes.data.email,
        imageUrl: userRes.data.profileImage || '/default-avatar.png'
      };

      saveUserData(userData);

      if (rememberMe) {
        localStorage.setItem("token", res.data.token);
      } else {
        sessionStorage.setItem("token", res.data.token);
      }

      toast.success("Login Successful!");
      navigate("/home");
      console.log("Google login successful! Navigating to home...");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSplineLoad = (spline) => {
    setSplineLoaded(true);
    setTimeout(() => {
      const watermarks = document.querySelectorAll('a[href*="spline.design"]');
      watermarks.forEach(watermark => {
        if (watermark && watermark.parentNode) {
          watermark.parentNode.removeChild(watermark);
        }
      });
    }, 100);
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden" style={{ backgroundColor: "#d4d5e5" }}>
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute top-5 left-5 w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 opacity-75"
        animate={{ y: [0, -10, 10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute bottom-[-150px] right-[-100px] w-[350px] h-[350px] rounded-full bg-gradient-to-r from-pink-500 to-purple-600 opacity-50"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />

      {/* Main Login Box */}
      <div className="flex w-full max-w-4xl shadow-lg rounded-xl overflow-hidden border border-gray-400" style={{ backgroundColor: "#d4d5e5" }}>
        {/* Left Side - Form */}
        <motion.div
          initial={{ opacity: 0, rotateY: 90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 p-8"
        >
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-6">
            Login to Your Account
          </h2>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
                required
              />
            </div>

            {/* Password Input with Toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-gray-700 text-sm">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="mr-2"
                />
                Remember me
              </label>
              <button 
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95, rotate: -1 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>

          {/* OR Separator */}
          <div className="my-4 flex items-center justify-center">
            <div className="w-1/4 border-t border-gray-400"></div>
            <span className="mx-4 text-sm text-gray-600">Or continue with</span>
            <div className="w-1/4 border-t border-gray-400"></div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center mb-4">
            <GoogleLogin 
              onSuccess={handleGoogleSuccess} 
              onError={handleGoogleFailure}
              type="standard"
              theme="filled_blue"
              size="large"
              flow="implicit"
               useOneTap={false} 
              text="signin_with"
            />
          </div>

          {/* Sign Up Link */}
          <div className="text-center text-gray-700 text-sm">
            Don't have an account? 
            <button 
              onClick={handleSignUp}
              className="ml-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign Up
            </button>
          </div>
        </motion.div>

        {/* Right Side - Spline 3D Animation */}
        <div className="hidden md:block md:w-1/2 relative overflow-hidden" style={{ backgroundColor: "#d4d5e5" }}>
          <div className="absolute bottom-0 left-0 right-0 h-15 z-10" style={{ backgroundColor: "#d4d5e5" }}></div>
          <div className="absolute inset-0">
            <Spline 
              scene="https://prod.spline.design/gKiJvDcwelUiyNF4/scene.splinecode" 
              onLoad={handleSplineLoad} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleLogin1;
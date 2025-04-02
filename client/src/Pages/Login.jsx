import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../services/Endpoint";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { SetUser } from "../redux/AuthSlice";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Spline from "@splinetool/react-spline";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "690691222870-8fmk6jvbsp5mkujc28s1tivqvqito4be.apps.googleusercontent.com";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [value, setValue] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);

  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      const response = await post("/auth/login", value, {
        withCredentials: true
      });
      const data = response.data;
      
      if (data.success) {
        localStorage.setItem("token", data.token);
        dispatch(SetUser(data.user));
        toast.success(data.message);
        navigate("/home");
      } else {
        toast.error(data.message);
        setError(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Login failed. Please try again.");
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await post("/auth/google", {
        token: response.credential
      });
      
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        dispatch(SetUser({
          email: res.data.user?.email,
          Register: res.data.user?.Register,
          role: res.data.user?.role
        }));
        toast.success("Google Login successful");
        navigate("/home");
      } else {
        toast.error("Google Login failed");
        setError("Google Login failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Google Login failed");
      setError("Google Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleFailure = () => {
    setError("Google Login failed");
    toast.error("Google Login failed");
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

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex items-center justify-center bg-[#d5d4e6] px-6 py-12 relative overflow-hidden">
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
        <div className="flex w-full max-w-4xl bg-[#d5d4e6] bg-opacity-90 backdrop-blur-xl shadow-lg rounded-xl overflow-hidden border border-gray-300">
          {/* Left Side - Form */}
          <motion.div
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 p-8"
          >
            <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
              Login to Your Account
            </h2>

            {error && (
              <div className="text-red-500 text-center text-sm mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={value.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Input with Toggle */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={value.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-between">
                <div></div>
                <Link to="/register" className="text-sm text-blue-600 hover:text-blue-500">
                  Don’t have an account? Register
                </Link>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95, rotate: -1 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg transition duration-200"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </motion.button>
            </form>

            {/* OR Separator */}
            <div className="my-4 text-center text-gray-600">
             

 <span className="text-sm">Or continue with</span>
            </div>

            {/* Google Login */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                disabled={isLoading}
                flow="auth-code" // Use authorization code flow
                redirect_uri="http://localhost:8000/auth/google/callback" // Your callback URL
              />
            </div>
          </motion.div>

          {/* Right Side - Spline 3D Animation */}
          <div className="hidden md:block md:w-1/2 relative overflow-hidden" style={{ backgroundColor: "#d5d4e6" }}>
            <div className="absolute bottom-0 left-0 right-0 h-15 z-10" style={{ backgroundColor: "#d5d4e6" }}></div>
            <div className="absolute inset-0">
              <Spline scene="https://prod.spline.design/gKiJvDcwelUiyNF4/scene.splinecode" onLoad={handleSplineLoad} />
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
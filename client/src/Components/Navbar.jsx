import React, { useState, useRef, useEffect } from 'react';
import { Plus, User, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { classPost, post } from '../services/Endpoint';
import { RemoveUser } from '../redux/AuthSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate=useNavigate()
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const [isLoading,setIsLoading]=useState(false)
  const [className, setClassName] = useState('');
  

  const openPopup = () => {
    setIsPopupOpen(true);
    setIsUserMenuOpen(false);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isPopupOpen) setIsPopupOpen(false);
  };
  
  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
  };
  const handleCreateClass = async () => {
    if (className.trim()) {
      try {
        setIsLoading(true)
        const response = await classPost('/class/createclass', { ClassName: className });
        // console.log('Class created:', response.data);
        closePopup();
        setClassName('');
    
        toast.success("Class created successfully")
        
      } catch (error) {
        console.error('Error creating class:', error);
        toast.error(error)
      }
      finally{
        setIsLoading(false)
        window.location.reload();

      }
    }
  };
  const handleLogout = async () => {
    try {
      const response = await post(`/auth/logout`);
      const data = response.data;
      console.log(data);
      if (response.status == 200) {
        navigate("/");
        dispatch(RemoveUser());
        toast.success("Logout Successfully");
      }
    } catch (error) {
      console.log(error);
    }

    
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuRef]);

  if(isLoading){
    return (
      <div className="flex justify-center items-center min-h-[800px]">
        <div className="h-10 w-10 bg-blue-500 rounded-full animate-ping"></div>
      </div>
    );
  }

  return (
    <>
      <nav 
        className="fixed top-0 left-[129px] right-0 bg-[#BDC7D9] shadow-sm z-50 flex items-center justify-between px-6" 
        style={{ height: "114px" }}
      >
        <div className="flex items-center space-x-4">
          <img 
            src="/logo2.png" 
            alt="BIT ClassRoom Logo" 
            className="h-[100px] w-[100px]"
          />
          <span className="text-[40px] font-semibold text-[#3A2C76]">BIT ClassRoom</span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            className="border-2 border-black text-black rounded-full w-10 h-10 flex items-center justify-center absolute right-35 transform transition-transform hover:scale-115"
            onClick={openPopup}
            style={{cursor:'pointer' }}
          >
            <Plus size={25} />
          </button>
          <button 
            className="rounded-full w-10 h-10 flex items-center justify-center absolute right-15 transform transition-transform hover:scale-115"
            onClick={toggleUserMenu}
            style={{cursor:'pointer' }}
          >
            <User size={35} />
          </button>
        </div>
      </nav>

      {isPopupOpen && (
        <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/3 z-[100]">
          <div className="bg-white rounded-lg w-full max-w-2xl shadow-lg relative overflow-hidden p-8">
            <button
              onClick={closePopup}
              className="absolute top-4 right-6 p-1 rounded-full hover:bg-gray-100"
              
            >
              <X size={28} style={{cursor:'pointer' }} />
            </button>
            <div className="p-8" style={{ height: "200px", width: "300px" }}>
              <h2 className="text-4xl font-bold mb-8">Create Class</h2>
              <div className="mb-8">
                <label className="block text-xl mb-2">Enter a Class name</label>
                <input
                  id="class-name"
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
              </div>
              <div className="flex justify-center">
                <button
                  className="bg-[#6371A5] text-white py-4 px-20 rounded-lg text-2xl"
                  onClick={handleCreateClass}
                  style={{cursor:'pointer' }}
                >
                  Create
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {isUserMenuOpen && (
        <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/3 z-[100]" ref={userMenuRef}>
          <div className="bg-white rounded-lg shadow-lg relative overflow-hidden" style={{ width: "240px",height: "150px" }}>
            <button
              onClick={closeUserMenu}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>
            <div className="p-4 flex flex-col space-y-2" style={{ height: "100px", }}>
              <button 
                className="w-full py-2 px-4 text-xl font-bold text-center" style={{ height: "200px", width: "250px",marginTop:"25px",padding:"20px",cursor:'pointer' }}
                
                onClick={handleLogout}
              >
                Logout
              </button>
              <button 
                className="w-full py-2 px-4 text-xl font-bold text-center" style={{ height: "200px", width: "250px",cursor:'pointer'  }}
                // onClick={() => {
                //   // Add update functionality here
                //   closeUserMenu();
                // }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
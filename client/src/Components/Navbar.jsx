import React, { useState, useRef, useEffect } from 'react';
import { Plus, User, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { classPost, post } from '../services/Endpoint';
import { RemoveUser } from '../redux/AuthSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Inline CSS for the Navbar
const styles = `
  /* Navbar */
  .navbar {
    position: fixed;
    top: 0;
    left: 80px; /* Match the collapsed sidebar width */
    right: 0;
    background-color: #fff; /* White theme */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 50; /* Lower than sidebar to prevent overlap */
    display: flex;
    align-items: center;
    justify-content: center; /* Center the logo and title */
    padding: 0 2rem;
    height: 70px;
  }

  .navbar-logo {
    height: 50px;
    width: 50px;
  }

  .navbar-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #6b48ff; /* Purple to match the theme */
    margin-left: 1rem;
  }

  .navbar-right {
    position: absolute;
    right: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem; /* Space between buttons and profile */
  }

  .add-classroom-button {
    background-color: #fff;
    border: 2px solid #6b48ff;
    color: #6b48ff;
    border-radius: 50%; /* Circular button */
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out, background-color 0.2s, color 0.2s;
  }

  .add-classroom-button:hover {
    transform: rotate(90deg); /* Simple rotate animation on hover */
    background-color: #6b48ff;
    color: #fff;
    cursor: pointer;
  }

  .profile-container {
    display: flex;
    align-items: center;
  }

  .profile-wrapper {
    position: relative;
    cursor: pointer;
  }

  .profile-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #6b48ff;
    object-fit: cover;
    transition: transform 0.2s;
  }

  .profile-image:hover {
    transform: scale(1.1);
  }

  .profile-placeholder {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #6b48ff;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    font-weight: 600;
    border: 2px solid #6b48ff;
    transition: transform 0.2s;
  }

  .profile-placeholder:hover {
    transform: scale(1.1);
  }

  .profile-input {
    display: none;
  }

  .profile-role {
    margin-left: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    color: #333;
  }

  /* Dropdown Menu */
  .dropdown-menu {
    position: absolute;
    top: 60px;
    right: 0;
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    width: 150px;
    padding: 0.5rem 0;
    z-index: 100; /* Higher than navbar to ensure visibility */
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  }

  .dropdown-menu.open {
    opacity: 1;
    transform: translateY(0);
  }

  .dropdown-item {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    font-weight: 500;
    color: #333;
    border: none;
    background: none;
    text-align: left;
    transition: background-color 0.2s, transform 0.2s;
  }

  .dropdown-item:hover {
    background-color: #f1f7ff;
    transform: scale(1.02);
    cursor: pointer;
  }

  /* Popup (Add Classroom) */
  .popup-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
  }

  .popup {
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    padding: 2rem;
    width: 100%;
    max-width: 400px;
    position: relative;
  }

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.25rem;
    border-radius: 50%;
    color: #6b48ff;
    transition: background-color 0.2s, transform 0.2s;
  }

  .close-button:hover {
    background-color: #f1f7ff;
    transform: scale(1.1);
    cursor: pointer;
  }

  .popup-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #000;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .popup-input {
    width: 100%;
    padding: 0.75rem;
    background-color: #fff;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    color: #333;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .popup-input:focus {
    outline: none;
    border-color: #6b48ff;
    box-shadow: 0 0 0 3px rgba(107, 72, 255, 0.2);
  }

  .popup-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #6b48ff;
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    transition: background-color 0.2s, transform 0.2s;
  }

  .popup-button:hover {
    background-color: #5a3de6;
    transform: scale(1.02);
    cursor: pointer;
  }

  /* Loading Spinner */
  .spinner {
    width: 4rem;
    height: 4rem;
    border: 4px solid #6b48ff;
    border-top: 4px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for Add Classroom popup
  const [className, setClassName] = useState(''); // State for class name input
  const userMenuRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // State for profile image

  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role;
  const userName = user?.name || "User"; // Fallback to "User" if name is not available
  const firstLetter = userName.charAt(0).toUpperCase(); // Get the first letter of the user's name

  const openPopup = () => {
    setIsPopupOpen(true);
    setIsUserMenuOpen(false);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setClassName('');
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isPopupOpen) setIsPopupOpen(false);
  };

  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleCreateClass = async () => {
    if (className.trim()) {
      try {
        setIsLoading(true);
        const response = await classPost('/class/createclass', { ClassName: className });
        closePopup();
        setClassName('');
        toast.success("Class created successfully");
      } catch (error) {
        console.error('Error creating class:', error);
        toast.error(error);
      } finally {
        setIsLoading(false);
        window.location.reload();
      }
    }
  };

  const handleLogout = async () => {
    try {
      const response = await post(`/auth/logout`);
      const data = response.data;
      console.log(data);
      if (response.status === 200) {
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <nav className="navbar">
        <div className="flex items-center">
          <img
            src="/logo2.png"
            alt="BIT ClassRoom Logo"
            className="navbar-logo"
          />
          <span className="navbar-title">BIT ClassRoom</span>
        </div>
        <div className="navbar-right" ref={userMenuRef}>
          {userRole === "admin" && location.pathname === "/home" && (
            <button
              className="add-classroom-button"
              onClick={openPopup}
            >
              <Plus size={20} />
            </button>
          )}
          <div className="profile-container">
            <div className="profile-wrapper">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="profile-image"
                  onClick={toggleUserMenu}
                />
              ) : (
                <div className="profile-placeholder" onClick={toggleUserMenu}>
                  {firstLetter}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="profile-input"
                onChange={handleImageUpload}
                id="profile-image-upload"
              />
            </div>
            <span className="profile-role">{userRole || "User"}</span>
            {isUserMenuOpen && (
              <div className={`dropdown-menu ${isUserMenuOpen ? 'open' : ''}`}>
                <button
                  className="dropdown-item"
                  onClick={handleLogout}
                >
                  Logout
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    // Add update functionality here
                    closeUserMenu();
                  }}
                >
                  Update
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {isPopupOpen && (
        <div className="popup-container">
          <div className="popup">
            <button
              onClick={closePopup}
              className="close-button"
            >
              <X size={24} />
            </button>
            <h2 className="popup-title">Add Classroom</h2>
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Enter a Class name
              </label>
              <input
                id="class-name"
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="popup-input"
              />
            </div>
            <button
              className="popup-button"
              onClick={handleCreateClass}
            >
              Create
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
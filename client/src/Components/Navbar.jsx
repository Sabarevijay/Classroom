import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, AlignJustify, Home, Archive, Users, UserCheck, Settings, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import { classPost, post } from '../services/Endpoint';
import { RemoveUser } from '../redux/AuthSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSidebar } from '../context/SidebarContext'; // Import the custom hook

// Updated CSS styles
const styles = `
  /* Navbar */
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    backdrop-blur-lg;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    z-index: 20;
    display: flex;
    align-items: center;
    padding: 1rem 1rem;
    height: 64px;
    transition: left 0.3s ease-in-out; /* Smooth transition for left property */
  }

  @media (min-width: 768px) {
    .navbar {
      left: 80px; /* Default left offset when sidebar is collapsed */
    }
    .navbar.sidebar-hovered {
      left: 256px; /* Match the expanded sidebar width */
    }
  }

  .navbar-logo {
    height: 40px;
    width: auto;
    filter: brightness-125 contrast-100;
  }

  .navbar-title {
    font-size: 1.25rem;
    font-weight: 700;
    background: linear-gradient(to right, #3b82f6, #2563eb);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin-left: 0.75rem;
    display: none;
  }

  @media (min-width: 768px) {
    .navbar-title {
      display: inline;
    }
  }

  .navbar-right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .add-classroom-button {
    padding: 0.625rem;
    border-radius: 9999px;
    color: #3b82f6;
    transition: all 0.2s ease-in-out;
  }

  .add-classroom-button:hover {
    background-color: rgba(59, 130, 246, 0.1);
    color: #2563eb;
    cursor: pointer;
  }

  .profile-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .profile-wrapper {
    cursor: pointer;
  }

  .profile-image {
    width: 40px;
    height: 40px;
    border-radius: 9999px;
    border: 2px solid rgba(59, 130, 246, 0.3);
    object-fit: cover;
    transition: all 0.2s ease-in-out;
  }

  .profile-image:hover {
    border-color: rgba(59, 130, 246, 0.6);
  }

  .profile-placeholder {
    width: 40px;
    height: 40px;
    border-radius: 9999px;
    background-color: #e5e7eb;
    color: #374151;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    font-weight: 600;
    border: 2px solid rgba(59, 130, 246, 0.3);
    transition: all 0.2s ease-in-out;
  }

  .profile-placeholder:hover {
    border-color: rgba(59, 130, 246, 0.6);
  }

  .profile-input {
    display: none;
  }

  .profile-role {
    margin-left: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    display: none;
  }

  @media (min-width: 768px) {
    .profile-role {
      display: inline;
    }
  }

  /* Dropdown Menu */
  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #fff;
    border-radius: 0.75rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 1px solid #e5e7eb;
    width: 14rem;
    padding: 0.5rem 0;
    z-index: 30;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease-in-out;
  }

  .dropdown-menu.open {
    opacity: 1;
    transform: translateY(0);
  }

  .dropdown-item {
    width: 100%;
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    background: none;
    border: none;
    text-align: left;
    transition: all 0.2s ease-in-out;
    display: flex;
    align-items: center;
  }

  .dropdown-item:hover {
    background-color: #f3f4f6;
    cursor: pointer;
  }

  .dropdown-user-info {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .dropdown-user-email {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.25rem;
  }

  .dropdown-user-role {
    font-size: 0.75rem;
    font-weight: 500;
    color: #3b82f6;
  }

  /* Popup (Add Classroom) */
  .popup-container {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-blur-sm;
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .popup {
    background-color: #fff;
    border-radius: 0.75rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 1.5rem;
    width: 100%;
    max-width: 28rem;
    position: relative;
    transform: scale(0.95);
    transition: transform 0.2s ease-in-out;
  }

  .popup-container .popup {
    transform: scale(1);
  }

  .close-button {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    padding: 0.25rem;
    border-radius: 9999px;
    color: #374151;
    transition: all 0.2s ease-in-out;
  }

  .close-button:hover {
    background-color: #e5e7eb;
    cursor: pointer;
  }

  .popup-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 1rem;
    text-align: left;
  }

  .popup-input {
    width: 100%;
    padding: 0.625rem 1rem;
    background-color: #fff;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    color: #374151;
    transition: all 0.2s ease-in-out;
  }

  .popup-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  .popup-button {
    width: 100%;
    padding: 0.625rem;
    background-color: #3b82f6;
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    transition: all 0.2s ease-in-out;
  }

  .popup-button:hover {
    background-color: #2563eb;
    cursor: pointer;
  }

  /* Loading Spinner */
  .spinner {
    width: 3rem;
    height: 3rem;
    border: 3px solid #3b82f6;
    border-top: 3px solid transparent;
    border-radius: 9999px;
    animation: spin 1s linear infinite;
    margin: auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Mobile Sidebar (Integrated into Navbar) */
  .mobile-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    background-color: #fff;
    backdrop-blur-lg;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
    z-index: 30;
    width: 0;
    transform: translateX(-100%);
    overflow: hidden;
  }

  .mobile-sidebar.open {
    width: 256px;
    transform: translateX(0);
  }

  /* Menu Button in Mobile Sidebar */
  .menu-button {
    padding: 1.25rem;
    display: flex;
    justify-content: center; /* Centered by default */
    transition: all 0.3s ease-in-out;
  }

  .mobile-sidebar.open .menu-button {
    justify-content: flex-end; /* Move to right when mobile sidebar is open */
  }

  .menu-icon {
    color: #374151;
    transition: all 0.3s ease-in-out;
  }

  .menu-button:hover .menu-icon {
    color: #3b82f6;
    cursor: pointer;
  }

  /* Animation for mobile menu icon */
  .menu-icon-open {
    animation: rotateToCross 0.3s ease-in-out forwards;
  }

  .menu-icon-close {
    animation: rotateToHamburger 0.3s ease-in-out forwards;
  }

  @keyframes rotateToCross {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(90deg);
    }
  }

  @keyframes rotateToHamburger {
    0% {
      transform: rotate(90deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  /* Classroom Name in Mobile Sidebar */
  .mobile-classroom-name {
    padding: 1rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280; /* Dull color (muted gray) */
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
  }

  .mobile-sidebar.open .mobile-classroom-name {
    justify-content: flex-start;
  }

  /* Horizontal Line in Mobile Sidebar */
  .mobile-horizontal-line {
    width: 80%;
    height: 1px;
    background-color: #e5e7eb;
    margin: 0 auto;
  }

  .mobile-nav-links {
    display: flex;
    flex-direction: column;
    padding: 1.5rem 0.75rem;
    gap: 0.5rem;
    height: calc(100vh - 120px); /* Adjust height to account for menu button, classroom name, and horizontal line */
    justify-content: space-between; /* Push the last item (Settings) to the bottom */
  }

  .mobile-nav-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.75rem;
    color: #000000; /* Black color for navigation links */
    border-radius: 0.5rem;
    transition: all 0.3s ease-in-out;
  }

  .mobile-nav-item:hover {
    background-color: #f3f4f6;
    color: #000000; /* Black color on hover */
    cursor: pointer;
  }

  .mobile-nav-item.active {
    background-color: #e5e7eb;
    color: #3b82f6;
    border-left: 4px solid #3b82f6;
  }

  /* Add bottom margin to the Settings tab in mobile view */
  .mobile-nav-item.settings {
    margin-bottom: 20px; /* 20px margin from the bottom */
  }

  .mobile-nav-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }

  .mobile-nav-text {
    margin-left: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .mobile-menu-button {
    padding: 0.5rem;
    margin-right: 0.5rem;
    display: flex;
    align-items: center;
  }

  .mobile-menu-icon {
    color: #374151;
    transition: all 0.2s ease-in-out;
  }

  .mobile-menu-button:hover .mobile-menu-icon {
    color: #3b82f6;
    cursor: pointer;
  }

  /* Mobile Backdrop */
  .mobile-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 20;
    display: none;
  }

  .mobile-backdrop.open {
    display: block;
  }
`;

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileSidebarHovered, setIsMobileSidebarHovered] = useState(false); // Track hover state for mobile
  const [className, setClassName] = useState('');
  const userMenuRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { isSidebarHovered } = useSidebar(); // Use the context to get hover state

  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role;
  const userName = user?.name || "User";
  const userEmail = user?.email || "user@example.com";
  const firstLetter = userName.charAt(0).toUpperCase();
  // Assuming classroom name is available in the Redux store
  const classroomName = useSelector((state) => state.classroom?.name) || "Classroom"; // Fallback if not available

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
    setIsMobileSidebarHovered(!isMobileSidebarOpen); // Update hover state for mobile
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
      <nav className={`navbar ${isSidebarHovered ? 'sidebar-hovered' : ''}`}>
        <div className="flex items-center">
          {isMobile && (
            <div className="mobile-menu-button">
              <button onClick={toggleMobileSidebar}>
                {isMobileSidebarOpen || isMobileSidebarHovered ? (
                  <X size={24} className={`mobile-menu-icon ${isMobileSidebarOpen || isMobileSidebarHovered ? 'mobile-menu-icon-open' : 'mobile-menu-icon-close'}`} />
                ) : (
                  <AlignJustify size={24} className={`mobile-menu-icon ${isMobileSidebarOpen || isMobileSidebarHovered ? 'mobile-menu-icon-open' : 'mobile-menu-icon-close'}`} />
                )}
              </button>
            </div>
          )}
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
                <div className="dropdown-user-info">
                  <p className="dropdown-user-email">{userEmail}</p>
                  <p className="dropdown-user-role">{userRole || "User"}</p>
                </div>
                <button
                  className="dropdown-item"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
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

      {isMobile && (
        <>
          <div className={`mobile-sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
            <div className="menu-button">
              <button onClick={toggleMobileSidebar}>
                {isMobileSidebarOpen || isMobileSidebarHovered ? (
                  <X size={24} className={`menu-icon ${isMobileSidebarOpen || isMobileSidebarHovered ? 'menu-icon-open' : 'menu-icon-close'}`} />
                ) : (
                  <AlignJustify size={24} className={`menu-icon ${isMobileSidebarOpen || isMobileSidebarHovered ? 'menu-icon-open' : 'menu-icon-close'}`} />
                )}
              </button>
            </div>

            {/* Classroom Name and Horizontal Line */}
            <div className="mobile-classroom-name">
              {classroomName}
            </div>
            <div className="mobile-horizontal-line"></div>

            <nav className="mobile-nav-links">
              <div className="top-links"> {/* Group top links together */}
                <div
                  className={`mobile-nav-item ${window.location.pathname === "/home" ? "active" : ""}`}
                  onClick={() => {
                    navigate("/home");
                    setIsMobileSidebarOpen(false);
                  }}
                >
                  <Home size={20} className="mobile-nav-icon" />
                  <span className="mobile-nav-text">Classroom</span>
                </div>
                {userRole === 'admin' && (
                  <>
                    <div
                      className={`mobile-nav-item ${window.location.pathname === '/admin/students' ? 'active' : ''}`}
                      onClick={() => {
                        navigate('/admin/students');
                        setIsMobileSidebarOpen(false);
                      }}
                    >
                      <Users size={20} className="mobile-nav-icon" />
                      <span className="mobile-nav-text">Student</span>
                    </div>
                    <div
                      className={`mobile-nav-item ${window.location.pathname === '/admin/faculty' ? 'active' : ''}`}
                      onClick={() => {
                        navigate('/admin/faculty');
                        setIsMobileSidebarOpen(false);
                      }}
                    >
                      <GraduationCap size={20} className="mobile-nav-icon" />
                      <span className="mobile-nav-text">Faculty</span>
                    </div>
                    <div
                      className={`mobile-nav-item ${window.location.pathname === '/admin/mentor' ? 'active' : ''}`}
                      onClick={() => {
                        navigate('/admin/mentor');
                        setIsMobileSidebarOpen(false);
                      }}
                    >
                      <UserCheck size={20} className="mobile-nav-icon" />
                      <span className="mobile-nav-text">Mentor</span>
                    </div>
                  </>
                )}
              </div>
              {userRole === 'admin' && (
                <div className="bottom-links"> {/* Group bottom links (Settings) */}
                  <div
                    className={`mobile-nav-item ${window.location.pathname === '/admin/archived' ? 'active' : ''}`}
                    onClick={() => {
                      navigate('/admin/archived');
                      setIsMobileSidebarOpen(false);
                    }}
                  >
                    <Archive size={20} className="mobile-nav-icon" />
                    <span className="mobile-nav-text">Archived Class</span>
                  </div>
                  <div
                    className={`mobile-nav-item settings ${window.location.pathname === '/admin/settings' ? 'active' : ''}`}
                    onClick={() => {
                      navigate('/admin/settings');
                      setIsMobileSidebarOpen(false);
                    }}
                  >
                    <Settings size={20} className="mobile-nav-icon" />
                    <span className="mobile-nav-text">Settings</span>
                  </div>
                </div>
              )}
            </nav>
          </div>
          {isMobileSidebarOpen && (
            <div
              className={`mobile-backdrop ${isMobileSidebarOpen ? 'open' : ''}`}
              onClick={toggleMobileSidebar}
            />
          )}
        </>
      )}

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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
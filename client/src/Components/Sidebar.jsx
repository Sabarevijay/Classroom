import React, { useState, useRef } from 'react';
import { Home, Archive, AlignJustify, X, Users, UserCheck, Settings, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSidebar } from '../context/SidebarContext'; // Import the custom hook

// Updated CSS styles
const styles = `
  /* Sidebar */
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    background-color: #fff;
    backdrop-blur-lg;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
    z-index: 30;
    width: 80px;
    overflow: hidden;
    display: none;
  }

  @media (min-width: 768px) {
    .sidebar {
      display: block;
    }
    .sidebar:hover {
      width: 256px;
    }
  }

  /* Menu Button */
  .menu-button {
    padding: 1.25rem;
    display: flex;
    justify-content: center;
    transition: all 0.3s ease-in-out;
  }

  .sidebar.open .menu-button,
  .sidebar:hover .menu-button {
    justify-content: flex-end; /* Move to right when sidebar is open or hovered */
  }

  .menu-icon {
    color: #374151;
    transition: all 0.3s ease-in-out;
  }

  .menu-button:hover .menu-icon {
    color: #3b82f6;
    cursor: pointer;
  }

  /* Animation for menu icon */
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

  /* Classroom Name */
  .classroom-name {
    padding: 1rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280; /* Dull color (muted gray) */
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
  }

  .sidebar:hover .classroom-name,
  .sidebar.open .classroom-name {
    justify-content: flex-start;
  }

  /* Horizontal Line */
  .horizontal-line {
    width: 80%;
    height: 1px;
    background-color: #e5e7eb;
    margin: 0 auto;
  }

  /* Navigation Links */
  .nav-links {
    display: flex;
    flex-direction: column;
    padding: 1.5rem 0.75rem;
    gap: 0.5rem;
    height: calc(100vh - 120px); /* Adjust height to account for menu button, classroom name, and horizontal line */
    justify-content: space-between; /* Push the last item (Settings) to the bottom */
  }

  .nav-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.75rem;
    color: #000000; /* Black color for navigation links */
    border-radius: 0.5rem;
    transition: all 0.3s ease-in-out;
  }

  .nav-item:hover {
    background-color: #f3f4f6;
    color: #000000; /* Black color on hover */
    cursor: pointer;
  }

  .nav-item.active {
    background-color: #e5e7eb;
    color: #3b82f6; /* Blue color for active link */
    border-left: 4px solid #3b82f6;
  }

  /* Add bottom margin to the Settings tab */
  .nav-item.settings {
    margin-bottom: 20px; /* 20px margin from the bottom */
  }

  .nav-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }

  .nav-text {
    margin-left: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .sidebar:hover .nav-text,
  .sidebar.open .nav-text {
    opacity: 1;
  }

  /* Mobile Backdrop */
  .backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 20;
    display: none;
  }

  @media (max-width: 767px) {
    .backdrop.open {
      display: block;
    }
  }
`;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // Track hover state
  const navigate = useNavigate();
  const userMenuRef = useRef();
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role;
  const { setIsSidebarHovered } = useSidebar(); // Use the context to set hover state
  // Assuming classroom name is available in the Redux store
  const classroomName = useSelector((state) => state.classroom?.name) || "Classroom"; // Fallback if not available

  const toggleSidebar = () => {
    console.log('Toggling sidebar. Current isOpen:', isOpen);
    setIsOpen(prev => !prev);
    console.log('New isOpen:', !isOpen);
  };

  const handleMouseEnter = () => {
    console.log('Mouse entered sidebar');
    setIsHovered(true);
    setIsSidebarHovered(true); // Update context on hover
  };

  const handleMouseLeave = () => {
    console.log('Mouse left sidebar');
    setIsHovered(false);
    setIsSidebarHovered(false); // Update context on mouse leave
  };

  return (
    <>
      <style>{styles}</style>
      <div
        className={`sidebar ${isOpen ? 'open' : ''}`}
        ref={userMenuRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="menu-button">
          <button onClick={toggleSidebar}>
            {(isOpen || isHovered) ? (
              <X size={24} className={`menu-icon ${isOpen || isHovered ? 'menu-icon-open' : 'menu-icon-close'}`} />
            ) : (
              <AlignJustify size={24} className={`menu-icon ${isOpen || isHovered ? 'menu-icon-open' : 'menu-icon-close'}`} />
            )}
          </button>
        </div>

        {/* Classroom Name and Horizontal Line */}
        <div className="classroom-name">
          {classroomName}
        </div>
        <div className="horizontal-line"></div>

        <nav className="nav-links">
          <div className="top-links"> {/* Group top links together */}
            <div
              className={`nav-item ${window.location.pathname === "/home" ? "active" : ""}`}
              onClick={() => navigate("/home")}
            >
              <Home size={20} className="nav-icon" />
              <span className="nav-text">Classroom</span>
            </div>
            {userRole === 'admin' && (
              <>
                <div
                  className={`nav-item ${window.location.pathname === '/admin/students' ? 'active' : ''}`}
                  onClick={() => navigate('/admin/students')}
                >
                  <Users size={20} className="nav-icon" />
                  <span className="nav-text">Student</span>
                </div>
                <div
                  className={`nav-item ${window.location.pathname === '/admin/faculty' ? 'active' : ''}`}
                  onClick={() => navigate('/admin/faculty')}
                >
                  <GraduationCap size={20} className="nav-icon" />
                  <span className="nav-text">Faculty</span>
                </div>
                <div
                  className={`nav-item ${window.location.pathname === '/admin/mentor' ? 'active' : ''}`}
                  onClick={() => navigate('/admin/mentor')}
                >
                  <UserCheck size={20} className="nav-icon" />
                  <span className="nav-text">Mentor</span>
                </div>
              </>
            )}
          </div>
          {userRole === 'admin' && (
            <div className="bottom-links"> {/* Group bottom links (Settings) */}
              <div
                className={`nav-item ${window.location.pathname === '/admin/archived' ? 'active' : ''}`}
                onClick={() => navigate('/admin/archived')}
              >
                <Archive size={20} className="nav-icon" />
                <span className="nav-text">Archived Class</span>
              </div>
              <div
                className={`nav-item settings ${window.location.pathname === '/admin/settings' ? 'active' : ''}`}
                onClick={() => navigate('/admin/settings')}
              >
                <Settings size={20} className="nav-icon" />
                <span className="nav-text">Settings</span>
              </div>
            </div>
          )}
        </nav>
      </div>

      {isOpen && (
        <div
          className={`backdrop ${isOpen ? 'open' : ''}`}
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
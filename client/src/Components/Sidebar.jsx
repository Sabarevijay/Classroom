import React, { useState } from 'react';
import { Home, Archive, AlignJustify, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { useSelector } from 'react-redux';

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
  }

  .menu-icon {
    color: #374151;
    transition: all 0.2s ease-in-out;
  }

  .menu-button:hover .menu-icon {
    color: #3b82f6;
    cursor: pointer;
  }

  /* Navigation Links */
  .nav-links {
    display: flex;
    flex-direction: column;
    padding: 1.5rem 0.75rem;
    gap: 0.5rem;
  }

  .nav-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.75rem;
    color: #6b7280;
    border-radius: 0.5rem;
    transition: all 0.3s ease-in-out;
  }

  .nav-item:hover {
    background-color: #f3f4f6;
    color: #374151;
    cursor: pointer;
  }

  .nav-item.active {
    background-color: #e5e7eb;
    color: #3b82f6;
    border-left: 4px solid #3b82f6;
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
  const navigate = useNavigate();
  const userMenuRef = useRef();
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <style>{styles}</style>
      <div className={`sidebar ${isOpen ? 'open' : ''}`} ref={userMenuRef}>
        <div className="menu-button">
          <button onClick={toggleSidebar}>
            {isOpen ? (
              <X size={24} className="menu-icon" />
            ) : (
              <AlignJustify size={24} className="menu-icon" />
            )}
          </button>
        </div>

        <nav className="nav-links">
          <div
            className={`nav-item ${window.location.pathname === "/home" ? "active" : ""}`}
            onClick={() => navigate("/home")}
          >
            <Home size={20} className="nav-icon" />
            <span className="nav-text">Home</span>
          </div>
          {userRole === 'admin' && (
            <div
              className={`nav-item ${window.location.pathname === '/admin/archived' ? 'active' : ''}`}
              onClick={() => navigate('/admin/archived')}
            >
              <Archive size={20} className="nav-icon" />
              <span className="nav-text">Archived Class</span>
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
import React, { useState } from "react";
import { Home, Archive, AlignJustify } from "lucide-react";
import { useNavigate } from 'react-router-dom';

// Inline CSS for the Sidebar
const styles = `
  /* Sidebar */
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    background-color: #fff; /* White theme */
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    transition: width 0.3s ease-in-out;
    z-index: 60; /* Higher than navbar to prevent overlap */
    width: 80px; /* Collapsed width */
    overflow: hidden;
  }

  .sidebar:hover {
    width: 240px; /* Expanded width */
  }

  /* Menu Button */
  .menu-button {
    padding: 1rem;
    display: flex;
    justify-content: center;
  }

  .menu-icon {
    color: #6b48ff; /* Purple to match the theme */
    transition: transform 0.3s ease-in-out;
  }

  .menu-button:hover .menu-icon {
    transform: scale(1.1);
    cursor: pointer;
  }

  /* Profile Section */
  .profile-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
  }

  .profile-image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-bottom: 1rem;
    border: 2px solid #6b48ff;
  }

  .profile-text {
    color: #333; /* Dark text for white theme */
    font-size: 1.25rem;
    font-weight: 600;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .sidebar:hover .profile-text {
    opacity: 1;
  }

  /* Navigation Links */
  .nav-links {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 3rem;
    gap: 1.5rem;
  }

  .nav-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.75rem 1rem;
    color: #333; /* Dark text for white theme */
    transition: background-color 0.2s, transform 0.2s;
  }

  .nav-item:hover {
    background-color: #f1f7ff; /* Light blue on hover */
    transform: scale(1.05);
    cursor: pointer;
  }

  .nav-item.active {
    background-color: #6b48ff; /* Purple for active item */
    color: #fff;
  }

  .nav-icon {
    flex-shrink: 0;
  }

  .nav-text {
    margin-left: 1rem;
    font-size: 1.1rem;
    font-weight: 500;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .sidebar:hover .nav-text {
    opacity: 1;
  }
`;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <style>{styles}</style>
      <div className="sidebar">
        {/* Top Section - Menu Button */}
        <div className="menu-button">
          <button onClick={() => setIsOpen(!isOpen)}>
            <AlignJustify size={40} className="menu-icon" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="profile-section">
          <img
            src="/src/assets/user-profile.jpeg"
            alt="Profile"
            className="profile-image"
          />
          <span className="profile-text">User</span>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <div
            className={`nav-item ${window.location.pathname === "/home" ? "active" : ""}`}
            onClick={() => navigate("/home")}
          >
            <Home size={30} className="nav-icon" />
            <span className="nav-text">Home</span>
          </div>
          <div
            className={`nav-item ${window.location.pathname === "/archived" ? "active" : ""}`}
            onClick={() => navigate("/archived")}
          >
            <Archive size={30} className="nav-icon" />
            <span className="nav-text">Archived Class</span>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
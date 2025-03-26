// src/pages/Archived.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Archive } from 'lucide-react';
import toast from 'react-hot-toast';
import { classGet, classPost } from '../services/Endpoint';

// Inline CSS for the Archived page
const styles = `
  /* Ensure global background color */
  :root, html, body, #root {
    background-color: #f5f5f5 !important;
  }

  /* Main Container */
  .archived-page {
    min-height: 100vh;
    background-color: #f5f5f5 !important;
    flex: 1;
    padding-top: 70px; /* Match navbar height */
    padding-left: 80px; /* Match sidebar collapsed width */
  }

  /* Grid for Cards */
  .class-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    padding: 2rem;
    justify-items: center;
  }

  /* Class Card */
  .class-card {
    position: relative;
    width: 100%;
    max-width: 300px;
    height: 200px;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start; /* Align items to the left */
    padding: 1rem;
    color: #fff;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
    /* Diagonal white stripes */
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
    );
    background-size: 20px 20px; /* Adjust stripe size */
  }

  .class-card:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  .class-initial {
    font-size: 3rem;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 0.5rem;
    text-align: left; /* Explicitly align text to the left */
  }

  .class-name {
    font-size: 1.25rem;
    font-weight: 600;
    text-align: left; /* Align text to the left */
  }

  /* Icons on Card */
  .card-icon {
    position: absolute;
    background-color: #fff;
    border-radius: 50%;
    padding: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, background-color 0.2s;
  }

  .card-icon:hover {
    transform: scale(1.1);
    background-color: #f1f7ff;
    cursor: pointer;
  }

  .unarchive-icon {
    bottom: 0.5rem;
    right: 0.5rem;
    color: #6b48ff;
  }

  /* Confirmation Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
  }

  .modal-content {
    background-color: #fff;
    border-radius: 1rem;
    padding: 2rem;
    width: 100%;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .modal-icon {
    color: #6b48ff;
    margin-bottom: 1rem;
  }

  .modal-text {
    font-size: 1.25rem;
    font-weight: 500;
    color: #333;
    margin-bottom: 1.5rem;
  }

  .modal-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .modal-button {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    transition: background-color 0.2s, transform 0.2s;
  }

  .modal-button.cancel {
    background-color: #e5e7eb;
    color: #333;
  }

  .modal-button.cancel:hover {
    background-color: #d1d5db;
    transform: scale(1.02);
  }

  .modal-button.confirm {
    background-color: #6b48ff;
    color: #fff;
  }

  .modal-button.confirm:hover {
    background-color: #5a3de6;
    transform: scale(1.02);
  }

  /* No Classes Message */
  .no-classes {
    text-align: center;
    color: #6b7280;
    font-size: 1.5rem;
    margin: 2rem 0;
  }

  /* Loading Spinner */
  .spinner {
    width: 2.5rem;
    height: 2.5rem;
    border: 4px solid #6b48ff;
    border-top: 4px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
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

const ArchivedClass = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { archivedClasses: contextArchivedClasses, getClass } = useOutletContext(); // Use context from AdminLayout
  const [archivedClasses, setArchivedClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false);
  const [classToUnarchive, setClassToUnarchive] = useState(null);

  const colors = [
    '#FF6F61', // Coral
    '#6B48FF', // Purple
    '#4CAF50', // Green
    '#FFCA28', // Yellow
    '#1E88E5', // Blue
    '#009688', // Teal
    '#795548', // Brown
    '#FF9800', // Orange
    '#3F51B5' // Indigo
  ];

  const fetchArchivedClasses = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching archived classes, user:', user); // Debug log
      if (user?.role !== 'admin') {
        console.log('User is not an admin, redirecting to /home'); // Debug log
        navigate('/home');
        return;
      }

      // Use context if available, otherwise fetch from API
      if (contextArchivedClasses && contextArchivedClasses.length > 0) {
        console.log('Using archived classes from context:', contextArchivedClasses); // Debug log
        setArchivedClasses(contextArchivedClasses);
      } else {
        console.log('Fetching archived classes from API'); // Debug log
        const response = await classGet('/class/getarchived');
        console.log('API Response from /class/getarchived:', response.data); // Debug log
        if (response.data.success) {
          const sortedClasses = response.data.archivedClasses.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setArchivedClasses(sortedClasses);
        } else {
          setArchivedClasses([]);
          toast.error(response.data.message || 'No archived classes found');
        }
      }
    } catch (error) {
      //console.error('Error fetching archived classes:', error);
      //toast.error('Failed to fetch archived classes');
      setArchivedClasses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnarchive = async () => {
    if (!classToUnarchive) return;
    try {
      setIsLoading(true);
      const response = await classPost(`/class/unarchiveclass/${classToUnarchive._id}`, {});
      console.log('Unarchive response:', response.data); // Debug log
      if (response.data.success) {
        setArchivedClasses(archivedClasses.filter((cls) => cls._id !== classToUnarchive._id));
        toast.success('Class unarchived successfully');
        // Refresh the classes in AdminLayout to reflect the change
        if (getClass) {
          await getClass();
        }
      } else {
        toast.error(response.data.message || 'Failed to unarchive class');
      }
    } catch (error) {
      console.error('Error unarchiving class:', error);
      toast.error('Failed to unarchive class');
    } finally {
      setShowUnarchiveModal(false);
      setClassToUnarchive(null);
      setIsLoading(false);
    }
  };

  const handleClassClick = (classId) => {
    if (!user) {
      console.error('User not found, redirecting to login'); // Debug log
      navigate('/');
      return;
    }
    navigate(`/admin/classadmin/${classId}`);
  };

  useEffect(() => {
    console.log('useEffect triggered, user:', user); // Debug log
    if (!user) {
      console.log('No user found, redirecting to login'); // Debug log
      navigate('/');
      return;
    }
    fetchArchivedClasses();
  }, [user, navigate, contextArchivedClasses]);

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
      <div className="archived-page">
        <div className="class-grid">
          {archivedClasses.length > 0 ? (
            archivedClasses.map((cls, index) => {
              const color = colors[index % colors.length];
              const initial = cls.ClassName.charAt(0).toUpperCase();
              return (
                <div
                  key={cls._id}
                  className="class-card"
                  style={{ backgroundColor: color }}
                  onClick={() => handleClassClick(cls._id)}
                >
                  <div className="class-initial">{initial}</div>
                  <div className="class-name">{cls.ClassName}</div>
                  <button
                    className="card-icon unarchive-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setClassToUnarchive(cls);
                      setShowUnarchiveModal(true);
                    }}
                  >
                    <Archive size={20} />
                  </button>
                </div>
              );
            })
          ) : (
            <p className="no-classes">No archived classes found.</p>
          )}
        </div>

        {/* Unarchive Confirmation Modal */}
        {showUnarchiveModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <Archive size={40} className="modal-icon" />
              <p className="modal-text">Are you sure you want to unarchive this classroom?</p>
              <div className="modal-buttons">
                <button
                  className="modal-button cancel"
                  onClick={() => {
                    setShowUnarchiveModal(false);
                    setClassToUnarchive(null);
                  }}
                >
                  No, Cancel
                </button>
                <button className="modal-button confirm" onClick={handleUnarchive}>
                  Yes, Unarchive
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ArchivedClass;
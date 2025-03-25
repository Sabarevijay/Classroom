import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import { classGet, classPost } from '../services/Endpoint';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Edit, Trash2, Archive, X } from 'lucide-react';
import toast from 'react-hot-toast';


const styles = `
  /* Main Container */
  .home-container {
    min-height: 100vh;
    background-color: #f5f5f5; /* Light gray background */
    display: flex;
  }

  /* Content Area */
  .content-area {
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
    padding: 1rem;
    color: #fff;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
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
  }

  .class-name {
    font-size: 1.25rem;
    font-weight: 600;
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

  .rename-icon {
    top: 0.5rem;
    right: 0.5rem;
    color: #6b48ff;
  }

  .remove-icon {
    bottom: 0.5rem;
    right: 0.5rem;
    color: #ff4d4f;
  }

  .archive-icon {
    bottom: 0.5rem;
    left: 0.5rem;
    color: #6b48ff;
  }

  /* Confirmation Modal */
  .modal-container {
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

  .modal {
    background-color: #fff;
    border-radius: 1rem;
    padding: 2rem;
    width: 100%;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .modal-icon {
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
    background-color: #ff4d4f;
    color: #fff;
  }

  .modal-button.confirm:hover {
    background-color: #e63946;
    transform: scale(1.02);
  }

  .modal-button.confirm-archive {
    background-color: #6b48ff;
    color: #fff;
  }

  .modal-button.confirm-archive:hover {
    background-color: #5a3de6;
    transform: scale(1.02);
  }

  .modal-button.confirm-edit {
    background-color: #6b48ff;
    color: #fff;
  }

  .modal-button.confirm-edit:hover {
    background-color: #5a3de6;
    transform: scale(1.02);
  }

  /* Edit Modal */
  .edit-modal {
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

  .edit-modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #000;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .edit-modal-input {
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

  .edit-modal-input:focus {
    outline: none;
    border-color: #6b48ff;
    box-shadow: 0 0 0 3px rgba(107, 72, 255, 0.2);
  }

  .edit-modal-button {
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

  .edit-modal-button:hover {
    background-color: #5a3de6;
    transform: scale(1.02);
    cursor: pointer;
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


const Home = () => {
  const navigate=useNavigate()
  const [classes, setClasses] = useState([])
  const [isLoading,setIsLoading] = useState(true)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditConfirmModalOpen, setIsEditConfirmModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [editClassName, setEditClassName] = useState('');
  const user = useSelector((state) => state.auth.user);
  const colors = [
   '#FF6F61', // Coral
    '#6B48FF', // Purple
    '#4CAF50', // Green
    '#FFCA28', // Yellow
    '#1E88E5', // Blue
    '#009688', // Teal
    '#795548',  // Brown
    '#FF9800', // Orange
    '#3F51B5'  // Indigo
  ];
    
   const getClass=async()=>{
    setIsLoading(true)    
   
    try {
      
      const userRegister = user?.Register;
      if (user.role === 'admin') {
      
        const response = await classGet("/class/getclass");
        const sortedClass = response.data.getclass.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setClasses(sortedClass);
    } else if (user.role === 'user') {
      
        
        const studentResponse = await classGet(`/class/studentclasses/${userRegister}`);
        if (studentResponse.data.success) {
            const sortedClass = studentResponse.data.classes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setClasses(sortedClass);
        } else {
            setClasses([]); 
        }
    }
     
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setIsLoading(false);
    }
   }

   const handleRemoveClass = async () => {
    if (!selectedClass) return;
    try {
      setIsLoading(true);
      const response = await classPost(`/class/deleteclass/${selectedClass._id}`, {});
      if (response.data.success) {
        setClasses(classes.filter(cls => cls._id !== selectedClass._id));
        toast.success("Class removed successfully");
      } else {
        toast.error(response.data.message || "Failed to remove class");
      }
    } catch (error) {
      console.error("Error removing class:", error);
      toast.error("Failed to remove class");
    } finally {
      setIsRemoveModalOpen(false);
      setSelectedClass(null);
      setIsLoading(false);
    }
  };
  const handleArchiveClass = async () => {
    if (!selectedClass) return;
    try {
      setIsLoading(true);
      const response = await classPost(`/class/archiveclass/${selectedClass._id}`, {});
      if (response.data.success) {
        setClasses(classes.filter(cls => cls._id !== selectedClass._id));
        toast.success("Class archived successfully");
      } else {
        toast.error(response.data.message || "Failed to archive class");
      }
    } catch (error) {
      console.error("Error archiving class:", error);
      toast.error("Failed to archive class");
    } finally {
      setIsArchiveModalOpen(false);
      setSelectedClass(null);
      setIsLoading(false);
    }
  };

  const handleEditClass = async () => {
    if (!selectedClass || !editClassName.trim()) {
      toast.error("Class name cannot be empty");
      setIsEditConfirmModalOpen(false);
      setIsEditModalOpen(true);
      return;
    }
    try {
      setIsLoading(true);
      const response = await classPost(`/class/updateclass/${selectedClass._id}`, { ClassName: editClassName });
      if (response.data.success) {
        setClasses(classes.map(cls => cls._id === selectedClass._id ? { ...cls, ClassName: editClassName } : cls));
        toast.success("Class renamed successfully");
      } else {
        toast.error(response.data.message || "Failed to rename class");
      }
    } catch (error) {
      console.error("Error renaming class:", error);
      toast.error("Failed to rename class");
    } finally {
      setIsEditConfirmModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedClass(null);
      setEditClassName('');
      setIsLoading(false);
    }
  };

  const handleClassClick = (classId) => {
    if (!user) {
      console.error("User not found!");
      navigate('/');
      return;
    }
    if (user.role === 'admin') {
      navigate(`/admin/classadmin/${classId}`);
    } else if (user.role === 'user') {
      navigate(`/home/classstudents/${classId}`);
    } else {
      console.error("Unknown role:", user.role);
      navigate('/');
    }
  };
   

  useEffect(() => {
    if (user) {
      getClass();
    } else {
      navigate('/');
    }
  }, [user, navigate]);



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
    <div className="home-container">
      <Sidebar />
      <div className="content-area">
        <Navbar />
        <div className="class-grid">
          {classes.map((cls, index) => {
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
                {user.role === 'admin' && (
                  <>
                    <button
                      className="card-icon rename-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClass(cls);
                        setEditClassName(cls.ClassName);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      className="card-icon remove-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClass(cls);
                        setIsRemoveModalOpen(true);
                      }}
                    >
                      <Trash2 size={20} />
                    </button>
                    <button
                      className="card-icon archive-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClass(cls);
                        setIsArchiveModalOpen(true);
                      }}
                    >
                      <Archive size={20} />
                    </button>
                  </>
                )}
              </div>
            );
          })}
          {classes.length === 0 && !isLoading && (
            <p className="no-classes">No classes assigned to you.</p>
          )}
        </div>
      </div>
    </div>

    {/* Remove Confirmation Modal */}
    {isRemoveModalOpen && (
      <div className="modal-container">
        <div className="modal">
          <Trash2 size={40} className="modal-icon" style={{ color: '#ff4d4f' }} />
          <p className="modal-text">Are you sure you want to remove this classroom?</p>
          <div className="modal-buttons">
            <button
              className="modal-button cancel"
              onClick={() => {
                setIsRemoveModalOpen(false);
                setSelectedClass(null);
              }}
            >
              Cancel
            </button>
            <button
              className="modal-button confirm"
              onClick={handleRemoveClass}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Archive Confirmation Modal */}
    {isArchiveModalOpen && (
      <div className="modal-container">
        <div className="modal">
          <Archive size={40} className="modal-icon" style={{ color: '#6b48ff' }} />
          <p className="modal-text">Are you sure you want to archive this classroom?</p>
          <div className="modal-buttons">
            <button
              className="modal-button cancel"
              onClick={() => {
                setIsArchiveModalOpen(false);
                setSelectedClass(null);
              }}
            >
              Cancel
            </button>
            <button
              className="modal-button confirm-archive"
              onClick={handleArchiveClass}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Edit Class Modal */}
    {isEditModalOpen && (
      <div className="modal-container">
        <div className="edit-modal">
          <button
            onClick={() => {
              setIsEditModalOpen(false);
              setSelectedClass(null);
              setEditClassName('');
            }}
            className="close-button"
          >
            <X size={24} />
          </button>
          <h2 className="edit-modal-title">Rename Classroom</h2>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Classroom Name
            </label>
            <input
              type="text"
              value={editClassName}
              onChange={(e) => setEditClassName(e.target.value)}
              className="edit-modal-input"
              placeholder="Enter new classroom name"
            />
          </div>
          <button
            className="edit-modal-button"
            onClick={() => {
              if (!editClassName.trim()) {
                toast.error("Class name cannot be empty");
                return;
              }
              setIsEditModalOpen(false);
              setIsEditConfirmModalOpen(true);
            }}
          >
            Save
          </button>
        </div>
      </div>
    )}

    {/* Edit Confirmation Modal */}
    {isEditConfirmModalOpen && (
      <div className="modal-container">
        <div className="modal">
          <p className="modal-text">Are you sure you want to save the changes?</p>
          <div className="modal-buttons">
            <button
              className="modal-button cancel"
              onClick={() => {
                setIsEditConfirmModalOpen(false);
                setIsEditModalOpen(true);
              }}
            >
              Cancel
            </button>
            <button
              className="modal-button confirm-edit"
              onClick={handleEditClass}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default Home;
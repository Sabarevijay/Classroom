import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { classGet, downloadFile } from '../services/Endpoint'; // Add downloadFile
import toast from 'react-hot-toast';
import SecondNavUs from '../Components/SecondNavUs';

const styles = `
  /* Page Background */
  .page-container {
    background-color: #d3d8e0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    position: relative;
  }

  /* Card Container for all content */
  .card-container {
    background-color: #fff;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 700px;
    padding: 0 2rem 2rem 2rem;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Style for SecondNav to merge with the top of the card */
  .second-nav {
    background-color: #fff;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    padding: 0rem 0;
    margin: 0 -2rem;
    // border-bottom: 1px solid #e5e7eb;
  }

  /* Headings */
  .class-name {
    font-size: 2.5rem;
    font-weight: 800;
    color: #6b48ff;
    margin-bottom: 0.2rem;
    text-align: center;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #000;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  /* Content Container */
  .content-container {
    width: 100%;
    padding: 1.5rem;
    background-color: transparent;
    border: none;
    box-shadow: none;
    text-align: center;
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

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .card-container {
      padding: 0 1rem 1rem 1rem;
      margin-top: 0.5rem;
    }

    .second-nav {
      margin: 0 -1rem;
      padding: 0.75rem 0;
    }

    .class-name {
      font-size: 1.8rem;
    }
  }

  .classwork-item {
    border: 1px solid #e5e7eb;
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 0.5rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .download-button {
    background-color: #6b48ff;
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 0.3rem;
    border: none;
    cursor: pointer;
    margin-left: 0.5rem;
  }

  .view-button {
    background-color: #2196F3;
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 0.3rem;
    border: none;
    cursor: pointer;
    margin-left: 0.5rem;
  }
`;

const ClassworkUs = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classworks, setClassworks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classResponse = await classGet(`/class/getclass/${id}`);
        setClassData(classResponse.data.classData);
        
        const classworkResponse = await classGet(`/class/classwork/${id}`);
        setClassworks(classworkResponse.data.classworks || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load data. Please try again later.');
        toast.error('Failed to load data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDownload = async (classworkId, filename) => {
    try {
      const response = await downloadFile(`/class/classwork/download/${classworkId}`, {
        responseType: 'blob', // Ensures correct file handling
      });

      if (response.data.type === "application/json") {
        // Convert response to text to log any error message
        const errorText = await response.data.text();
        console.error("Server Error:", errorText);
        toast.error(`Download failed: ${errorText}`);
        return;
      }
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Download started');
    } catch (error) {
      console.error('Download error:', error.response?.data || error.message);
      toast.error('Failed to download file');
    }
  };

  const handleView = (classworkId, filename) => {
    try {
      const fileUrl = `${import.meta.env.VITE_SERVER_APP_URL}/images/${filename}`;
      window.open(fileUrl, '_blank'); // Open file in new tab
      toast.success('Opening file in new tab');
    } catch (error) {
      console.error('View error:', error);
      toast.error('Failed to view file');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className="page-container">
      <style>{styles}</style>
      <div className="card-container">
        <div className="second-nav">
          <SecondNavUs classId={id} />
        </div>
        <h2 className="class-name">{classData ? classData.ClassName : 'No class data available'}</h2>
        <div className="content-container">
          <h3 className="section-title">Classwork</h3>
          
          {/* Classwork List */}
          {classworks.length > 0 ? (
            classworks.map((classwork) => (
              <div key={classwork._id} className="classwork-item">
                <span>{classwork.title}</span>
                <div>
                  <button
                    className="view-button"
                    onClick={() => handleView(classwork._id, classwork.filename)}
                  >
                    View
                  </button>
                  <button
                    className="download-button"
                    onClick={() => handleDownload(classwork._id, classwork.filename)}
                  >
                    Download
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No classwork available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassworkUs;
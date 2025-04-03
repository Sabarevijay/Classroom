import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SecondNav from '../Components/SecondNav';
import { classGet, classPost, downloadFile } from '../services/Endpoint'; // Add downloadFile
import toast from 'react-hot-toast';

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

  /* New styles for classwork management */
  .upload-form {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .file-input {
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
  }

  .upload-button {
    background-color: #6b48ff;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
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

  .action-buttons button {
    margin-left: 0.5rem;
    padding: 0.3rem 0.8rem;
    border-radius: 0.3rem;
    border: none;
    cursor: pointer;
  }

  .edit-button {
    background-color: #4CAF50;
    color: white;
  }

  .delete-button {
    background-color: #f44336;
    color: white;
  }
`;

const Classwork = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classworks, setClassworks] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');

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

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      toast.error('Please provide both title and file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('classId', id);

    try {
      console.log('Uploading file with data:', { title, classId: id, file: file.name });
      const response = await classPost('/class/classwork/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload response:', response.data);
      setClassworks([...classworks, response.data.classwork]);
      setFile(null);
      setTitle('');
      toast.success('Classwork uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error.response?.data || error.message);
      toast.error(`Failed to upload classwork: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (classworkId) => {
    try {
      await classPost(`/class/classwork/delete/${classworkId}`); // Fixed endpoint
      setClassworks(classworks.filter(cw => cw._id !== classworkId));
      toast.success('Classwork deleted successfully');
    } catch (error) {
      console.error('Delete error:', error.response?.data || error.message);
      toast.error('Failed to delete classwork');
    }
  };

  const handleEdit = async (classworkId, newTitle) => {
    try {
      const response = await classPost(`/class/classwork/edit/${classworkId}, { title: newTitle }`); // Fixed endpoint
      setClassworks(classworks.map(cw => 
        cw._id === classworkId ? response.data.classwork : cw
      ));
      toast.success('Classwork updated successfully');
    } catch (error) {
      console.error('Edit error:', error.response?.data || error.message);
      toast.error('Failed to update classwork');
    }
  };

  const handleDownload = async (classworkId, filename) => {
    try {
      const response = await downloadFile(`/class/classwork/download/${classworkId}`);
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
          <SecondNav classId={id} />
        </div>
        <h2 className="class-name">{classData ? classData.ClassName : 'No class data available'}</h2>
        <div className="content-container">
          <h3 className="section-title">Classwork</h3>
          
          {/* Upload Form */}
          <form className="upload-form" onSubmit={handleFileUpload}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Classwork title"
              className="file-input"
            />
            <input
              type="file"
              name="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="file-input"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <button type="submit" className="upload-button">Upload Classwork</button>
          </form>

          {/* Classwork List */}
          {classworks.map((classwork) => (
            <div key={classwork._id} className="classwork-item">
              <span>{classwork.title}</span>
              <div className="action-buttons">
                <button
                  className="edit-button"
                  onClick={() => {
                    const newTitle = prompt('Enter new title:', classwork.title);
                    if (newTitle) handleEdit(classwork._id, newTitle);
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(classwork._id)}
                >
                  Delete
                </button>
                <button
                  className="download-button" // Reuse existing style
                  onClick={() => handleDownload(classwork._id, classwork.filename)}
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Classwork;
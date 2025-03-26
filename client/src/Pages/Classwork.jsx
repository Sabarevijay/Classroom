import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SecondNav from '../Components/SecondNav';
import { classGet } from '../services/Endpoint';
import toast from 'react-hot-toast';


const styles = `
  /* Page Background */
  .page-container {
    background-color: #d3d8e0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 20px 20px; /* Consistent with ClassAdmin */
    position: relative;
  }

  /* Headings */
  .class-name {
    font-size: 2.5rem;
    font-weight: 800;
    color: #6b48ff;
    margin-bottom: 0.2rem;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #000;
    margin-bottom: 1.5rem;
  }

  /* Placeholder Content */
  .content-container {
    width: 100%;
    max-width: 600px;
    padding: 1.5rem;
    background-color: #fff;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
`;

const Classwork = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await classGet(`/class/getclass/${id}`);
        setClassData(response.data.classData);
      } catch (error) {
        console.error('Failed to fetch class data:', error);
        setError('Failed to load class data. Please try again later.');
        toast.error('Failed to load class data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassData();
  }, [id]);

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

     
        <SecondNav classId={id} />
      
      
      <h2 className="class-name">{classData ? classData.ClassName : 'No class data available'}</h2>

      
      <div className="content-container">
        <h3 className="section-title">Classwork</h3>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia voluptatem vitae cum nesciunt soluta sapiente hic placeat delectus! Delectus unde numquam nihil est nisi molestiae rem vero voluptates quo at!</p>
      </div>
    </div>
  );
};

export default Classwork;
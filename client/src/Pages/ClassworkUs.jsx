import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { classGet } from '../services/Endpoint';
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
`;

const ClassworkUs = () => {
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
      <div className="card-container">
        <div className="second-nav">
          <SecondNavUs classId={id} />
        </div>
        <h2 className="class-name">{classData ? classData.ClassName : 'No class data available'}</h2>
        <div className="content-container">
          <h3 className="section-title">Classwork</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia voluptatem vitae cum nesciunt soluta sapiente hic placeat delectus! Delectus unde numquam nihil est nisi molestiae rem vero voluptates quo at!</p>
        </div>
      </div>
    </div>
  );
};

export default ClassworkUs;
import React from 'react';
import { useLocation } from 'react-router-dom';

const styles = `
  .portal-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 20px;
    text-align: center;
  }

  .portal-title {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 1rem;
  }

  .category-title {
    font-size: 1.5rem;
    font-weight: 500;
    color: #555;
  }
`;

const StudentPortal = () => {
  const location = useLocation();
  const { className } = location.state || {};

  // Debug: Log the location.state to the console
  console.log('Location State:', location.state);

  return (
    <>
      <style>{styles}</style>
      <div className="portal-container">
        <h1 className="portal-title">Hello from Student Portal</h1>
        {className ? (
          <h2 className="category-title">Selected Category: {className}</h2>
        ) : (
          <h2 className="category-title">
            No Category Selected (Please select a category from the Student Portal)
          </h2>
        )}
      </div>
    </>
  );
};

export default StudentPortal;
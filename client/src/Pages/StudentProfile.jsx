import React from 'react';
import { useParams, useLocation } from 'react-router-dom'; // Added useLocation
import StudentProfileNav from '../Components/StudentProfileNav'; // Adjust path based on your project structure

const styles = `
  /* Page Container */
  .portal-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background-color: #d3d8e0;
    padding: 20px;
    margin-top: 50px;
    text-align: center;
  }

  /* Card Container for content and StudentProfileNav */
  .card-container {
    background-color: #fff;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 700px;
    padding: 0 2rem 2rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
    margin-top:50px;
  }

  /* Style for StudentProfileNav to merge with the top of the card */
  .second-nav {
    background-color: #fff;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    padding: 0rem 0;
    margin: 0 -2rem;
    width:110%;
  }

  /* Heading */
  .portal-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #6b48ff;
    margin-bottom: 1rem;
    text-align: center;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .portal-container {
      padding: 10px;
      margin-top: 30px;
    }

    .card-container {
      padding: 0 1rem 1rem 1rem;
    }

    .second-nav {
      margin: 0 -1rem;
      padding: 0.75rem 0;
    }

    .portal-title {
      font-size: 1.8rem;
    }
  }
`;

const StudentProfile = () => {
  const { classId } = useParams();
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();
  const basePath = `/mentor/classadmin/${classId}`;

  // Determine the title based on the current route
  let pageTitle = 'Approval'; // Default title
  if (currentPath === `${basePath}/achievement`) {
    pageTitle = 'Student Details';
  } else if (currentPath === `${basePath}/report`) {
    pageTitle = 'Report';
  } else if (currentPath === `${basePath}/addstudents`) {
    pageTitle = 'Add Students';
  }

  return (
    <>
      <style>{styles}</style>
      <div className="portal-container">
        <div className="card-container">
          <div className="second-nav">
            <StudentProfileNav classId={classId} />
          </div>
          <h2 className="portal-title">Student Profile</h2>
        </div>
      </div>
    </>
  );
};

export default StudentProfile;
import React from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  .page-container {
    min-height: 100vh;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    padding: 70px 20px 20px;
  }

  .content-area {
    flex: 1;
    padding-top: 0;
    padding-left: 80px;
    transition: padding-left 0.3s ease;
  }

  .page-title {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    text-align: center;
    margin-bottom: 2rem;
  }

  .class-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    padding: 1rem;
    justify-items: center;
    
  }

  .class-card {
    position: relative;
    width: 100%;
    max-width: 300px;
    height: 180px;
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

  .class-title {
    font-size: 1.7rem;
    font-weight: 600;
    word-wrap: break-word;
    margin-bottom: 0.25rem;
    text-align: center;
  }

  @media (max-width: 768px) {
    .page-container {
      padding: 60px 10px 10px;
    }

    .content-area {
      padding-left: 0;
    }

    .page-title {
      font-size: 1.5rem;
    }

    .class-grid {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      padding: 2rem 0.5rem 0.5rem;
    }

    .class-card {
      max-width: 100%;
      height: 180px;
    }

    .class-title {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    .class-grid {
      grid-template-columns: 1fr;
      padding: 2.5rem 0.5rem 0.5rem;
    }

    .class-card {
      height: 160px;
    }

    .class-title {
      font-size: 1.rem;
    }
  }
`;

const Students = () => {
  const navigate = useNavigate();

  const handleNavigate = (className) => {
    navigate(`/admin/studentsportal`, { state: { className } });
  };

  const colors = [
    '#FF6F61', '#6B48FF', '#4CAF50', '#FFCA28', '#1E88E5',
    '#009688', '#795548', '#FF9800', '#3F51B5'
  ];

  const classNames = [
    'Students Profile', 'Academic', 'Technical Skill', 'Co-curricular',
    'Extra Curricular', 'Placement', 'Satisfaction Report'
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="page-container">
        <div className="content-area">
          <h1 className="page-title"><u>Student Portal</u></h1>
          <div className="class-grid">
            {classNames.map((className, index) => (
              <div
                key={className}
                className="class-card"
                style={{ backgroundColor: colors[index % colors.length] }}
                onClick={() => handleNavigate(className)}
              >
                <div className="class-title">{className}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Students;
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const styles = `
  .portal-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 20px;
    margin-top:50px;
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
    margin-bottom: 1.5rem;
  }

  .dropdown-container {
    margin-top: 80px;
    margin-bottom: 1rem;
  }

  .dropdown-container h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .dropdown-select {
    padding: 0.5rem;
    font-size: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #ccc;
    background-color: #fff;
    color: #333;
    width: 200px;
    cursor: pointer;
    outline: none;
  }

  .dropdown-select:focus {
    border-color: #1E88E5;
    box-shadow: 0 0 5px rgba(30, 136, 229, 0.3);
  }

  .internship-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    margin-top: 1rem;
  }

  .form-field {
    width: 100%;
    margin-bottom: 1rem;
  }

  .form-field label {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.25rem;
    text-align: left;
  }

  .form-field input,
  .form-field textarea {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    outline: none;
  }

  .form-field input:focus,
  .form-field textarea:focus {
    border-color: #1E88E5;
    box-shadow: 0 0 5px rgba(30, 136, 229, 0.3);
  }

  .form-field textarea {
    resize: vertical;
    min-height: 100px;
  }

  .submit-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    background-color: #1E88E5;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .submit-button:hover {
    background-color: #1565C0;
  }
`;

const StudentPortal = () => {
  const location = useLocation();
  const { className } = location.state || {};
  const [selectedOption, setSelectedOption] = useState('');

  // Debug: Log the location.state to the console
  console.log('Location State:', location.state);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Placeholder for form submission logic
    console.log('Form submitted with values:', {
      companyName: event.target.companyName.value,
      role: event.target.role.value,
      startDate: event.target.startDate.value,
      endDate: event.target.endDate.value,
      description: event.target.description.value,
    });
    // Reset form or show success message as needed
    alert('Internship details submitted!');
  };

  return (
    <>
      <style>{styles}</style>
      <div className="portal-container">
        {className !== 'Placement' && (
          <>
            <h1 className="portal-title">Hello from Student Portal</h1>
            {className ? (
              <h2 className="category-title">Selected Category: {className}</h2>
            ) : (
              <h2 className="category-title">
                No Category Selected (Please select a category from the Student Portal)
              </h2>
            )}
          </>
        )}

        {className === 'Placement' && (
          <div className="dropdown-container">
            <h3>Choose the variant and Complete the details</h3>
            <select
              className="dropdown-select"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              <option value="" disabled>
                Select an option
              </option>
              <option value="Internship">Internship</option>
              <option value="Placement">Placement</option>
              <option value="Startup">Startup</option>
            </select>
          </div>
        )}

        {className === 'Placement' && selectedOption === 'Internship' && (
          <form className="internship-form" onSubmit={handleFormSubmit}>
            <div className="form-field">
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                required
                placeholder="Enter company name"
              />
            </div>
            <div className="form-field">
              <label htmlFor="role">Role</label>
              <input
                type="text"
                id="role"
                name="role"
                required
                placeholder="Enter internship role"
              />
            </div>
            <div className="form-field">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter internship description"
              />
            </div>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default StudentPortal;
import React, { useState } from 'react';

const styles = `
  /* Container for the Achievements page */
  .achievements-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    position: relative;
  }

  /* Card container for content */
  .card-container {
    background-color: #fff;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 700px;
    margin-top: 4.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding-top: 0;
    padding-bottom: 1rem; /* Added padding-bottom for submit button spacing */
  }

  /* Collapsible section header */
  .collapsible-header {
    background-color: #6b48ff; /* Blue background */
    color: #fff; /* White text for contrast */
    padding: 10px 15px;
    border-radius: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: 600;
  }

  .collapsible-header:hover {
    background-color: #7c5aff; /* Lighter blue for hover */
  }

  .collapsible-arrow {
    font-size: 1.2rem;
    transition: transform 0.3s ease;
    color: #fff; /* White arrow for contrast */
  }

  .collapsible-arrow.open {
    transform: rotate(180deg);
  }

  /* Collapsible content (form) */
  .collapsible-content {
    background-color: #fff;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* Form fields */
  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-input,
  .form-textarea,
  .form-select {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    color: #333;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .form-textarea {
    resize: vertical;
    min-height: 100px;
  }

  .form-input:focus,
  .form-textarea:focus,
  .form-select:focus {
    outline: none;
    border-color: #6b48ff;
    box-shadow: 0 0 0 3px rgba(107, 72, 255, 0.2);
  }

  /* Submit button */
  .submit-button {
    background-color: #6b48ff;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
    align-self: center;
    margin-top: 1rem;
  }

  .submit-button:hover {
    background-color: #7c5aff;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .achievements-container {
      padding: 8px; /* Reduced padding for mobile */
    }

    .card-container {
    //   padding: 0.75rem; /* Slightly increased padding for better spacing */
      margin-top: 4.5rem;
      padding-top: 0;
      padding-bottom: 0.75rem; /* Adjusted for submit button */
      gap: 0.5rem; /* Reduced gap between headers */
    }

    .collapsible-header {
      padding: 8px 12px; /* Reduced padding for mobile */
      font-size: 1rem; /* Reduced font size for mobile */
    }

    .collapsible-arrow {
      font-size: 1rem; /* Match font size reduction */
    }

    .collapsible-content {
      padding: 0.75rem; /* Reduced padding for mobile */
      gap: 0.5rem; /* Reduced gap between form fields */
    }

    .form-input,
    .form-textarea,
    .form-select {
      padding: 0.5rem; /* Slightly reduced padding for inputs */
      font-size: 0.9rem; /* Slightly smaller font size for mobile */
    }

    .form-textarea {
      min-height: 80px; /* Reduced textarea height for mobile */
    }

    .submit-button {
      padding: 8px 16px; /* Slightly smaller padding for mobile */
      font-size: 0.9rem; /* Smaller font size for mobile */
      margin-top: 0.75rem; /* Reduced margin for mobile */
    }
  }
`;

const Achievements = () => {
  const [formData, setFormData] = useState({
    personalDetails: {
      name: '',
      photo: null,
      email: '',
      phoneNumber: '',
    },
    academicDetails: {
      skills: '',
      cgpa: '',
      areaOfInterest: '',
    },
    projectDetails: {
      title: '',
      url: '',
      document: null,
      description: '',
    },
    competitions: {
      date: '',
      upload: null,
      description: '',
    },
    internship: {
      companyName: '',
      role: '',
      date: '',
      description: '',
    },
    onlineCourse: {
      courseName: '',
      duration: '',
      certifications: null,
    },
    productDevelopment: {
      productName: '',
      details: '',
      upload: null,
    },
    languages: {
      language: '',
      level: '',
    },
  });

  const [isPersonalDetailsOpen, setIsPersonalDetailsOpen] = useState(false);
  const [isAcademicDetailsOpen, setIsAcademicDetailsOpen] = useState(false);
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState(false);
  const [isCompetitionsOpen, setIsCompetitionsOpen] = useState(false);
  const [isInternshipOpen, setIsInternshipOpen] = useState(false);
  const [isOnlineCourseOpen, setIsOnlineCourseOpen] = useState(false);
  const [isProductDevelopmentOpen, setIsProductDevelopmentOpen] = useState(false);
  const [isLanguagesOpen, setIsLanguagesOpen] = useState(false);

  const togglePersonalDetails = () => setIsPersonalDetailsOpen(!isPersonalDetailsOpen);
  const toggleAcademicDetails = () => setIsAcademicDetailsOpen(!isAcademicDetailsOpen);
  const toggleProjectDetails = () => setIsProjectDetailsOpen(!isProjectDetailsOpen);
  const toggleCompetitions = () => setIsCompetitionsOpen(!isCompetitionsOpen);
  const toggleInternship = () => setIsInternshipOpen(!isInternshipOpen);
  const toggleOnlineCourse = () => setIsOnlineCourseOpen(!isOnlineCourseOpen);
  const toggleProductDevelopment = () => setIsProductDevelopmentOpen(!isProductDevelopmentOpen);
  const toggleLanguages = () => setIsLanguagesOpen(!isLanguagesOpen);

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleFileChange = (section, field, event) => {
    const file = event.target.files[0];
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: file,
      },
    }));
  };

  const handleSubmit = () => {
    console.log('Form Data Submitted:', formData);
    // In a real application, you would send this data to a server here
  };

  return (
    <>
      <style>{styles}</style>
      <div className="achievements-container">
        <div className="card-container">
          {/* Personal Details Section */}
          <div>
            <div className="collapsible-header" onClick={togglePersonalDetails}>
              <span>Personal Details</span>
              <span className={`collapsible-arrow ${isPersonalDetailsOpen ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            {isPersonalDetailsOpen && (
              <div className="collapsible-content">
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your name"
                    value={formData.personalDetails.name}
                    onChange={(e) => handleInputChange('personalDetails', 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <input
                    type="file"
                    className="form-input"
                    accept="image/*"
                    onChange={(e) => handleFileChange('personalDetails', 'photo', e)}
                    required
                  />
                </div>
                <div className="form-field">
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={formData.personalDetails.email}
                    onChange={(e) => handleInputChange('personalDetails', 'email', e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="Enter your phone number"
                    value={formData.personalDetails.phoneNumber}
                    onChange={(e) => handleInputChange('personalDetails', 'phoneNumber', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Academic Details Section */}
          <div>
            <div className="collapsible-header" onClick={toggleAcademicDetails}>
              <span>Academic Details</span>
              <span className={`collapsible-arrow ${isAcademicDetailsOpen ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            {isAcademicDetailsOpen && (
              <div className="collapsible-content">
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your skills (e.g., JavaScript, React)"
                    value={formData.academicDetails.skills}
                    onChange={(e) => handleInputChange('academicDetails', 'skills', e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Enter your CGPA"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.academicDetails.cgpa}
                    onChange={(e) => handleInputChange('academicDetails', 'cgpa', e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your area of interest"
                    value={formData.academicDetails.areaOfInterest}
                    onChange={(e) => handleInputChange('academicDetails', 'areaOfInterest', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Project Details Section */}
          <div>
            <div className="collapsible-header" onClick={toggleProjectDetails}>
              <span>Project Details</span>
              <span className={`collapsible-arrow ${isProjectDetailsOpen ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            {isProjectDetailsOpen && (
              <div className="collapsible-content">
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter project title"
                    value={formData.projectDetails.title}
                    onChange={(e) => handleInputChange('projectDetails', 'title', e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <input
                    type="url"
                    className="form-input"
                    placeholder="Enter project URL"
                    value={formData.projectDetails.url}
                    onChange={(e) => handleInputChange('projectDetails', 'url', e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <input
                    type="file"
                    className="form-input"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange('projectDetails', 'document', e)}
                    required
                  />
                </div>
                <div className="form-field">
                  <textarea
                    className="form-textarea"
                    placeholder="Enter project description"
                    value={formData.projectDetails.description}
                    onChange={(e) => handleInputChange('projectDetails', 'description', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Competitions Section */}
          <div>
            <div className="collapsible-header" onClick={toggleCompetitions}>
              <span>Competitions</span>
              <span className={`collapsible-arrow ${isCompetitionsOpen ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            {isCompetitionsOpen && (
              <div className="collapsible-content">
                <div className="form-field">
                  <input
                    type="date"
                    className="form-input"
                    placeholder="Select date"
                    value={formData.competitions.date}
                    onChange={(e) => handleInputChange('competitions', 'date', e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <input
                    type="file"
                    className="form-input"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={(e) => handleFileChange('competitions', 'upload', e)}
                    required
                  />
                </div>
                <div className="form-field">
                  <textarea
                    className="form-textarea"
                    placeholder="Enter competition description"
                    value={formData.competitions.description}
                    onChange={(e) => handleInputChange('competitions', 'description', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Internship Section */}
          <div>
            <div className="collapsible-header" onClick={toggleInternship}>
              <span>Internship</span>
              <span className={`collapsible-arrow ${isInternshipOpen ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            {isInternshipOpen && (
              <div className="collapsible-content">
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter company name"
                    value={formData.internship.companyName}
                    onChange={(e) => handleInputChange('internship', 'companyName', e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your role"
                    value={formData.internship.role}
                    onChange={(e) => handleInputChange('internship', 'role', e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <input
                    type="date"
                    className="form-input"
                    placeholder="Select date"
                    value={formData.internship.date}
                    onChange={(e) => handleInputChange('internship', 'date', e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <textarea
                    className="form-textarea"
                    placeholder="Enter internship description"
                    value={formData.internship.description}
                    onChange={(e) => handleInputChange('internship', 'description', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Online Course Section */}
          <div>
            <div className="collapsible-header" onClick={toggleOnlineCourse}>
              <span>Online Course</span>
              <span className={`collapsible-arrow ${isOnlineCourseOpen ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            {isOnlineCourseOpen && (
              <div className="collapsible-content">
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter course name"
                    value={formData.onlineCourse.courseName}
                    onChange={(e) => handleInputChange('onlineCourse', 'courseName', e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter duration (e.g., 3 months)"
                    value={formData.onlineCourse.duration}
                    onChange={(e) => handleInputChange('onlineCourse', 'duration', e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <input
                    type="file"
                    className="form-input"
                    accept=".pdf,.jpg,.png"
                    onChange={(e) => handleFileChange('onlineCourse', 'certifications', e)}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Product Development Section */}
          <div>
            <div className="collapsible-header" onClick={toggleProductDevelopment}>
              <span>Product Development</span>
              <span className={`collapsible-arrow ${isProductDevelopmentOpen ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            {isProductDevelopmentOpen && (
              <div className="collapsible-content">
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter product name"
                    value={formData.productDevelopment.productName}
                    onChange={(e) => handleInputChange('productDevelopment', 'productName', e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <textarea
                    className="form-textarea"
                    placeholder="Enter product details"
                    value={formData.productDevelopment.details}
                    onChange={(e) => handleInputChange('productDevelopment', 'details', e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <input
                    type="file"
                    className="form-input"
                    accept=".pdf,.jpg,.png"
                    onChange={(e) => handleFileChange('productDevelopment', 'upload', e)}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Languages Section */}
          <div>
            <div className="collapsible-header" onClick={toggleLanguages}>
              <span>Languages</span>
              <span className={`collapsible-arrow ${isLanguagesOpen ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            {isLanguagesOpen && (
              <div className="collapsible-content">
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter language"
                    value={formData.languages.language}
                    onChange={(e) => handleInputChange('languages', 'language', e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <select
                    className="form-select"
                    value={formData.languages.level}
                    onChange={(e) => handleInputChange('languages', 'level', e.target.value)}
                    required
                  >
                    <option value="">Select level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Fluent">Fluent</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default Achievements;
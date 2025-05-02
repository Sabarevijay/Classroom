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
    gap: 1rem; /* Space between entries and other top-level elements */
  }

  /* Form fields */
  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  /* Form field with row layout for labels beside inputs or paired inputs */
  .form-field-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem; /* Space between elements */
  }

  .form-label {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    white-space: nowrap; /* Prevent label text from wrapping */
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
    width: 100%; /* Ensure input takes remaining space */
  }

  /* Specific widths for "Enter your name" and "Upload your photo" */
  .form-field-row .name-input {
    flex: 0 0 60%; /* 60% width for "Enter your name" */
  }

  .form-field-row .photo-upload {
    flex: 0 0 35%; /* 35% width for "Upload your photo" */
  }

  /* Specific widths for "Enter your email" and "Enter your phone number" */
  .form-field-row .email-input {
    flex: 0 0 60%; /* 60% width for "Enter your email" */
  }

  .form-field-row .phone-input {
    flex: 0 0 35%; /* 35% width for "Enter your phone number", matching "Upload your photo" */
  }

  /* Specific widths for "Start Date" and "End Date" labels and inputs */
  .form-field-row .start-date-label,
  .form-field-row .end-date-label {
    flex: 0 0 48.5%; /* Slightly less than 50% to account for the gap */
    text-align: left; /* Align labels to the left */
  }

  .form-field-row .start-date-input,
  .form-field-row .end-date-input {
    flex: 0 0 48.5%; /* Slightly less than 50% to account for the gap */
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

  /* Custom file input wrapper */
  .file-input-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  .file-input-wrapper input[type="file"] {
    width: 100%;
    height: 100%;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
  }

  .file-input-label {
    display: block;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    color: #333;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    text-align: left;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .file-input-wrapper input[type="file"]:focus + .file-input-label {
    border-color: #6b48ff;
    box-shadow: 0 0 0 3px rgba(107, 72, 255, 0.2);
  }

  /* Generic Add button (used for Add Project, Add Competition, etc.) */
  .add-button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    padding: 0;
    font-size: 1rem;
    color: #6b48ff; /* Blue text to match theme */
    cursor: pointer;
    margin-top: 0.5rem;
  }

  .add-button .add-icon {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 1.2rem;
    height: 1.2rem;
    margin-right: 0.5rem;
    background-color: #6b48ff; /* Blue background for the icon */
    color: #fff; /* White plus sign */
    border-radius: 50%; /* Circular icon */
    font-size: 0.9rem;
    font-weight: 700;
  }

  /* Generic Remove button (used for Remove Project, Remove Competition, etc.) */
  .remove-button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    padding: 0;
    font-size: 1rem;
    color: #ff0000; /* Red text */
    cursor: pointer;
    margin-bottom: 0.5rem;
  }

  .remove-button .trash-icon {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 1.2rem;
    height: 1.2rem;
    margin-right: 0.5rem;
    background-color: #ff0000; /* Red background for the icon */
    color: #fff; /* White trash icon */
    border-radius: 50%; /* Circular icon */
    font-size: 0.9rem;
  }

  /* Entry container (for visual separation in sections with multiple entries) */
  .entry {
    border-bottom: 1px solid #d1d5db;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }

  /* Remove border from the last entry */
  .entry:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }

  /* Add margin-bottom to form fields within entries */
  .entry .form-field {
    margin-bottom: 1rem; /* Add spacing below each field */
  }

  /* Remove margin-bottom from the last form field in each entry to avoid extra spacing */
  .entry .form-field:last-child {
    margin-bottom: 0;
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

  /* Success Modal */
  .success-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    color: #000;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 15px 5px rgba(107, 72, 255, 0.3),
                0 0 15px 5px rgba(0, 122, 255, 0.3);
    text-align: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-in-out;
  }

  .success-checkmark {
    font-size: 3rem;
    color: #28a745;
    margin-bottom: 1rem;
    animation: scaleIn 0.5s ease-in-out;
  }

  .success-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .success-message {
    font-size: 1rem;
    font-weight: 400;
    color: #333;
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -60%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }

  @keyframes scaleIn {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .achievements-container {
      padding: 8px; /* Reduced padding for mobile */
    }

    .card-container {
      padding: 0.75rem; /* Slightly increased padding for better spacing */
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

    .form-field-row {
      flex-direction: column; /* Stack label and input vertically on mobile */
      align-items: flex-start;
      gap: 0.5rem; /* Match column layout gap */
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

    .file-input-label {
      padding: 0.5rem;
      font-size: 0.9rem;
    }

    .form-label {
      font-size: 0.9rem; /* Match mobile font size */
    }

    .add-button,
    .remove-button {
      font-size: 0.9rem;
    }

    .add-button .add-icon,
    .remove-button .trash-icon {
      width: 1rem;
      height: 1rem;
      font-size: 0.7rem;
      margin-right: 0.4rem;
    }

    .entry .form-field {
      margin-bottom: 0.75rem; /* Reduced margin-bottom for mobile */
    }

    .remove-button {
      margin-bottom: 0.4rem; /* Reduced margin for mobile */
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
    projectDetails: [
      {
        title: '',
        url: '',
        document: null,
        description: '',
      },
    ],
    competitions: [
      {
        startDate: '',
        endDate: '',
        upload: null,
        description: '',
      },
    ],
    internship: [
      {
        companyName: '',
        role: '',
        startDate: '',
        endDate: '',
        certificate: null,
        description: '',
      },
    ],
    onlineCourse: [
      {
        courseName: '',
        startDate: '',
        endDate: '',
        certifications: null,
      },
    ],
    productDevelopment: [
      {
        productName: '',
        details: '',
        startDate: '',
        endDate: '',
        upload: null,
      },
    ],
    languages: {
      language: '',
      level: '',
    },
  });

  const [openSection, setOpenSection] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleInputChange = (section, field, value, index = null) => {
    if (index !== null) {
      setFormData((prev) => {
        const updatedEntries = [...prev[section]];
        updatedEntries[index] = {
          ...updatedEntries[index],
          [field]: value,
        };
        return {
          ...prev,
          [section]: updatedEntries,
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    }
  };

  const handleFileChange = (section, field, event, index = null) => {
    const file = event.target.files[0];
    if (index !== null) {
      setFormData((prev) => {
        const updatedEntries = [...prev[section]];
        updatedEntries[index] = {
          ...updatedEntries[index],
          [field]: file,
        };
        return {
          ...prev,
          [section]: updatedEntries,
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: file,
        },
      }));
    }
  };

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projectDetails: [
        ...prev.projectDetails,
        {
          title: '',
          url: '',
          document: null,
          description: '',
        },
      ],
    }));
  };

  const removeProject = (index) => {
    setFormData((prev) => ({
      ...prev,
      projectDetails: prev.projectDetails.filter((_, i) => i !== index),
    }));
  };

  const addCompetition = () => {
    setFormData((prev) => ({
      ...prev,
      competitions: [
        ...prev.competitions,
        {
          startDate: '',
          endDate: '',
          upload: null,
          description: '',
        },
      ],
    }));
  };

  const removeCompetition = (index) => {
    setFormData((prev) => ({
      ...prev,
      competitions: prev.competitions.filter((_, i) => i !== index),
    }));
  };

  const addInternship = () => {
    setFormData((prev) => ({
      ...prev,
      internship: [
        ...prev.internship,
        {
          companyName: '',
          role: '',
          startDate: '',
          endDate: '',
          certificate: null,
          description: '',
        },
      ],
    }));
  };

  const removeInternship = (index) => {
    setFormData((prev) => ({
      ...prev,
      internship: prev.internship.filter((_, i) => i !== index),
    }));
  };

  const addOnlineCourse = () => {
    setFormData((prev) => ({
      ...prev,
      onlineCourse: [
        ...prev.onlineCourse,
        {
          courseName: '',
          startDate: '',
          endDate: '',
          certifications: null,
        },
      ],
    }));
  };

  const removeOnlineCourse = (index) => {
    setFormData((prev) => ({
      ...prev,
      onlineCourse: prev.onlineCourse.filter((_, i) => i !== index),
    }));
  };

  const addProductDevelopment = () => {
    setFormData((prev) => ({
      ...prev,
      productDevelopment: [
        ...prev.productDevelopment,
        {
          productName: '',
          details: '',
          startDate: '',
          endDate: '',
          upload: null,
        },
      ],
    }));
  };

  const removeProductDevelopment = (index) => {
    setFormData((prev) => ({
      ...prev,
      productDevelopment: prev.productDevelopment.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    console.log('Form Data Submitted:', formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="achievements-container">
        <div className="card-container">
          {/* Personal Details Section */}
          <div>
            <div className="collapsible-header" onClick={() => toggleSection('personalDetails')}>
              <span>Personal Details</span>
              <span className={`collapsible-arrow ${openSection === 'personalDetails' ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            {openSection === 'personalDetails' && (
              <div className="collapsible-content">
                <div className="form-field-row">
                  <div className="form-field name-input">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter your name"
                      value={formData.personalDetails.name}
                      onChange={(e) => handleInputChange('personalDetails', 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-field file-input-wrapper photo-upload">
                    <input
                      type="file"
                      className="form-input"
                      accept="image/*"
                      onChange={(e) => handleFileChange('personalDetails', 'photo', e)}
                      required
                    />
                    <span className="file-input-label">Upload your photo</span>
                  </div>
                </div>
                <div className="form-field-row">
                  <div className="form-field email-input">
                    <input
                      type="email"
                      className="form-input"
                      placeholder="Enter your email"
                      value={formData.personalDetails.email}
                      onChange={(e) => handleInputChange('personalDetails', 'email', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-field phone-input">
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
              </div>
            )}
          </div>

          {/* Academic Details Section */}
          <div>
            <div className="collapsible-header" onClick={() => toggleSection('academicDetails')}>
              <span>Academic Details</span>
              <span className={`collapsible-arrow ${openSection === 'academicDetails' ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            {openSection === 'academicDetails' && (
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
                    placeholder="Enter your area of interest (e.g., Full-stack, Embedded)"
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
            <div className="collapsible-header" onClick={() => toggleSection('projectDetails')}>
              <span>Project Details</span>
              <span className={`collapsible-arrow ${openSection === 'projectDetails' ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            {openSection === 'projectDetails' && (
              <div className="collapsible-content">
                {formData.projectDetails.map((project, index) => (
                  <div key={index} className="entry">
                    {formData.projectDetails.length > 1 && (
                      <button className="remove-button" onClick={() => removeProject(index)}>
                        <span className="trash-icon">🗑️</span>
                        Remove Project
                      </button>
                    )}
                    <div className="form-field">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter project title"
                        value={project.title}
                        onChange={(e) => handleInputChange('projectDetails', 'title', e.target.value, index)}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <input
                        type="url"
                        className="form-input"
                        placeholder="Enter project URL"
                        value={project.url}
                        onChange={(e) => handleInputChange('projectDetails', 'url', e.target.value, index)}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <textarea
                        className="form-textarea"
                        placeholder="Enter project description"
                        value={project.description}
                        onChange={(e) => handleInputChange('projectDetails', 'description', e.target.value, index)}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <div className="file-input-wrapper">
                        <input
                          type="file"
                          className="form-input"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileChange('projectDetails', 'document', e, index)}
                          required
                        />
                        <span className="file-input-label">Upload report</span>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="add-button" onClick={addProject}>
                  <span className="add-icon">+</span>
                  Add Project
                </button>
              </div>
            )}
          </div>

          {/* Competitions Section */}
          <div>
            <div className="collapsible-header" onClick={() => toggleSection('competitions')}>
              <span>Competitions</span>
              <span className={`collapsible-arrow ${openSection === 'competitions' ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            {openSection === 'competitions' && (
              <div className="collapsible-content">
                {formData.competitions.map((competition, index) => (
                  <div key={index} className="entry">
                    {formData.competitions.length > 1 && (
                      <button className="remove-button" onClick={() => removeCompetition(index)}>
                        <span className="trash-icon">🗑️</span>
                        Remove Competition
                      </button>
                    )}
                    <div className="form-field-row">
                      <label htmlFor={"competitions-start-date-" + index} className="form-label start-date-label">Start Date:</label>
                      <label htmlFor={"competitions-end-date-" + index} className="form-label end-date-label">End Date:</label>
                    </div>
                    <div className="form-field-row">
                      <div className="form-field start-date-input">
                        <input
                          type="date"
                          id={"competitions-start-date-" + index}
                          className="form-input"
                          placeholder="Select start date"
                          value={competition.startDate}
                          onChange={(e) => handleInputChange('competitions', 'startDate', e.target.value, index)}
                          required
                        />
                      </div>
                      <div className="form-field end-date-input">
                        <input
                          type="date"
                          id={"competitions-end-date-" + index}
                          className="form-input"
                          placeholder="Select end date"
                          value={competition.endDate}
                          onChange={(e) => handleInputChange('competitions', 'endDate', e.target.value, index)}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-field">
                      <textarea
                        className="form-textarea"
                        placeholder="Enter competition description"
                        value={competition.description}
                        onChange={(e) => handleInputChange('competitions', 'description', e.target.value, index)}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <div className="file-input-wrapper">
                        <input
                          type="file"
                          className="form-input"
                          accept=".pdf,.doc,.docx,.jpg,.png"
                          onChange={(e) => handleFileChange('competitions', 'upload', e, index)}
                          required
                        />
                        <span className="file-input-label">Upload file</span>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="add-button" onClick={addCompetition}>
                  <span className="add-icon">+</span>
                  Add Competition
                </button>
              </div>
            )}
          </div>

          {/* Internship Section */}
          <div>
            <div className="collapsible-header" onClick={() => toggleSection('internship')}>
              <span>Internship</span>
              <span className={`collapsible-arrow ${openSection === 'internship' ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            {openSection === 'internship' && (
              <div className="collapsible-content">
                {formData.internship.map((internship, index) => (
                  <div key={index} className="entry">
                    {formData.internship.length > 1 && (
                      <button className="remove-button" onClick={() => removeInternship(index)}>
                        <span className="trash-icon">🗑️</span>
                        Remove Internship
                      </button>
                    )}
                    <div className="form-field">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter company name"
                        value={internship.companyName}
                        onChange={(e) => handleInputChange('internship', 'companyName', e.target.value, index)}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter your role"
                        value={internship.role}
                        onChange={(e) => handleInputChange('internship', 'role', e.target.value, index)}
                        required
                      />
                    </div>
                    <div className="form-field-row">
                      <label htmlFor={"internship-start-date-" + index} className="form-label start-date-label">Start Date:</label>
                      <label htmlFor={"internship-end-date-" + index} className="form-label end-date-label">End Date:</label>
                    </div>
                    <div className="form-field-row">
                      <div className="form-field start-date-input">
                        <input
                          type="date"
                          id={"internship-start-date-" + index}
                          className="form-input"
                          placeholder="Select start date"
                          value={internship.startDate}
                          onChange={(e) => handleInputChange('internship', 'startDate', e.target.value, index)}
                          required
                        />
                      </div>
                      <div className="form-field end-date-input">
                        <input
                          type="date"
                          id={"internship-end-date-" + index}
                          className="form-input"
                          placeholder="Select end date"
                          value={internship.endDate}
                          onChange={(e) => handleInputChange('internship', 'endDate', e.target.value, index)}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-field">
                      <textarea
                        className="form-textarea"
                        placeholder="Enter internship description"
                        value={internship.description}
                        onChange={(e) => handleInputChange('internship', 'description', e.target.value, index)}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <div className="file-input-wrapper">
                        <input
                          type="file"
                          className="form-input"
                          accept=".pdf,.jpg,.png"
                          onChange={(e) => handleFileChange('internship', 'certificate', e, index)}
                          required
                        />
                        <span className="file-input-label">Upload certificate</span>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="add-button" onClick={addInternship}>
                  <span className="add-icon">+</span>
                  Add Internship
                </button>
              </div>
            )}
          </div>

          {/* Online Course Section */}
          <div>
            <div className="collapsible-header" onClick={() => toggleSection('onlineCourse')}>
              <span>Online Course</span>
              <span className={`collapsible-arrow ${openSection === 'onlineCourse' ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            {openSection === 'onlineCourse' && (
              <div className="collapsible-content">
                {formData.onlineCourse.map((course, index) => (
                  <div key={index} className="entry">
                    {formData.onlineCourse.length > 1 && (
                      <button className="remove-button" onClick={() => removeOnlineCourse(index)}>
                        <span className="trash-icon">🗑️</span>
                        Remove Online Course
                      </button>
                    )}
                    <div className="form-field">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter course name"
                        value={course.courseName}
                        onChange={(e) => handleInputChange('onlineCourse', 'courseName', e.target.value, index)}
                        required
                      />
                    </div>
                    <div className="form-field-row">
                      <label htmlFor={"online-course-start-date-" + index} className="form-label start-date-label">Start Date:</label>
                      <label htmlFor={"online-course-end-date-" + index} className="form-label end-date-label">End Date:</label>
                    </div>
                    <div className="form-field-row">
                      <div className="form-field start-date-input">
                        <input
                          type="date"
                          id={"online-course-start-date-" + index}
                          className="form-input"
                          placeholder="Select start date"
                          value={course.startDate}
                          onChange={(e) => handleInputChange('onlineCourse', 'startDate', e.target.value, index)}
                          required
                        />
                      </div>
                      <div className="form-field end-date-input">
                        <input
                          type="date"
                          id={"online-course-end-date-" + index}
                          className="form-input"
                          placeholder="Select end date"
                          value={course.endDate}
                          onChange={(e) => handleInputChange('onlineCourse', 'endDate', e.target.value, index)}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-field">
                      <div className="file-input-wrapper">
                        <input
                          type="file"
                          className="form-input"
                          accept=".pdf,.jpg,.png"
                          onChange={(e) => handleFileChange('onlineCourse', 'certifications', e, index)}
                          required
                        />
                        <span className="file-input-label">Upload certificate</span>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="add-button" onClick={addOnlineCourse}>
                  <span className="add-icon">+</span>
                  Add Online Course
                </button>
              </div>
            )}
          </div>

          {/* Product Development Section */}
          <div>
            <div className="collapsible-header" onClick={() => toggleSection('productDevelopment')}>
              <span>Product Development</span>
              <span className={`collapsible-arrow ${openSection === 'productDevelopment' ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            {openSection === 'productDevelopment' && (
              <div className="collapsible-content">
                {formData.productDevelopment.map((product, index) => (
                  <div key={index} className="entry">
                    {formData.productDevelopment.length > 1 && (
                      <button className="remove-button" onClick={() => removeProductDevelopment(index)}>
                        <span className="trash-icon">🗑️</span>
                        Remove Product Development
                      </button>
                    )}
                    <div className="form-field">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter product name"
                        value={product.productName}
                        onChange={(e) => handleInputChange('productDevelopment', 'productName', e.target.value, index)}
                        required
                      />
                    </div>
                    <div className="form-field-row">
                      <label htmlFor={"product-development-start-date-" + index} className="form-label start-date-label">Start Date:</label>
                      <label htmlFor={"product-development-end-date-" + index} className="form-label end-date-label">End Date:</label>
                    </div>
                    <div className="form-field-row">
                      <div className="form-field start-date-input">
                        <input
                          type="date"
                          id={"product-development-start-date-" + index}
                          className="form-input"
                          placeholder="Select start date"
                          value={product.startDate}
                          onChange={(e) => handleInputChange('productDevelopment', 'startDate', e.target.value, index)}
                          required
                        />
                      </div>
                      <div className="form-field end-date-input">
                        <input
                          type="date"
                          id={"product-development-end-date-" + index}
                          className="form-input"
                          placeholder="Select end date"
                          value={product.endDate}
                          onChange={(e) => handleInputChange('productDevelopment', 'endDate', e.target.value, index)}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-field">
                      <textarea
                        className="form-textarea"
                        placeholder="Enter product details"
                        value={product.details}
                        onChange={(e) => handleInputChange('productDevelopment', 'details', e.target.value, index)}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <div className="file-input-wrapper">
                        <input
                          type="file"
                          className="form-input"
                          accept=".pdf,.jpg,.png"
                          onChange={(e) => handleFileChange('productDevelopment', 'upload', e, index)}
                          required
                        />
                        <span className="file-input-label">Upload report</span>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="add-button" onClick={addProductDevelopment}>
                  <span className="add-icon">+</span>
                  Add Product Development
                </button>
              </div>
            )}
          </div>

          {/* Languages Section */}
          <div>
            <div className="collapsible-header" onClick={() => toggleSection('languages')}>
              <span>Languages</span>
              <span className={`collapsible-arrow ${openSection === 'languages' ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            {openSection === 'languages' && (
              <div className="collapsible-content">
                <div className="form-field">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter language (e.g., English,Tamil ,Hindi)"
                    value={formData.languages.language}
                    onChange={(e) => handleInputChange('languages', 'language', e.target.value)}
                    required
                  />
                </div>
                {/* <div className="form-field">
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
                </div> */}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>

        {/* Success Notification Card */}
        {showSuccess && (
          <div className="success-modal">
            <div className="success-checkmark">✔</div>
            <div className="success-title">Success!</div>
            <div className="success-message">Achievements submitted successfully.</div>
          </div>
        )}
      </div>
    </>
  );
};

export default Achievements;
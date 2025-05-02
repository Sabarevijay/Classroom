import React, { useState } from 'react';
import { Upload, Plus, Trash2 } from 'lucide-react'; // Import icons from Lucide React

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
    padding-bottom: 1rem;
  }

  /* Collapsible section header */
  .collapsible-header {
    background-color: #6b48ff;
    color: #fff;
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
    background-color: #7c5aff;
  }

  .collapsible-arrow {
    font-size: 1.2rem;
    transition: transform 0.3s ease;
    color: #fff;
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

  /* Form field with row layout for labels beside inputs or paired inputs */
  .form-field-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }

  /* Date field wrapper for Start Date and End Date */
  .date-field-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
  }

  /* Add margin-bottom to form-field-row containing date fields */
  .form-field-row.date-row {
    margin-bottom: 1rem;
  }

  .form-label {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    white-space: nowrap;
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
    width: 100%;
  }

  /* Specific widths for "Enter your name" and "Upload your photo" */
  .form-field-row .name-input {
    flex: 0 0 60%;
  }

  .form-field-row .photo-upload {
    flex: 0 0 35%;
  }

  /* Specific widths for "Enter your email" and "Enter your phone number" */
  .form-field-row .email-input {
    flex: 0 0 60%;
  }

  .form-field-row .phone-input {
    flex: 0 0 35%;
  }

  /* Specific widths for file upload inputs in various sections */
  .form-field-row .report-upload,
  .form-field-row .competition-upload,
  .form-field-row .internship-upload,
  .form-field-row .course-upload,
  .form-field-row .product-upload {
    flex: 0 0 60%;
  }

  /* Style for the status label */
  .status-label {
    color: #ff0000;
    font-size: 1rem;
    font-weight: 600;
    white-space: nowrap;
  }

  /* Specific widths for "Start Date" and "End Date" labels and inputs */
  .form-field-row .start-date-label,
  .form-field-row .end-date-label {
    flex: 0 0 20%;
    text-align: left;
  }

  .form-field-row .start-date-input,
  .form-field-row .end-date-input {
    flex: 0 0 30%;
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
    display: flex;
    align-items: center;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    color: #333;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    text-align: left;
    transition: border-color 0.2s, box-shadow 0.2s;
    gap: 0.5rem;
  }

  .file-input-wrapper input[type="file"]:focus + .file-input-label {
    border-color: #6b48ff;
    box-shadow: 0 0 0 3px rgba(107, 72, 255, 0.2);
  }

  /* Style for the upload icon */
  .upload-icon {
    width: 1.2rem;
    height: 1.2rem;
    color: #333;
  }

  /* Generic Add button (used for Add Project, Add Competition, etc.) */
  .add-button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    padding: 0;
    font-size: 1rem;
    color: #6b48ff;
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
    background-color: #6b48ff;
    color: #fff;
    border-radius: 50%;
  }

  /* Generic Remove button (used for Remove Project, Remove Competition, etc.) */
  .remove-button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    padding: 0;
    font-size: 1rem;
    color: #ff0000;
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
    background-color: #ff0000;
    color: #fff;
    border-radius: 50%;
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
    margin-bottom: 1rem;
  }

  /* Remove margin-bottom from the last form field in each entry to avoid extra spacing */
  .entry .form-field:last-child {
    margin-bottom: 0;
  }

  /* Button container for Submit, Preview, and Download */
  .button-container {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1rem;
    flex-wrap: wrap;
  }

  /* Nested container for Preview and Download buttons */
  .secondary-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
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
  }

  .submit-button:hover {
    background-color: #7c5aff;
  }

  /* Preview button */
  .preview-button {
    background-color: #28a745;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .preview-button:hover {
    background-color: #218838;
  }

  /* Download button */
  .download-button {
    background-color: #17a2b8;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .download-button:hover {
    background-color: #138496;
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

  /* Preview Modal */
  .preview-modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
  }

  .preview-modal {
    background-color: #fff;
    width: 900px;
    height: 90vh;
    overflow-y: auto;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    position: relative;
    padding: 1rem;
  }

  .preview-modal-close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    background-color: #ff4d4f;
    color: #fff;
    padding: 0.25rem;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
  }

  .preview-modal-close:hover {
    background-color: #e63946;
    transform: scale(1.1);
  }

  /* Resume Template Styles (Blue Simple Professional CV) */
  .resume-container {
    font-family: Arial, sans-serif;
    color: #333;
    line-height: 1.6;
    padding: 20px;
    background-color: #fff;
  }

  .resume-header {
    text-align: center;
    margin-bottom: 2rem;
    border-bottom: 2px solid #1e88e5; /* Blue accent */
    padding-bottom: 1rem;
  }

  .resume-header h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    color: #1e88e5;
    text-transform: uppercase;
  }

  .resume-header h2 {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0.5rem 0 0;
    color: #666;
  }

  .resume-photo {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #1e88e5;
    margin: 1rem auto;
    display: block;
  }

  .resume-section {
    margin-bottom: 1.5rem;
  }

  .resume-section h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e88e5;
    text-transform: uppercase;
    margin-bottom: 1rem;
    border-bottom: 1px solid #d1d5db;
    padding-bottom: 0.5rem;
  }

  .resume-section h4 {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0.5rem 0;
  }

  .resume-section p {
    font-size: 1rem;
    margin: 0.2rem 0;
  }

  .resume-section ul {
    list-style-type: disc;
    margin-left: 20px;
    padding-left: 10px;
  }

  .resume-section ul li {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .resume-contact {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .resume-contact p {
    font-size: 1rem;
    margin: 0;
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
      padding: 8px;
    }

    .card-container {
      // padding: 0.75rem;
      margin-top: 4.5rem;
      padding-top: 0;
      padding-bottom: 0.75rem;
      gap: 0.5rem;
    }

    .collapsible-header {
      padding: 8px 12px;
      font-size: 1rem;
    }

    .collapsible-arrow {
      font-size: 1rem;
    }

    .collapsible-content {
      padding: 0.75rem;
      gap: 0.5rem;
    }

    .form-field-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .form-field-row.date-row {
      margin-bottom: 0.75rem;
    }

    .date-field-wrapper {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
    }

    .form-field-row .report-upload,
    .form-field-row .competition-upload,
    .form-field-row .internship-upload,
    .form-field-row .course-upload,
    .form-field-row .product-upload {
      flex: 1;
      width: 100%;
    }

    .form-field-row .name-input,
    .form-field-row .photo-upload,
    .form-field-row .email-input,
    .form-field-row .phone-input {
      flex: 1;
      width: 100%;
    }

    .form-field-row .status-label {
      font-size: 0.9rem;
    }

    .form-input,
    .form-textarea,
    .form-select {
      padding: 0.5rem;
      font-size: 0.9rem;
    }

    .form-field-row .start-date-input,
    .form-field-row .end-date-input {
      flex: 1;
      width: 100%;
    }

    .form-field-row .start-date-label,
    .form-field-row .end-date-label {
      flex: 1;
      width: 100%;
    }

    .form-textarea {
      min-height: 80px;
    }

    .file-input-label {
      padding: 0.5rem;
      font-size: 0.9rem;
      gap: 0.4rem;
    }

    .upload-icon {
      width: 1rem;
      height: 1rem;
    }

    .form-label {
      font-size: 0.9rem;
    }

    .add-button,
    .remove-button {
      font-size: 0.9rem;
    }

    .add-button .add-icon,
    .remove-button .trash-icon {
      width: 1rem;
      height: 1rem;
      margin-right: 0.4rem;
    }

    .entry .form-field {
      margin-bottom: 0.75rem;
    }

    .remove-button {
      margin-bottom: 0.4rem;
    }

    /* Updated button layout for mobile */
    .button-container {
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .submit-button {
      padding: 8px 16px;
      font-size: 0.9rem;
      width: 100%;
      max-width: 200px;
    }

    .secondary-buttons {
      flex-direction: row;
      gap: 0.5rem;
    }

    .preview-button,
    .download-button {
      padding: 8px 16px;
      font-size: 0.9rem;
      width: 100%;
      max-width: 100px; /* Reduced width for side-by-side layout */
    }

    .preview-modal {
      width: 90%;
      height: 90vh;
      padding: 0.5rem;
    }

    .resume-header h1 {
      font-size: 1.5rem;
    }

    .resume-header h2 {
      font-size: 1rem;
    }

    .resume-photo {
      width: 80px;
      height: 80px;
    }

    .resume-contact {
      flex-direction: column;
      align-items: center;
    }

    .resume-section h3 {
      font-size: 1.2rem;
    }

    .resume-section h4 {
      font-size: 1rem;
    }

    .resume-section p,
    .resume-section ul li {
      font-size: 0.9rem;
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
    profileSummary: {
      description: '',
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
  const [showPreview, setShowPreview] = useState(false);

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

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleDownload = () => {
    const element = document.getElementById('resume-preview');
    const opt = {
      margin: 0.5,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    window.html2pdf().set(opt).from(element).save();
  };

  const photoUrl = formData.personalDetails.photo ? URL.createObjectURL(formData.personalDetails.photo) : null;

  // Split skills and languages into arrays for display
  const skills = formData.academicDetails.skills ? formData.academicDetails.skills.split(',').map(skill => skill.trim()) : [];
  const languages = formData.languages.language ? formData.languages.language.split(',').map(lang => lang.trim()) : [];

  return (
    <>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
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
                    <span className="file-input-label">
                      <Upload className="upload-icon" />
                      Upload photo
                    </span>
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
                      placeholder="Enter phone number"
                      value={formData.personalDetails.phoneNumber}
                      onChange={(e) => handleInputChange('personalDetails', 'phoneNumber', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Summary Section */}
          <div>
            <div className="collapsible-header" onClick={() => toggleSection('profileSummary')}>
              <span>Profile Summary</span>
              <span className={`collapsible-arrow ${openSection === 'profileSummary' ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            {openSection === 'profileSummary' && (
              <div className="collapsible-content">
                <div className="form-field">
                  <textarea
                    className="form-textarea"
                    placeholder="Enter your profile summary for the resume"
                    value={formData.profileSummary.description}
                    onChange={(e) => handleInputChange('profileSummary', 'description', e.target.value)}
                    required
                  />
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
                        <Trash2 className="trash-icon" />
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
                    <div className="form-field-row">
                      <div className="form-field file-input-wrapper report-upload">
                        <input
                          type="file"
                          className="form-input"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileChange('projectDetails', 'document', e, index)}
                          required
                        />
                        <span className="file-input-label">
                          <Upload className="upload-icon" />
                          Upload report
                        </span>
                      </div>
                      <span className="status-label">Status: Pending</span>
                    </div>
                  </div>
                ))}
                <button className="add-button" onClick={addProject}>
                  <Plus className="add-icon" />
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
                        <Trash2 className="trash-icon" />
                        Remove Competition
                      </button>
                    )}
                    <div className="form-field-row date-row">
                      <div className="date-field-wrapper">
                        <label htmlFor={"competitions-start-date-" + index} className="form-label start-date-label">Start Date:</label>
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
                      </div>
                      <div className="date-field-wrapper">
                        <label htmlFor={"competitions-end-date-" + index} className="form-label end-date-label">End Date:</label>
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
                    <div className="form-field-row">
                      <div className="form-field file-input-wrapper competition-upload">
                        <input
                          type="file"
                          className="form-input"
                          accept=".pdf,.doc,.docx,.jpg,.png"
                          onChange={(e) => handleFileChange('competitions', 'upload', e, index)}
                          required
                        />
                        <span className="file-input-label">
                          <Upload className="upload-icon" />
                          Upload file
                        </span>
                      </div>
                      <span className="status-label">Status: Pending</span>
                    </div>
                  </div>
                ))}
                <button className="add-button" onClick={addCompetition}>
                  <Plus className="add-icon" />
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
                        <Trash2 className="trash-icon" />
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
                    <div className="form-field-row date-row">
                      <div className="date-field-wrapper">
                        <label htmlFor={"internship-start-date-" + index} className="form-label start-date-label">Start Date:</label>
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
                      </div>
                      <div className="date-field-wrapper">
                        <label htmlFor={"internship-end-date-" + index} className="form-label end-date-label">End Date:</label>
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
                    <div className="form-field-row">
                      <div className="form-field file-input-wrapper internship-upload">
                        <input
                          type="file"
                          className="form-input"
                          accept=".pdf,.jpg,.png"
                          onChange={(e) => handleFileChange('internship', 'certificate', e, index)}
                          required
                        />
                        <span className="file-input-label">
                          <Upload className="upload-icon" />
                          Upload certificate
                        </span>
                      </div>
                      <span className="status-label">Status: Pending</span>
                    </div>
                  </div>
                ))}
                <button className="add-button" onClick={addInternship}>
                  <Plus className="add-icon" />
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
                        <Trash2 className="trash-icon" />
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
                    <div className="form-field-row date-row">
                      <div className="date-field-wrapper">
                        <label htmlFor={"online-course-start-date-" + index} className="form-label start-date-label">Start Date:</label>
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
                      </div>
                      <div className="date-field-wrapper">
                        <label htmlFor={"online-course-end-date-" + index} className="form-label end-date-label">End Date:</label>
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
                    </div>
                    <div className="form-field-row">
                      <div className="form-field file-input-wrapper course-upload">
                        <input
                          type="file"
                          className="form-input"
                          accept=".pdf,.jpg,.png"
                          onChange={(e) => handleFileChange('onlineCourse', 'certifications', e, index)}
                          required
                        />
                        <span className="file-input-label">
                          <Upload className="upload-icon" />
                          Upload certificate
                        </span>
                      </div>
                      <span className="status-label">Status: Pending</span>
                    </div>
                  </div>
                ))}
                <button className="add-button" onClick={addOnlineCourse}>
                  <Plus className="add-icon" />
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
                        <Trash2 className="trash-icon" />
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
                    <div className="form-field-row date-row">
                      <div className="date-field-wrapper">
                        <label htmlFor={"product-development-start-date-" + index} className="form-label start-date-label">Start Date:</label>
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
                      </div>
                      <div className="date-field-wrapper">
                        <label htmlFor={"product-development-end-date-" + index} className="form-label end-date-label">End Date:</label>
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
                    <div className="form-field-row">
                      <div className="form-field file-input-wrapper product-upload">
                        <input
                          type="file"
                          className="form-input"
                          accept=".pdf,.jpg,.png"
                          onChange={(e) => handleFileChange('productDevelopment', 'upload', e, index)}
                          required
                        />
                        <span className="file-input-label">
                          <Upload className="upload-icon" />
                          Upload report
                        </span>
                      </div>
                      <span className="status-label">Status: Pending</span>
                    </div>
                  </div>
                ))}
                <button className="add-button" onClick={addProductDevelopment}>
                  <Plus className="add-icon" />
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
              </div>
            )}
          </div>

          {/* Button Container for Submit, Preview, and Download */}
          <div className="button-container">
            <button className="submit-button" onClick={handleSubmit}>
              Submit
            </button>
            <div className="secondary-buttons">
              <button className="preview-button" onClick={handlePreview}>
                Preview
              </button>
              <button className="download-button" onClick={handleDownload}>
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Success Notification Card */}
        {showSuccess && (
          <div className="success-modal">
            <div className="success-checkmark">✔</div>
            <div className="success-title">Success!</div>
            <div className="success-message">Achievements submitted successfully.</div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && (
          <div className="preview-modal-container">
            <div className="preview-modal">
              <button className="preview-modal-close" onClick={handleClosePreview}>
                ✕
              </button>
              <div id="resume-preview" className="resume-container">
                {/* Header Section */}
                <div className="resume-header">
                  <h1>{formData.personalDetails.name || 'Your Name'}</h1>
                  <h2>Professional Profile</h2>
                  {photoUrl && <img src={photoUrl} alt="Profile" className="resume-photo" />}
                  <div className="resume-contact">
                    <p>{formData.personalDetails.phoneNumber || '+123-456-7890'}</p>
                    <p>{formData.personalDetails.email || 'your.email@example.com'}</p>
                    <p>123 Anywhere St., Any City</p>
                    <p>www.yourwebsite.com</p>
                  </div>
                </div>

                {/* Profile Section */}
                <div className="resume-section">
                  <h3>Profile</h3>
                  <p>
                    {formData.profileSummary.description ||
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation.'}
                  </p>
                </div>

                {/* Education Section */}
                <div className="resume-section">
                  <h3>Education</h3>
                  <div className="resume-item">
                    <h4>Wardiere University (Assumed)</h4>
                    <p>2025 - Present</p>
                    <p>Bachelor's Degree (Assumed)</p>
                    <p>GPA: {formData.academicDetails.cgpa || 'N/A'}</p>
                    <p>Area of Interest: {formData.academicDetails.areaOfInterest || 'N/A'}</p>
                  </div>
                </div>

                {/* Work Experience Section */}
                {(formData.internship.length > 0 || formData.productDevelopment.length > 0) && (
                  <div className="resume-section">
                    <h3>Work Experience</h3>
                    {formData.internship.map((internship, index) => (
                      <div key={index} className="resume-item">
                        <h4>{internship.companyName || 'Company'} - {internship.role || 'Role'}</h4>
                        <p>
                          {internship.startDate || 'N/A'} - {internship.endDate || 'Present'}
                        </p>
                        <ul>
                          <li>{internship.description || 'Contributed to company projects.'}</li>
                        </ul>
                      </div>
                    ))}
                    {formData.productDevelopment.map((product, index) => (
                      <div key={index} className="resume-item">
                        <h4>{product.productName || 'Product'} - Product Developer</h4>
                        <p>
                          {product.startDate || 'N/A'} - {product.endDate || 'Present'}
                        </p>
                        <ul>
                          <li>{product.details || 'Developed and launched a product.'}</li>
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects Section */}
                {formData.projectDetails.length > 0 && (
                  <div className="resume-section">
                    <h3>Projects</h3>
                    {formData.projectDetails.map((project, index) => (
                      <div key={index} className="resume-item">
                        <h4>{project.title || 'Untitled Project'}</h4>
                        <p>URL: {project.url || 'N/A'}</p>
                        <ul>
                          <li>{project.description || 'N/A'}</li>
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Competitions Section */}
                {formData.competitions.length > 0 && (
                  <div className="resume-section">
                    <h3>Competitions</h3>
                    {formData.competitions.map((competition, index) => (
                      <div key={index} className="resume-item">
                        <h4>Competition {index + 1}</h4>
                        <p>
                          {competition.startDate || 'N/A'} - {competition.endDate || 'N/A'}
                        </p>
                        <ul>
                          <li>{competition.description || 'Participated in a competition.'}</li>
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Online Courses Section */}
                {formData.onlineCourse.length > 0 && (
                  <div className="resume-section">
                    <h3>Online Courses</h3>
                    {formData.onlineCourse.map((course, index) => (
                      <div key={index} className="resume-item">
                        <h4>{course.courseName || 'Untitled Course'}</h4>
                        <p>
                          {course.startDate || 'N/A'} - {course.endDate || 'N/A'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills Section */}
                {skills.length > 0 && (
                  <div className="resume-section">
                    <h3>Skills</h3>
                    <ul>
                      {skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Languages Section */}
                {languages.length > 0 && (
                  <div className="resume-section">
                    <h3>Languages</h3>
                    <ul>
                      {languages.map((lang, index) => (
                        <li key={index}>{lang} (Fluent)</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Achievements;
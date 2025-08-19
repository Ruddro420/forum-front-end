import html2pdf from "html2pdf.js";
import React, { useState, useEffect, useRef } from "react";

export default function CvGenerate() {
  const [accentColor, setAccentColor] = useState("#2563eb");
  const [profileImage, setProfileImage] = useState("");
  const [formData, setFormData] = useState({
    name: "Jane Doe",
    title: "Full Stack Developer",
    summary: "Passionate developer with 5+ years of experience building scalable web applications using modern JavaScript frameworks.",
    email: "jane@example.com",
    phone: "+1 555 123 4567",
    address: "123 Main Street, New York, USA",
    website: "jane-doe-portfolio.com",
    linkedin: "linkedin.com/in/janedoe",
    github: "github.com/janedoe",
    skills: [
      { name: "JavaScript", level: 90 },
      { name: "React", level: 85 },
      { name: "Node.js", level: 80 }
    ],
    experience: [
      { 
        role: "Senior Frontend Developer", 
        company: "Tech Innovations Inc.", 
        years: "2020 - Present", 
        desc: "Implemented CI/CD pipelines reducing deployment time by 40%. Mentored junior developers and established coding standards." 
      },
      { 
        role: "Frontend Developer", 
        company: "Digital Solutions LLC", 
        years: "2018 - 2020", 
        desc: "Collaborated with UX designers to implement pixel-perfect interfaces." 
      }
    ],
    projects: [
      { 
        title: "E-commerce Platform", 
        link: "https://example.com/ecommerce", 
        desc: "Full-stack e-commerce solution with React frontend, Node.js backend, and MongoDB database. Handles 10k+ monthly users with 99.9% uptime." 
      },
      { 
        title: "Task Management App", 
        link: "https://example.com/tasks", 
        desc: "Real-time collaborative task management application with drag-and-drop interface and team permissions system." 
      }
    ],
    education: [
      { 
        degree: "M.S. in Computer Science", 
        school: "Stanford University", 
        years: "2020 - 2022", 
        desc: "Specialized in Machine Learning and Distributed Systems. Thesis on 'Optimizing React Applications for Performance'." 
      },
      { 
        degree: "B.S. in Software Engineering", 
        school: "MIT", 
        years: "2014 - 2018", 
        desc: "Graduated with honors. President of Web Development Club. Completed capstone project on automated testing frameworks." 
      }
    ],
    languages: [
      { name: "English", level: "Native" },
      { name: "Spanish", level: "Intermediate" },
      { name: "French", level: "Basic" }
    ],
    certifications: [
      { name: "AWS Certified Developer", year: "2021", issuer: "Amazon Web Services" },
      { name: "React Advanced Patterns", year: "2020", issuer: "Frontend Masters" }
    ]
  });

  const formRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("cvData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(parsed.formData || parsed);
      setProfileImage(parsed.profileImage || "");
      setAccentColor(parsed.accentColor || "#2563eb");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cvData", JSON.stringify({ formData, profileImage, accentColor }));
  }, [formData, profileImage, accentColor]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleArrayChange = (section, index, field, value) => {
    const updated = [...formData[section]];
    updated[index][field] = value;
    setFormData({ ...formData, [section]: updated });
  };

  const addItem = (section, emptyObj) => {
    setFormData({ ...formData, [section]: [...formData[section], emptyObj] });
  };

  const removeItem = (section, index) => {
    const updated = [...formData[section]];
    updated.splice(index, 1);
    setFormData({ ...formData, [section]: updated });
  };

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  };

  const downloadResume = () => {
    const cvElement = document.querySelector('.cv-print-area');
    if (!cvElement) return;
    // Use mm units and set width for full capture
    html2pdf()
      .set({
        margin: 10,
        filename: 'professional-cv.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: null, width: cvElement.scrollWidth },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      })
      .from(cvElement)
      .save();
  };

  // Helper function to render skill bars
  const renderSkillBars = (skills) => {
    return skills.map((skill, index) => (
      <div key={index} className="mb-2">
        <div className="flex justify-between text-xs mb-1">
          <span>{skill.name}</span>
          <span>{skill.level}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full rounded-full" 
            style={{ 
              width: `${skill.level}%`, 
              backgroundColor: accentColor 
            }}
          ></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="flex flex-col lg:flex-row p-4 gap-6 bg-gray-50 min-h-screen">
      {/* Form Panel */}
      <div ref={formRef} className="w-full lg:w-2/5 bg-white p-6 shadow-lg rounded-lg print:hidden overflow-y-auto max-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">CV Builder</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
          <div className="flex items-center">
            <input 
              type="color" 
              value={accentColor} 
              onChange={e => setAccentColor(e.target.value)} 
              className="h-10 w-10 rounded cursor-pointer" 
            />
            <span className="ml-2 text-gray-600">{accentColor}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Full Name" 
              value={formData.name} 
              onChange={e => handleChange("name", e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
            <input 
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Title" 
              value={formData.title} 
              onChange={e => handleChange("title", e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
            <textarea 
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Brief professional summary"
              rows="3"
              value={formData.summary} 
              onChange={e => handleChange("summary", e.target.value)} 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Email" 
              value={formData.email} 
              onChange={e => handleChange("email", e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input 
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Phone" 
              value={formData.phone} 
              onChange={e => handleChange("phone", e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input 
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Address" 
              value={formData.address} 
              onChange={e => handleChange("address", e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input 
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Website" 
              value={formData.website} 
              onChange={e => handleChange("website", e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
            <input 
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="LinkedIn" 
              value={formData.linkedin} 
              onChange={e => handleChange("linkedin", e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
            <input 
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder GitHub 
              value={formData.github} 
              onChange={e => handleChange("github", e.target.value)} 
            />
          </div>
        </div>

        {/* Repeatable sections */}
        {[
          { 
            key: "skills", 
            label: "Skills", 
            fields: [
              { key: "name", placeholder: "Skill Name" }, 
              { key: "level", placeholder: "Skill Level (0-100)", type: "number" }
            ],
            emptyItem: { name: "", level: 80 }
          },
          { 
            key: "experience", 
            label: "Work Experience", 
            fields: [
              { key: "role", placeholder: "Job Title" }, 
              { key: "company", placeholder: "Company" }, 
              { key: "years", placeholder: "Employment Period" }, 
              { key: "desc", placeholder: "Description & Achievements", type: "textarea" }
            ],
            emptyItem: { role: "", company: "", years: "", desc: "" }
          },
          { 
            key: "projects", 
            label: "Projects", 
            fields: [
              { key: "title", placeholder: "Project Title" }, 
              { key: "link", placeholder: "Project Link" }, 
              { key: "desc", placeholder: "Project Description", type: "textarea" }
            ],
            emptyItem: { title: "", link: "", desc: "" }
          },
          { 
            key: "education", 
            label: "Education", 
            fields: [
              { key: "degree", placeholder: "Degree/Certificate" }, 
              { key: "school", placeholder: "Institution" }, 
              { key: "years", placeholder: "Years Attended" }, 
              { key: "desc", placeholder: "Description", type: "textarea" }
            ],
            emptyItem: { degree: "", school: "", years: "", desc: "" }
          },
          { 
            key: "languages", 
            label: "Languages", 
            fields: [
              { key: "name", placeholder: "Language" }, 
              { key: "level", placeholder: "Proficiency Level" }
            ],
            emptyItem: { name: "", level: "" }
          },
          { 
            key: "certifications", 
            label: "Certifications", 
            fields: [
              { key: "name", placeholder: "Certification Name" }, 
              { key: "issuer", placeholder: "Issuing Organization" }, 
              { key: "year", placeholder: "Year Received" }
            ],
            emptyItem: { name: "", issuer: "", year: "" }
          }
        ].map(section => (
          <div key={section.key} className="mb-6">
            <h3 className="font-bold text-lg text-gray-800 mb-3 flex justify-between items-center">
              <span>{section.label}</span>
              <button 
                onClick={() => addItem(section.key, section.emptyItem)} 
                className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                + Add
              </button>
            </h3>
            <div className="space-y-4">
              {formData[section.key].map((item, idx) => (
                <div key={idx} className="border border-gray-200 p-4 rounded-md bg-gray-50">
                  {section.fields.map(f => (
                    f.type === "textarea" ? (
                      <div key={f.key} className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{f.placeholder}</label>
                        <textarea
                          className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={item[f.key]}
                          placeholder={f.placeholder}
                          rows="3"
                          onChange={e => handleArrayChange(section.key, idx, f.key, e.target.value)}
                        />
                      </div>
                    ) : (
                      <div key={f.key} className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{f.placeholder}</label>
                        <input
                          type={f.type || "text"}
                          className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={item[f.key]}
                          placeholder={f.placeholder}
                          onChange={e => handleArrayChange(section.key, idx, f.key, e.target.value)}
                        />
                      </div>
                    )
                  ))}
                  <button 
                    onClick={() => removeItem(section.key, idx)} 
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button 
          onClick={downloadResume} 
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
        >
          Download PDF CV
        </button>
      </div>

      {/* Preview Panel */}
  <div className="cv-print-area bg-white p-8 shadow-lg rounded-lg" style={{ width: '900px', margin: '0 auto', color: '#000' }}>
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="md:w-1/3">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-40 h-40 object-cover rounded-full mx-auto md:mx-0 border-4" style={{ borderColor: accentColor }} />
            ) : (
              <div className="w-40 h-40 bg-gray-200 rounded-full mx-auto md:mx-0 flex items-center justify-center border-4" style={{ borderColor: accentColor }}>
                <span className="text-gray-500">Profile Photo</span>
              </div>
            )}
            
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4" style={{ color: accentColor }}>Contact</h2>
              <div className="space-y-2">
                <div className="flex items-start">
                  <svg className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>{formData.email}</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>{formData.phone}</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{formData.address}</span>
                </div>
                {formData.website && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    <span>{formData.website}</span>
                  </div>
                )}
                {formData.linkedin && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                    </svg>
                    <span>{formData.linkedin}</span>
                  </div>
                )}
                {formData.github && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                    <span>{formData.github}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4" style={{ color: accentColor }}>Skills</h2>
              {renderSkillBars(formData.skills)}
            </div>
            
            {formData.languages && formData.languages.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4" style={{ color: accentColor }}>Languages</h2>
                <div className="space-y-3">
                  {formData.languages.map((lang, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{lang.name}</span>
                        <span className="text-gray-600">{lang.level}</span>
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: lang.level === 'Native' ? '100%' : 
                                   lang.level === 'Fluent' ? '90%' : 
                                   lang.level === 'Advanced' ? '80%' : 
                                   lang.level === 'Intermediate' ? '60%' : 
                                   lang.level === 'Basic' ? '40%' : '50%', 
                            backgroundColor: accentColor 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="md:w-2/3">
            <div className="mb-8 cv-section">
              <h1 className="text-3xl font-bold text-gray-800">{formData.name}</h1>
              <p className="text-xl mt-1" style={{ color: accentColor }}>{formData.title}</p>
            </div>
            
            {formData.summary && (
              <div className="mb-8 cv-section">
                <h2 className="text-xl font-bold mb-3 pb-2 border-b" style={{ borderColor: accentColor, color: accentColor }}>Profile</h2>
                <p className="text-gray-700">{formData.summary}</p>
              </div>
            )}
            
            {formData.experience && formData.experience.length > 0 && (
              <div className="mb-8 cv-section">
                <h2 className="text-xl font-bold mb-4 pb-2 border-b" style={{ borderColor: accentColor, color: accentColor }}>Work Experience</h2>
                <div className="space-y-6">
                  {formData.experience.map((exp, idx) => (
                    <div key={idx} className="pl-4 border-l-2" style={{ borderColor: accentColor }}>
                      <h3 className="text-lg font-semibold text-gray-800">{exp.role}</h3>
                      <div className="flex justify-between text-gray-600 mb-2">
                        <span>{exp.company}</span>
                        <span className="text-sm">{exp.years}</span>
                      </div>
                      <p className="text-gray-700">{exp.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {formData.education && formData.education.length > 0 && (
              <div className="mb-8 cv-section">
                <h2 className="text-xl font-bold mb-4 pb-2 border-b" style={{ borderColor: accentColor, color: accentColor }}>Education</h2>
                <div className="space-y-6">
                  {formData.education.map((edu, idx) => (
                    <div key={idx} className="pl-4 border-l-2" style={{ borderColor: accentColor }}>
                      <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                      <div className="flex justify-between text-gray-600 mb-2">
                        <span>{edu.school}</span>
                        <span className="text-sm">{edu.years}</span>
                      </div>
                      {edu.desc && <p className="text-gray-700">{edu.desc}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {formData.projects && formData.projects.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 pb-2 border-b" style={{ borderColor: accentColor, color: accentColor }}>Projects</h2>
                <div className="space-y-4">
                  {formData.projects.map((proj, idx) => (
                    <div key={idx}>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {proj.link ? (
                          <a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: accentColor }}>
                            {proj.title}
                          </a>
                        ) : (
                          proj.title
                        )}
                      </h3>
                      <p className="text-gray-700">{proj.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {formData.certifications && formData.certifications.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 pb-2 border-b" style={{ borderColor: accentColor, color: accentColor }}>Certifications</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {formData.certifications.map((cert, idx) => (
                    <li key={idx} className="text-gray-700">
                      <span className="font-medium">{cert.name}</span> - {cert.issuer} ({cert.year})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
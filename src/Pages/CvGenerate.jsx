import html2pdf from "html2pdf.js";
import React, { useState, useEffect, useRef } from "react";

export default function CvGenerate() {
  const [accentColor, setAccentColor] = useState("#2563eb");
  const [profileImage, setProfileImage] = useState("");
  const [formData, setFormData] = useState({
    name: "Jane Doe",
    title: "Full Stack Developer",
    email: "jane@example.com",
    phone: "+1 555 123 4567",
    address: "123 Main Street, New York, USA",
    skills: ["JavaScript", "React", "Node.js"],
    experience: [
      { role: "Frontend Developer", company: "Tech Corp", years: "2020 - Present", desc: "Built responsive UI with React and Tailwind." }
    ],
    projects: [
      { title: "Portfolio Website", link: "https://example.com", desc: "A personal portfolio showcasing projects." }
    ],
    education: [
      { degree: "B.Sc. in Computer Science", school: "NY University", years: "2016 - 2020", result: "GPA 3.9/4.0" }
    ],
    languages: [
      { name: "English", level: "Native" },
      { name: "Spanish", level: "Intermediate" }
    ],
    references: [
      { name: "John Smith", position: "Manager", contact: "john.smith@example.com" }
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

  /* const downloadResume = () => {
    if (!formRef.current) return;
    const formPanel = formRef.current;
    formPanel.style.display = "none";
    window.print();
    setTimeout(() => {
      formPanel.style.display = "block";
    }, 500);
  }; */

  const downloadResume = () => {
  const cvElement = document.querySelector('.cv-print-area');
  if (!cvElement) return;
  html2pdf()
    .set({
      margin: 0,
      filename: 'cv.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    })
    .from(cvElement)
    .save();
};

  return (
    <div className="flex flex-col lg:flex-row p-4 gap-4">
      {/* Form Panel */}
      <div ref={formRef} className="w-full lg:w-1/3 bg-white p-4 shadow rounded print:hidden overflow-y-auto max-h-screen">
        <h2 className="text-xl font-bold mb-2">Edit CV</h2>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
        <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="mb-4" />
        <input className="border p-1 mb-2 w-full" placeholder="Full Name" value={formData.name} onChange={e => handleChange("name", e.target.value)} />
        <input className="border p-1 mb-2 w-full" placeholder="Title" value={formData.title} onChange={e => handleChange("title", e.target.value)} />
        <input className="border p-1 mb-2 w-full" placeholder="Email" value={formData.email} onChange={e => handleChange("email", e.target.value)} />
        <input className="border p-1 mb-2 w-full" placeholder="Phone" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} />
        <input className="border p-1 mb-4 w-full" placeholder="Address" value={formData.address} onChange={e => handleChange("address", e.target.value)} />

        {/* Repeatable sections */}
        {[
          { key: "skills", label: "Skills", fields: [{ key: null, placeholder: "Skill" }] },
          { key: "experience", label: "Experience", fields: [{ key: "role", placeholder: "Role" }, { key: "company", placeholder: "Company" }, { key: "years", placeholder: "Years" }, { key: "desc", placeholder: "Description" }] },
          { key: "projects", label: "Projects", fields: [{ key: "title", placeholder: "Title" }, { key: "link", placeholder: "Link" }, { key: "desc", placeholder: "Description" }] },
          { key: "education", label: "Education", fields: [{ key: "degree", placeholder: "Degree" }, { key: "school", placeholder: "School" }, { key: "years", placeholder: "Years" }, { key: "result", placeholder: "Result" }] },
          { key: "languages", label: "Languages", fields: [{ key: "name", placeholder: "Language" }, { key: "level", placeholder: "Proficiency" }] },
          { key: "references", label: "References", fields: [{ key: "name", placeholder: "Name" }, { key: "position", placeholder: "Position" }, { key: "contact", placeholder: "Contact" }] }
        ].map(section => (
          <div key={section.key} className="mb-4">
            <h3 className="font-bold">{section.label}</h3>
            {formData[section.key].map((item, idx) => (
              <div key={idx} className="mb-2 border p-2 rounded">
                {section.fields.length === 1 && section.fields[0].key === null ? (
                  <input className="border p-1 w-full" value={item} placeholder={section.fields[0].placeholder} onChange={e => {
                    const updated = [...formData[section.key]];
                    updated[idx] = e.target.value;
                    setFormData({ ...formData, [section.key]: updated });
                  }} />
                ) : (
                  section.fields.map(f => (
                    <input key={f.key} className="border p-1 mb-1 w-full" value={item[f.key]} placeholder={f.placeholder} onChange={e => handleArrayChange(section.key, idx, f.key, e.target.value)} />
                  ))
                )}
                <button onClick={() => removeItem(section.key, idx)} className="text-red-500 text-sm">Remove</button>
              </div>
            ))}
            <button onClick={() => addItem(section.key, section.fields.length === 1 && section.fields[0].key === null ? "" : Object.fromEntries(section.fields.map(f => [f.key, ""])))} className="text-blue-500 text-sm">+ Add {section.label.slice(0, -1)}</button>
          </div>
        ))}

        <button onClick={downloadResume} className="bg-green-500 text-white px-4 py-2 rounded">Download PDF</button>
      </div>

      {/* Preview Panel */}
      <div className="w-full lg:w-2/3 bg-white p-6 shadow rounded print:w-full print:shadow-none cv-print-area" style={{ color: "#000" }}>
        <div className="flex items-center gap-4 mb-4">
          {profileImage && <img src={profileImage} alt="Profile" className="w-24 h-24 object-cover rounded-full" />}
          <div>
            <h1 className="text-2xl font-bold">{formData.name}</h1>
            <p style={{ color: accentColor }}>{formData.title}</p>
          </div>
        </div>
        <p><b>Email:</b> {formData.email} | <b>Phone:</b> {formData.phone}</p>
        <p><b>Address:</b> {formData.address}</p>

        {Object.entries({
          Skills: formData.skills,
          Experience: formData.experience,
          Projects: formData.projects,
          Education: formData.education,
          Languages: formData.languages,
          References: formData.references
        }).map(([label, list]) => (
          <div key={label} className="mt-4">
            <h2 className="text-lg font-bold border-b pb-1" style={{ borderColor: accentColor, color: accentColor }}>{label}</h2>
            <ul className="list-disc ml-5">
              {list.map((item, idx) => (
                typeof item === "string" ? (
                  <li key={idx}>{item}</li>
                ) : (
                  <li key={idx}>
                    {Object.values(item).filter(Boolean).join(" – ")}
                  </li>
                )
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

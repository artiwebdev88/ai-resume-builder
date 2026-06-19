import { useState, useEffect } from "react";
import jsPDF from "jspdf";

function ResumeForm() {
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [skills, setSkills] = useState(localStorage.getItem("skills") || "");
  const [education, setEducation] = useState(localStorage.getItem("education") || "");
  const [experience, setExperience] = useState(localStorage.getItem("experience") || "");
  const [summary, setSummary] = useState(localStorage.getItem("summary") || "");
  const [photo, setPhoto] = useState(localStorage.getItem("photo") || null);
  const [template, setTemplate] = useState("modern");
  const [darkMode, setDarkMode] = useState(false);


  useEffect(() => {
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("skills", skills);
    localStorage.setItem("education", education);
    localStorage.setItem("experience", experience);
    localStorage.setItem("summary", summary);
  }, [name, email, skills, education, experience, summary]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Resume Generated Successfully!");
  };

  const clearForm = () => {
    setName("");
    setEmail("");
    setSkills("");
    setEducation("");
    setExperience("");
    setSummary("");
    setPhoto(null);
    localStorage.clear();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(33, 150, 243);
doc.rect(0, 0, 210, 40, "F");

doc.setTextColor(255, 255, 255);
doc.setFontSize(24);
doc.text(name || "Your Name", 20, 20);

doc.setFontSize(12);
doc.text(email || "your@email.com", 20, 30);

doc.setTextColor(0, 0, 0);

    doc.setFontSize(24);
    doc.text(name || "Your Name", 20, 20);

    doc.setFontSize(12);
    doc.text(email || "your@email.com", 20, 30);

    doc.line(20, 35, 190, 35);

    doc.setFontSize(16);
    doc.text("Professional Summary", 20, 50);

    doc.setFontSize(12);
    doc.text(summary || "-", 20, 60);

    doc.setFontSize(16);
    doc.text("Skills", 20, 85);


    
    const skillsList = skills
      .split(",")
      .filter((skill) => skill.trim() !== "");

    skillsList.forEach((skill, index) => {
      doc.text(`• ${skill.trim()}`, 25, 95 + index * 8);
    });

    const skillsEndY = 95 + skillsList.length * 8;

    doc.setFontSize(16);
    doc.text("Education", 20, skillsEndY + 15);

    doc.setFontSize(12);
    doc.text(education || "-", 20, skillsEndY + 25);

    doc.setFontSize(16);
    doc.text("Experience", 20, skillsEndY + 45);

    doc.setFontSize(12);
    doc.text(experience || "-", 20, skillsEndY + 55);

    doc.save("Resume.pdf");
  };


  return (
    <div className="container">
      <h2>Resume Builder</h2>

      <form onSubmit={handleSubmit}>
         <div>
  <label>Profile Photo:</label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onloadend = () => {
          setPhoto(reader.result);
          localStorage.setItem("photo", reader.result);
        };

        reader.readAsDataURL(file);
      }
    }}
  />
</div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label>Skills:</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="HTML, CSS, JavaScript, React"
          />
        </div>

        <div>
          <label>Education:</label>
          <textarea
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            placeholder="Enter your education"
          />
        </div>

        <div>
          <label>Experience:</label>
          <textarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Enter your experience"
          />
        </div>
               
<div>
  <label>Professional Summary:</label>

  <textarea
    value={summary}
    onChange={(e) => setSummary(e.target.value)}
    placeholder="Write a professional summary"
  />
</div>

<div>
  <label>Select Template:</label>
  <select
    value={template}
    onChange={(e) => setTemplate(e.target.value)}
  >
    <option value="modern">Modern</option>
    <option value="professional">Professional</option>
    <option value="minimal">Minimal</option>
  </select>
</div>
            <div className="button-group">
  <button type="submit">
    Generate Resume
  </button>

  <button
    type="button"
    className="clear-btn"
    onClick={clearForm}
  >
    Clear Form
  </button>

  <button
    type="button"
    onClick={downloadPDF}
  >
    Download PDF
  </button>

    <button
  type="button"
  onClick={() => setDarkMode(!darkMode)}
>
  {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
</button>

</div>


      </form>

      <hr />

      <div className="preview">
        <h3>Resume Preview</h3>

{photo && (
  <img
    src={photo}
    alt="Profile"
    width="120"
    height="120"
    style={{
      borderRadius: "50%",
      objectFit: "cover",
      display: "block",
      margin: "0 auto 20px"
    }}
  />
)}


<p>{summary}</p>
        <p>
          <strong>Name:</strong> {name}
        </p>

        <p>
          <strong>Email:</strong> {email}
        </p>

        <ul>
  {skills
    .split(",")
    .filter((skill) => skill.trim() !== "")
    .map((skill, index) => (
      <div key={index} className="skill-item">
        <p>{skill.trim()}</p>

        <div className="skill-bar">
          <div
            className="skill-progress"
            style={{
              width: `${80 - index * 10}%`,
            }}
          ></div>
        </div>
      </div>
    ))}
</ul>

        <p>
          <strong>Education:</strong> {education}
        </p>

        <p>
          <strong>Experience:</strong> {experience}
        </p>

        <p>
  <strong>Professional Summary:</strong>
</p>
<div className={`preview ${template}`}>
</div>
<div className={darkMode ? "container dark" : "container"}></div>

      </div>
    </div>
  );
}

export default ResumeForm;
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel
} from "docx";
import { saveAs } from "file-saver";
import { useRef } from "react";
import html2canvas from "html2canvas";

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
  const [phone, setPhone] = useState(localStorage.getItem("phone") || "");
  const resumeRef = useRef();

const calculateATS = () => {
  let score = 0;

  if (name) score += 20;
  if (email) score += 20;
  if (phone) score += 15;
  if (skills) score += 15;
  if (education) score += 15;
  if (experience) score += 15;

  return score;
};

  useEffect(() => {
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("skills", skills);
    localStorage.setItem("education", education);
    localStorage.setItem("experience", experience);
    localStorage.setItem("summary", summary);
    localStorage.setItem("phone", phone);
  }, [name, email, skills, education, experience, summary,phone]);
  

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
    setPhone("");
    localStorage.clear();
  };

  const downloadPDF = async () => {
  const canvas = await html2canvas(resumeRef.current, {
    scale: 2,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = 210;
  const pdfHeight =
    (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(
    imgData,
    "PNG",
    0,
    0,
    pdfWidth,
    pdfHeight
  );

  pdf.save("Resume.pdf");
};
const downloadDOCX = async () => {
  const skillsArray = skills
    .split(",")
    .filter(skill => skill.trim() !== "");

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: name,
            heading: HeadingLevel.TITLE,
          }),

          new Paragraph(email),
          new Paragraph(phone),

          new Paragraph({
            text: "Professional Summary",
            heading: HeadingLevel.HEADING_1,
          }),

          new Paragraph(summary),

          new Paragraph({
            text: "Skills",
            heading: HeadingLevel.HEADING_1,
          }),

          ...skillsArray.map(
            skill =>
              new Paragraph({
                text: skill.trim(),
                bullet: { level: 0 },
              })
          ),

          new Paragraph({
            text: "Education",
            heading: HeadingLevel.HEADING_1,
          }),

          new Paragraph(education),

          new Paragraph({
            text: "Experience",
            heading: HeadingLevel.HEADING_1,
          }),

          new Paragraph(experience),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "Resume.docx");
};

  return (
   <div className={darkMode ? "container dark" : "container"}>
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
  <label>Phone Number:</label>
  <input
    type="tel"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    placeholder="Enter phone number"
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
  onClick={downloadDOCX}
>
  Download DOCX
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

      <div ref={resumeRef} className={`preview ${template}`}>
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
<h2>{name}</h2>
<p>{email}</p>
<p>{phone}</p>

<p>
  <strong>Professional Summary</strong>
</p>
<p>{summary}</p>
       <label>Skills:</label>
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
             width: `${Math.max(30, 80 - index * 10)}%`,
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
</div>
</div>
    
   );
}

export default ResumeForm;
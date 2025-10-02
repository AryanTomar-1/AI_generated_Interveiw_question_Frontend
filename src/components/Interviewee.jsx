import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import "../styles.css";
import TimedInterviewMCQ from "./questions.jsx";
import { useSelector } from "react-redux";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function now() {
  return new Date().toLocaleTimeString();
}

export default function Interviewee({ candidates, addCandidate, updateCandidate, appendMessage }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selected, setSelected] = useState(null); // candidate id
  const [condidate, setCandidate] = useState(null);
  const [nextPage, setNextPage] = useState(false);
  const { sessionActive } = useSelector((state) => state);

  // handle file upload + parse
  async function handleFileChange(e) {
    const uploaded = e.target.files[0];
    if (!uploaded) return;
    setFile(uploaded);

    //let text = "";

    if (uploaded.name.endsWith(".pdf")) {
      const reader = new FileReader();
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map((it) => it.str).join(" ") + "\n";
        }
        parseResume(fullText);
      };
      reader.readAsArrayBuffer(uploaded);
    } else if (uploaded.name.endsWith(".docx")) {
      const reader = new FileReader();
      reader.onload = async () => {
        const { value } = await mammoth.extractRawText({ arrayBuffer: reader.result });
        parseResume(value);
      };
      reader.readAsArrayBuffer(uploaded);
    } else {
      alert("Only PDF or DOCX supported");
    }
  }

  function parseResume(text) {
    // Simple regex-based extraction
    const nameMatch = text.match(/([A-Z][a-z]+)/);
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
    const phoneMatch = text.match(/(\+?\d[\d -]{8,}\d)/);

    setName(nameMatch ? nameMatch[0] : "");
    setEmail(emailMatch ? emailMatch[0] : "");
    setPhone(phoneMatch ? phoneMatch[0] : "");
  }

  function handleStart() {
    if (!name.trim() || !email.trim() || !phone.trim()) return alert("All fields are required");
    if (!/^[^@]+@[^@]+\.[cC][oO][mM]$/.test(email.trim())) return alert("Email must contain @ and end with .com");
    if (!/^\d{10}$/.test(phone.trim())) return alert("Phone must be 10 digits");
    const id = uuidv4();
    const candidate = {
      id,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      status: "in-progress",
      score: null,
      messages: [
        {
          from: "system",
          text: "Welcome! When ready, answer the first question: What is a React component?",
          time: now(),
        },
      ],
    };
    setCandidate(candidate);
    setNextPage(true);
    setSelected(id);
  }

  return (
    <div className="interviewee">
      {!selected && !sessionActive && (
        <div className="upload-form">
          <h3>Upload Resume</h3>
          <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />

          <div className="form-fields">
            <input
              className="input"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!file}
            />
            <input
              type="text"
              className="input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!file}
              pattern="^[^@]+@[^@]+\.[cC][oO][mM]$"
              title="Email must contain @ and end with .com"
            />

            <input
              className="input"
              placeholder="Phone"
              value={phone}
              maxLength={10}
              minLength={10}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!file}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={handleStart}
            disabled={!name.trim() || !email.trim() || !phone.trim()}
          >
            Start Test
          </button>
        </div>
      )}

      {(nextPage || sessionActive) && (
        <TimedInterviewMCQ candidate={condidate} />
      )}
    </div>
  );
}

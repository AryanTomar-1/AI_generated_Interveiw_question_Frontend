import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/homePage";
import Interviewee from "./components/Interviewee";
import Interviewer from "./components/Interviewer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/interviewee" element={<Interviewee />} />
        <Route path="/interviewer" element={<Interviewer />} />
      </Routes>
    </Router>
  );
}

export default App;
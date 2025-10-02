import React from "react";
import { Link } from "react-router-dom";
import "../styles.css";

export default function Home() {

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Swipe — AI Interview Assistant (Demo)</h1>
      </header>

      <main className="app-main">
        <div className="tab-choice">
          <Link
            to="/interviewee"
            className="tab-card"
          >
            <img src="/images/interviewee.png" alt="Interviewee" />
            <h3>Interviewee</h3>
          </Link>
          <Link to="/interviewer" className="tab-card">
            <img src="/images/interviewer.png" alt="Interviewer" />
            <h3>Interviewer</h3>
          </Link>
        </div>
      </main>

      <footer className="app-footer">
        <small>Local demo — data saved in localStorage</small>
      </footer>
    </div>
  );
}

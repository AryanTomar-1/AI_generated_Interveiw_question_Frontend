import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "../styles.css";

export default function Interviewer() {
  const [candidates, setCandidates] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("Select");

  useEffect(() => {
    fetchCandidates(); // load all on mount
  }, []);

  // ✅ Debounced Search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length >= 3) {
        searchCandidates(query);
      } else if (query.length === 0) {
        fetchCandidates();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchCandidates = async () => {
    console.log("Fetching all candidates", process.env.REACT_APP_BACKEND_API_URL);
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/candidates/all`);
      setCandidates(res.data);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  };

  const searchCandidates = async (query) => {
    console.log("Searching for:", query);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/candidates/search/${query}`
      );
      setCandidates(res.data);
    } catch (err) {
      console.error("Error searching candidates:", err);
    }
  };

  const getCandidateDetails = async (email, id) => {
    try {
      setSelectedId(id);
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/candidates/${email}`
      );
      setCandidateDetails(res.data);
    } catch (err) {
      console.error("Error fetching candidate details:", err);
    }
  };

  const sortedCandidates = useMemo(() => {
    if (sortBy === "Select") return candidates;
    return [...candidates].sort((a, b) => {
      if (sortBy === "score-desc") return (b.score || 0) - (a.score || 0);
      if (sortBy === "score-asc") return (a.score || 0) - (b.score || 0);
      if (sortBy === "name-asc") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "name-desc") return (b.name || "").localeCompare(a.name || "");
      return 0;
    });
  }, [candidates, sortBy]);


  return (
    <div className="interviewer">
      <div className="dashboard-header">
        <h2>Interviewer Dashboard</h2>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <input
            className="search-input"
            placeholder="🔍 Search by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ padding: "6px", borderRadius: "4px" }}
          >
            <option value="Select">Sort By</option>
            <option value="score-desc">Sort: Score (High → Low)</option>
            <option value="score-asc">Sort: Score (Low → High)</option>
            <option value="name-asc">Sort: Name (A → Z)</option>
            <option value="name-desc">Sort: Name (Z → A)</option>
          </select>
        </div>
      </div>

      <div className="dashboard-body">
        {/* Candidate list */}
        <div className="list-pane">
          {candidates.length === 0 && (
            <div className="muted">No candidates</div>
          )}
          <ul className="candidate-list">
            {sortedCandidates.map((c) => (
              <li
                key={c.id}
                onClick={() => getCandidateDetails(c.email, c.id)}
                className={`candidate-card ${selectedId === c.id ? "selected" : ""
                  }`}
              >
                <div className="candidate-info">
                  <h4>{c.name}</h4>
                  <span className="email">{c.email}</span>
                </div>
                <div className="candidate-score">
                  <span className="score">{c.score ?? "—"}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Candidate details */}
        <div className="detail-pane">
          {!candidateDetails && (
            <div className="muted placeholder">
              Select a candidate to view details
            </div>
          )}

          {candidateDetails && (
            <div className="candidate-details">
              <h3>
                {candidateDetails.name}{" "}
                <small className="muted">({candidateDetails.email})</small>
              </h3>

              <p>
                <strong>Total Score:</strong>{" "}
                <span className="score">
                  {candidateDetails.totalScore ?? "—"}
                </span>
              </p>

              <p>
                <strong>Summary:</strong>{" "}
                <span>{candidateDetails.summary || "No summary available"}</span>
              </p>

              <h4>Questions & Answers</h4>
              {candidateDetails.questions?.length > 0 ? (
                <ul className="question-list">
                  {candidateDetails.questions.map((q, i) => (
                    <li key={i} className="question-item">
                      <p>
                        <strong>Q{i + 1}: </strong> {q.question}
                      </p>
                      <p>
                        <strong>Candidate Answer:</strong>{" "}
                        {q.studentAnswer || "—"}
                      </p>
                      <p>
                        <strong>Correct Answer:</strong>{" "}
                        {q.correctAnswer || "—"}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="muted">No questions recorded</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

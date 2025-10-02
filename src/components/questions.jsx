import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    startSession,
    saveAnswer,
    nextQuestion,
    setTimer,
    setSummary,
} from "../store/interviewSlice";
import WelcomeBackModal from "./WelcomeBackModal";
import axios from "axios";
import "../styles.css";

const TimedInterviewMCQ = ({ candidate }) => {
    const dispatch = useDispatch();
    const {
        candidateEmail,
        candidateName,
        questions,
        currentIndex,
        timer,
        answers,
        summary,
        loading,
        sessionActive,
        finished,
    } = useSelector((state) => state);
    const [closed, setClosed] = React.useState(sessionActive);
    const [loadingSummary, setLoadingSummary] = React.useState(false);


    // Fetch questions on mount if not already loaded
    useEffect(() => {
        if (!sessionActive || !questions || questions.length === 0) {
            const fetchQuestions = async () => {
                dispatch(startSession({ loading: true }));
                try {
                    const res = await axios.get(
                        `${process.env.REACT_APP_BACKEND_API_URL}/questions/ai_genrated`
                    );
                    // The backend should return { questions: [...] }
                    dispatch(
                        startSession({
                            email: candidate.email,
                            name: candidate.name,
                            questions: res.data.questions,
                            loading: false,
                            sessionActive: true,
                        })
                    );
                    if (res.data.questions.length > 0) {
                        dispatch(setTimer(res.data.questions[0].timeLimit));
                    }
                } catch (err) {
                    console.error("Error fetching questions:", err);
                    dispatch(startSession({ loading: false }));
                }
            };
            fetchQuestions();
        }
        // eslint-disable-next-line
    }, [dispatch, candidate, sessionActive, questions]);

    // Countdown timer
    useEffect(() => {
        if (timer > 0 && !finished) {
            const countdown = setTimeout(() => dispatch(setTimer(timer - 1)), 1000);
            return () => clearTimeout(countdown);
        } else if (timer === 0 && questions.length > 0 && currentIndex < questions.length && !finished) {
            if(answers[currentIndex] === undefined) {
                dispatch(saveAnswer({ questionIndex: currentIndex, selected: null }));
            }
            handleNext();
        }
        // eslint-disable-next-line
    }, [timer, dispatch, questions, currentIndex, finished]);

    const handleAnswerSelect = (idx) => {
        dispatch(saveAnswer({ questionIndex: currentIndex, selected: idx }));
    };

    const handleNext = async () => {
        if (currentIndex < questions.length - 1) {
            dispatch(nextQuestion());
            dispatch(setTimer(questions[currentIndex + 1].timeLimit));
        } else {
            // Submit answers to backend
            if (summary != null) return;
            try {
                setLoadingSummary(true);
                const res = await axios.post(
                    `${process.env.REACT_APP_BACKEND_API_URL}/questions/review`,
                    {
                        candidateName: candidateName,
                        candidateEmail: candidateEmail,
                        questions: questions.map((q) => q.question),
                        answers: questions.map((q, idx) => questions[idx].options[
                            ["A", "B", "C", "D"].indexOf(questions[idx].answer)
                        ]),
                        candidateAnswers: answers.map((a, idx) => questions[idx].options[a.selected]),
                    }
                );
                dispatch(setSummary(res.data.review));
            } catch (err) {
                console.error("Error generating summary:", err);
            } finally {
                setLoadingSummary(false);
            }
        }
    };

    if (sessionActive && !finished && closed) {
        return <WelcomeBackModal setClosed={setClosed} />;
    }

    if (loading) {
        return (
            <div className="loading-container">
                <p>Generating Candidate Questions Please wait!</p>
            </div>
        );
    }
    if (loadingSummary) {
        return (
            <div className="loading-container">
                <p>Generating Summary... Please wait!</p>
            </div>
        );
    }

    if (summary) {
        return (
            <div className="summary-container">
                <h2>🎯 Candidate Report</h2>
                <h3>Candidate Name: {candidateName}</h3>
                <h3>Candidate E-mail: {candidateEmail}</h3>
                <p>
                    <strong>Score:</strong> {summary.score} / {questions.length}
                </p>
                <p>
                    <strong>Performance:</strong> {summary.performance}
                </p>
                <p>
                    <strong>Summary:</strong> {summary.short_feedback}
                </p>

                <h3>Answer Review:</h3>
                <div className="answers-review">
                    {answers.map((a, idx) => (
                        <div key={idx} className="answer-card">
                            <p>
                                <strong>Q{idx + 1}:</strong> {a.question}
                            </p>
                            <p>
                                <strong>Your Answer:</strong>{" "}
                                {a.selected !== null && a.selected !== undefined
                                    ? questions[idx].options[a.selected]
                                    : "Skipped"}
                            </p>
                            <p>
                                <strong>Correct Answer:</strong>{" "}
                                {
                                    questions[idx].options[
                                    ["A", "B", "C", "D"].indexOf(questions[idx].answer)
                                    ]
                                }
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return <p>No questions available.</p>;
    }

    const currentQ = questions[currentIndex];

    return (
        <div className="interview-container">
            <h2>
                Question {currentIndex + 1} of {questions.length}
            </h2>
            <p className="question-text">{currentQ.question}</p>
            <div className="options">
                {currentQ.options.map((opt, idx) => (
                    <button
                        key={idx}
                        className={`option-btn ${answers[currentIndex]?.selected === idx ? "selected" : ""
                            }`}
                        onClick={() => handleAnswerSelect(idx)}
                    >
                        {opt}
                    </button>
                ))}
            </div>
            <p className="timer">⏱ Time left: {timer}s</p>
            <button
                className="next-btn"
                onClick={handleNext}
                disabled={answers[currentIndex]?.selected === undefined && timer > 0}
            >
                Submit & Next
            </button>
        </div>
    );
};

export default TimedInterviewMCQ;
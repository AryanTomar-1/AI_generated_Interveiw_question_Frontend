import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetSession} from "../store/interviewSlice";
import "../styles.css";

const WelcomeBackModal = ({setClosed}) => {
    const dispatch = useDispatch();
    const { candidateEmail, candidateName} = useSelector((state) => state);

    const handleResume = () => {
        setClosed(false);
    };

    const handleStartNew = () => {
        dispatch(resetSession());
        setClosed(false);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-container">
                <h2> Welcome Back!</h2>
                <p>
                    Session is active <strong>{candidateName || candidateEmail}</strong>.
                </p>
                <div className="modal-actions">
                    <button className="resume-btn" onClick={handleResume}>
                        ok
                    </button>
                    <button className="new-btn" onClick={handleStartNew}>
                        cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomeBackModal;
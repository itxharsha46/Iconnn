import React from "react";
import "../style/Popup.css";
import Mascot from "../assets/Img/mascot.png";

const Popup = ({ message, onClose, showCloseIcon,showOkButton = true }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-container">
  {showCloseIcon && (
          <span
            onClick={onClose}
            style={{
              position: "absolute",
              top: "10px",
              right: "15px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold"
            }}
          >
            ✕
          </span>
        )}
        {/* Mascot */}
        <img src={Mascot} alt="Mascot" className="popup-mascot" />

        {/* Message */}
        <div className="popup-message">
          {message}
        </div>

        {/* Button (Conditional) */}
        {showOkButton && (
          <button className="popup-btn" onClick={onClose}>
            OK
          </button>
        )}
      </div>
    </div>
  );
};

export default Popup;

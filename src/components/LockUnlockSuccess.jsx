import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/LockUnlockSuccess.css";
import SuccessIcon from "../assets/Img/thumbSuccess.jpg";
import { useTranslation } from "react-i18next";

function LockUnlockSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
const { t } = useTranslation();
  const maskedAadhaar = location.state?.maskedAadhaar || "********0000";
  const actionType = location.state?.actionType || "lock";
  const successText = location.state?.message || "";
  //const successText = 
    // actionType === "unlock"
    //   ? `Your Aadhaar ${maskedAadhaar} has been unlocked successfully.`
    //   : `Your Aadhaar ${maskedAadhaar} has been locked successfully.`;

  return (
    <div className="success-container-lock">
      <div className="success-content-lock">
        <img
          src={SuccessIcon}
          alt="Success"
          className="success-icon-lock"
        />

        <h2 className="success-text-lock">
          {successText}
        </h2>
      </div>

      <div className="success-footer-lock">
        <button
          className="dashboard-btn-lockunlock"
          onClick={() => navigate("/kiosk-home2")}
        >
        {t("go_home")}
        </button>
      </div>
    </div>
  );
}

export default LockUnlockSuccess;

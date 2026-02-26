import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/VerifySuccess.css";
import { useEffect } from "react";
import thumbSuccess from "../assets/Img/thumbSuccess.jpg";
import { useTranslation } from "react-i18next";
// use your fingerprint/check image here

function VerifySuccess() {
  const navigate = useNavigate();
  const { t } = useTranslation();
useEffect(() => {
  let timeout;

  const idleTime =
    window.APP_CONFIG?.IDLE_TIMEOUT;

  const resetTimer = () => {
    // if (loading) return;

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      navigate("/kiosk-home2");
    }, idleTime);
  };

  const events = [
    "mousemove",
    "mousedown",
    "click",
    "scroll",
    "keypress",
    "touchstart"
  ];

  events.forEach(event =>
    window.addEventListener(event, resetTimer)
  );

  resetTimer();

  return () => {
    clearTimeout(timeout);
    events.forEach(event =>
      window.removeEventListener(event, resetTimer)
    );
  };
}, [navigate]);


  return (
    <div className="verify-success-wrapper">
      <div className="verify-success-content">
        <img
          src={thumbSuccess}
     alt={t("verification_successful")}
          className="success-icon"
        />

<div className="success-message-verify">
  {t("mobile_verified_success")}
</div>

      </div>

      <div className="verify-success-footer">
        <button
          className="dashboard-btn-verify"
          onClick={() => navigate("/kiosk-home2")}
        >
         {t("go_home")}
        </button>
      </div>
    </div>
  );
}

export default VerifySuccess;

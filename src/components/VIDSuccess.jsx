import React, { useEffect } from "react";
import { Link, useNavigate,useLocation } from "react-router-dom";
import "../style/VIDSuccess.css";
import { useTranslation } from "react-i18next";

function VIDSuccess() {
  const navigate = useNavigate();
  const { t } = useTranslation();
const location = useLocation();
  const vidNumber = location?.state?.vidNumber;
  /* ---------------- Idle Timeout ---------------- */
  useEffect(() => {
    let timeout;

    const idleTime = window.APP_CONFIG?.IDLE_TIMEOUT || 60000;

    const resetTimer = () => {
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
    
    <div className="vid-success-wrapper">

      {/* Content */}
      <div className="vid-success-content">

        {/* Fingerprint Style Icon */}
        <div className="success-icon-circle">
          <div className="success-check">✓</div>
        </div>

        {/* Main Message */}
        <h2 className="success-title">
  {t("vid_sent_message")} <br />
  <span className="vid-number">
    {vidNumber}
  </span>
</h2>

        {/* Info Text */}
       <p className="success-info-vid">
  {t("vid_info_message")}
</p>

      </div>

      {/* Bottom Button */}
      <div className="bottom-btn-container">
        <Link to="/kiosk-home2" className="dashboard-btn-vid">
         {t("go_home")}
        </Link>
      </div>

    </div>
  );
}

export default VIDSuccess;

import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/LockUnlockAadhaar.css";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function LockUnlockAadhaar() {
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
      <div className="full-screen-center-verify">

    {/* 🔙 Top Left Back Button */}
    <button
      className="top-back-btn "
      onClick={() => navigate(-1)}
    >
      ← 
    </button>
      <div className="form-card-main">
       

      
            <div className="form-card-header">
      <h2 className="header-title">
        {t("lock_unlock_title")}
      </h2>
    </div>

        {/* Body Content */}
        <div className="form-card-body">
          
          <h3 className="section-title" style={{ color: '#008CBA', fontSize: '20px', marginBottom: '25px' }}>
        {t("how_it_works")}
          </h3>

          {/* 3-Column Grid */}
          <div className="how-it-works-grid">
            
            {/* Card 1 */}
            <div className="info-card">
              <div className="card-icon-box">
                <span className="icon-text">123</span>
              </div>
              <div className="card-text">
                <h4>{t("virtual_id_title")}</h4>
<p>{t("virtual_id_desc")}</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="info-card">
              <div className="card-icon-box">
                <span className="icon-emoji">🔒</span> 
              </div>
              <div className="card-text">
                <h4>{t("lock_aadhaar_title")}</h4>
<p>{t("lock_aadhaar_desc")}</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="info-card">
              <div className="card-icon-box">
                <span className="icon-emoji">🔓</span>
              </div>
              <div className="card-text">
               <h4>{t("unlock_aadhaar_title")}</h4>
<p>{t("unlock_aadhaar_desc")}</p>
              </div>
            </div>

          </div>

          {/* Helper Text */}
          <div className="helper-text-row">
            <div className="helper-item">
               <p>
    {t("generate_vid_helper")}{" "}
    <a href="#">{t("generate_vid_link")}</a>{" "}
    {t("from_dashboard")}
  </p>
            </div>
            <div className="helper-item">
              <p>{t("lock_helper_text")}</p>
            </div>
            <div className="helper-item">
              <p>{t("unlock_helper_text")}</p>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="form-footer">
            <button className="btn-back" onClick={() => navigate(-1)}>  {t("back")}</button>
            <button className="btn-next" onClick={() => navigate("/lock-unlock-next-step")}>  {t("next")}</button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LockUnlockAadhaar;
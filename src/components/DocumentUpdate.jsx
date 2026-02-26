import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/DocumentUpdate.css";
import { useNavigate } from "react-router-dom";
import VideoIcon from "../assets/VideoIcon.svg";
import CallIcon from "../assets/CallIcon.svg";
import KnowMoreIcon from "../assets/KnowMoreIcon.svg";
import mascot from "../assets/Img/mascot.png";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";


function DocumentUpdate() {
  const navigate = useNavigate();
  const { t } = useTranslation();

useEffect(() => {
  let timeout;

  const idleTime =
    window.APP_CONFIG?.IDLE_TIMEOUT || 60000;

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
    <div className="document-bg">

      <div className="document-card">

        {/* Top Section */}
     <div className="title-section">

  {/* Mascot Image */}
  <img 
    src={mascot} 
    alt="Mascot" 
    className="mascot-image"
  />

 <h2>{t("uploadTitle")}</h2>

</div>


        {/* Accordion Section */}
        <div className="custom-accordion">

          {/* What to submit */}
          <div className="accordion-item-custom">
            <button
              className="accordion-btn"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
            >
              📄  {t("whatToSubmit")}
            </button>

            <div id="collapseOne" className="collapse">
              <div className="accordion-content">
           {t("whatToSubmitContent")}
              </div>
            </div>
          </div>

          {/* How to submit */}
          <div className="accordion-item-custom">
            <button
              className="accordion-btn"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
            >
              📑 {t("howToSubmit")}
            </button>

            <div id="collapseTwo" className="collapse">
              <div className="accordion-content">
           {t("whatToSubmitContent")}
              </div>
            </div>
          </div>

        </div>

        {/* Submit Button */}
        <div className="submit-section">
          <button
            className="gradient-submit-btn"
            onClick={() => navigate("/login-page")}
          >
            {t("clickToSubmit")}
          </button>

          <div className="need-help-link">  {t("needHelp")}</div>
        </div>

        {/* Help Cards */}
     {/* ===== Help Section ===== */}
<div className="help-section">

  {/* Video Guide */}
  <a
    href="https://www.youtube.com/watch?v=vUdhvl_vC6A"
    target="_blank"
    rel="noopener noreferrer"
    className="help-link"
  >
    <div className="help-card">
      <img src={VideoIcon} alt="Video guide" />
  <p>{t("videoGuide")}</p>
    </div>
  </a>

  {/* Know More */}
  <a
    href="/pdfs/Commonly_Asked_Questions.pdf"
    target="_blank"
    rel="noopener noreferrer"
    className="help-link"
  >
    <div className="help-card">
      <img src={KnowMoreIcon} alt="Know More" />
   <p>{t("knowMore")}</p>
    </div>
  </a>

  {/* Call 1947 */}
  <a
    href="tel:1947"
    className="help-link"
  >
    <div className="help-card">
      <img src={CallIcon} alt="Call toll-free" />
    <p>{t("callTollFree")}</p>
    </div>
  </a>

  

</div>
<div className="bottom-back-wrapper">
  <button
    className="bottom-back-btn"
    onClick={() => navigate(-1)}
  >
     ← {t("back")}
  </button>
</div>


      </div>
    </div>
  );
}

export default DocumentUpdate;

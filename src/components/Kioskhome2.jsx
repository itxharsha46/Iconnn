import React, { useEffect } from "react";
import "../style/Kioskhome2.css";
import Mascot from "../assets/mascotGif.gif";
import Download from "../assets/Img/download.png";
import Retrieve from "../assets/Img/retrive.png";
import Verify from "../assets/Img/Verify.png";
import ReportDeath from "../assets/Img/reportDeath.png";
import Document from "../assets/Img/document.png";
import Virtual from "../assets/Img/virtualid.png";
import Lockunlock from "../assets/Img/lockunlock.png";
import BankSeed from "../assets/Img/bankseed.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Kioskhome2 = () => {

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();


const changeLanguage = (lang) => {
  i18n.changeLanguage(lang);
  localStorage.setItem("lang", lang);
};
useEffect(() => {
  let timeout;

  const idleTime = 60000; // 60 seconds

  const resetTimer = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      navigate("/"); // Redirect to Initial Page
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

  events.forEach((event) =>
    window.addEventListener(event, resetTimer)
  );

  resetTimer(); // Start timer immediately

  return () => {
    clearTimeout(timeout);
    events.forEach((event) =>
      window.removeEventListener(event, resetTimer)
    );
  };
}, [navigate]);

  const services = [
    { key: "download_aadhaar", color: "red", icon: Download, path: "/e-aadhaar-download" },
    { key: "retrieve_aadhaar", color: "orange", icon: Retrieve, path: "/retrieve-aadhaar" },
    { key: "verify_email_mobile", color: "yellow", icon: Verify, path: "/verify-mobile-email" },
    { key: "vid_generator", color: "orange", icon: Virtual, path: "/vid-generator" },
    { key: "lock_unlock", color: "yellow", icon: Lockunlock, path: "/lock-unlock-adhaar" },
    { key: "check_pvc_status", color: "orange", icon: Verify, path: "/Check-pvc-order-status" },
    { key: "check_deceased_status", color: "yellow", icon: Verify, path: "/aadhaar-Deactive-status" },
    { key: "check_validity", color: "green", icon: Verify, path: "/aadhaar-validity" },
    { key: "book_appointment", color: "red", icon: Document, path: "/bank-appointment" },
    { key: "check_enrolment_status", color: "orange", icon: Retrieve, path: "/Check_enrolment_update_status" },
    { key: "token_generation", color: "red", icon: Document, path: "/token-generation" },
    { key: "report_death", color: "green", icon: ReportDeath, path: "/login-page" },
    { key: "document_update", color: "red", icon: Document, path: "/document-update" },
    { key: "bank_seeding", color: "green", icon: BankSeed, path: "/login-page" },
    { key: "grievance_feedback", color: "red", icon: Verify, path: "/grievance-feedback" },
    { key: "grievance_status", color: "green", icon: Verify, path: "/grievance-feedback-status" }
  ];

  return (
    <div className="kiosk-container">

      <div className="header-row">
        <h1 className="kiosk-title">{t("welcome_title")}</h1>

        <div className="language-buttons">
  <button
    className={`lang-btn ${i18n.language === "en" ? "active" : ""}`}
    onClick={() => changeLanguage("en")}
  >
    {t("english")}
  </button>

  <button
    className={`lang-btn ${i18n.language === "hi" ? "active" : ""}`}
    onClick={() => changeLanguage("hi")}
  >
    {t("hindi")}
  </button>

  <button
    className={`lang-btn ${i18n.language === "kn" ? "active" : ""}`}
    onClick={() => changeLanguage("kn")}
  >
    {t("regional")}
  </button>
</div>
      </div>

      <div className="kiosk-banner">
        <img src={Mascot} alt="UIDAI Mascot" className="banner-img" />
      </div>

      <div className="services-grid">
        {services.map((item, index) => (
          <div
            key={index}
            className={`service-card ${item.color}`}
            onClick={() => item.path && navigate(item.path)}
          >
            <img src={item.icon} alt={t(item.key)} className="service-icon" />
            <span className="service-title">{t(item.key)}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Kioskhome2;
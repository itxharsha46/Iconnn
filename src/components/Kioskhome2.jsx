import React, { useEffect, useState } from "react";
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
import FaqIcon from "../assets/faq-icon.svg"; 
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Kioskhome2 = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Modal State
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");

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

    const events = ["mousemove", "mousedown", "click", "scroll", "keypress", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // Start timer immediately

    return () => {
      clearTimeout(timeout);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [navigate]);

  // --- Complete FAQ Data from Your Images & Video ---
  const faqData = [
    {
      category: "Enrolment & Update",
      items: [
        "Aadhaar Enrolment Process",
        "Aadhaar Update",
        "Enrolment Partners/Ecosystem Partners",
        "Enrolling Children",
        "Language & Transliteration",
        "Training, Testing & Certification",
        "Date of Birth Update in Aadhaar",
        "Lost/Forgotten Aadhaar",
        "myAadhaar - Online Update Service",
        "Aadhaar Seva Kendra",
        "Enrolling Differently-abled",
        "Aadhaar Enrolment & Update Charges",
        "Assam NRC Cases",
        "Resident Foreign Nationals",
        "Mandatory Biometric Update (MBU)"
      ]
    },
    {
      category: "Your Aadhaar",
      items: [
        "Use Aadhaar Freely",
        "Aadhaar Letter",
        "mAadhaar FAQs",
        "Aadhaar Features, Eligibility",
        "Security in UIDAI system",
        "Use of Aadhaar",
        "Protection of Individual Information in UIDAI System",
        "NRI & Aadhaar",
        "PAN & Aadhaar",
        "MyAadhaar Portal"
      ]
    },
    {
      category: "Authentication",
      items: [
        "For Aadhaar Number Holders",
        "Offline verification and role of OVSEs under Authentication Eco-system"
      ]
    },
    {
      category: "Direct Benefit Transfer (DBT)",
      items: [
        "Aadhaar for Direct Benefit Transfer (DBT)"
      ]
    },
    {
      category: "CRM Division",
      items: [
        "Grievance Redressal Mechanism",
        "UIDAI Chatbot - Aadhaar Mitra"
      ]
    },
    {
      category: "Aadhaar Online Services",
      items: [
        "E-Aadhaar",
        "Virtual ID (VID)",
        "Online Address Update Process",
        "Aadhaar Authentication History",
        "Secure QR Code Reader (beta)",
        "Aadhaar Paperless Offline e-kyc",
        "Biometric Lock/Unlock",
        "Aadhaar Lock/Unlock",
        "Aadhaar SMS Service",
        "Order Aadhaar PVC Card",
        "Document Update"
      ]
    }
  ];

  // Filter Logic for Search
  const filteredFaqs = faqData.map(section => {
    const isCategoryMatch = section.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchedItems = section.items.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (isCategoryMatch || matchedItems.length > 0) {
      return {
        ...section,
        items: isCategoryMatch ? section.items : matchedItems
      };
    }
    return null;
  }).filter(Boolean);

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
          <button className={`lang-btn ${i18n.language === "en" ? "active" : ""}`} onClick={() => changeLanguage("en")}>{t("english")}</button>
          <button className={`lang-btn ${i18n.language === "hi" ? "active" : ""}`} onClick={() => changeLanguage("hi")}>{t("hindi")}</button>
          <button className={`lang-btn ${i18n.language === "kn" ? "active" : ""}`} onClick={() => changeLanguage("kn")}>{t("regional")}</button>
        </div>
      </div>

      <div className="kiosk-banner">
        <img src={Mascot} alt="UIDAI Mascot" className="banner-img" />
      </div>

      <div className="services-grid">
        {services.map((item, index) => (
          <div key={index} className={`service-card ${item.color}`} onClick={() => item.path && navigate(item.path)}>
            <img src={item.icon} alt={t(item.key)} className="service-icon" />
            <span className="service-title">{t(item.key)}</span>
          </div>
        ))}
      </div>

      {/* --- Floating FAQ Corner Icon --- */}
      <div 
        onClick={() => setIsFaqOpen(true)}
        title="FAQ"
        style={{
          position: "fixed",
          bottom: "40px",      
          right: "40px",       
          backgroundColor: "#ffffff",
          border: "3px solid #2e7d32", 
          borderRadius: "50%", 
          width: "70px",
          height: "70px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
          zIndex: 1000,
          transition: "all 0.3s ease"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = "0px 6px 15px rgba(0,0,0,0.4)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0,0,0,0.3)";
        }}
      >
        <img src={FaqIcon} alt="FAQ" style={{ width: "40px", height: "40px", display: "block" }} />
      </div>

      {/* --- Kiosk Video Style Full Screen FAQ Modal --- */}
      {isFaqOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "#f5f6f8", 
          zIndex: 9999, 
          display: "flex", flexDirection: "column",
          fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        }}>
          
          {/* Top Bar with Title and Close Button */}
          <div style={{ 
            backgroundColor: "#fff", 
            padding: "30px 60px", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
          }}>
            {/* Title font size massive for Kiosk */}
            <h2 style={{ margin: 0, color: "#333", fontSize: "54px", fontWeight: "normal" }}>Frequently Asked Questions</h2>
            <button 
              onClick={() => setIsFaqOpen(false)}
              style={{ fontSize: "64px", background: "none", border: "none", cursor: "pointer", color: "#666", lineHeight: "1", padding: "0 20px" }}
            >
              &times;
            </button>
          </div>

          {/* Search Area */}
          <div style={{ padding: "40px 60px 20px 60px" }}>
            <div style={{ position: "relative", maxWidth: "1200px" }}>
              {/* Search bar font size and padding massive */}
              <input 
                type="text" 
                placeholder="Search for FAQs" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%", 
                  padding: "25px 30px", 
                  fontSize: "32px",
                  borderRadius: "12px", 
                  border: "2px solid #d1d5db",
                  backgroundColor: "#fff",
                  outline: "none",
                  color: "#374151"
                }}
              />
            </div>
          </div>

          {/* Main List Content - Scrollable */}
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 60px 60px 60px" }}>
            {filteredFaqs.map((section, index) => (
              <div key={index} style={{ marginBottom: "45px" }}>
                {/* Category Header font size massive */}
                <h3 style={{ 
                  fontSize: "42px", 
                  color: "#1f2937", 
                  marginBottom: "25px", 
                  marginTop: "20px",
                  fontWeight: "600"
                }}>
                  {section.category}
                </h3>

                {/* List Items Container */}
                <div style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
                  {section.items.map((item, itemIndex) => (
                    <div 
                      key={itemIndex} 
                      onClick={() => alert(`Clicked: ${item}`)} 
                      style={{ 
                        padding: "30px 40px", // Huge touch padding
                        borderBottom: itemIndex === section.items.length - 1 ? "none" : "2px solid #f3f4f6", // Slightly thicker separator
                        fontSize: "34px", // Massive font size for readable kiosk list items
                        color: "#4b5563",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        transition: "background-color 0.1s"
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#fff"}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default Kioskhome2;
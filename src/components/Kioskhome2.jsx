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
  const [searchQuery, setSearchQuery] = useState("");

  // Nested Accordion State
  const [expandedTopic, setExpandedTopic] = useState(null); 
  const [expandedSubQuestion, setExpandedSubQuestion] = useState(null); 

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  useEffect(() => {
    let timeout;
    const idleTime = 60000;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => navigate("/"), idleTime);
    };

    const events = ["mousemove", "mousedown", "click", "scroll", "keypress", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer(); 

    return () => {
      clearTimeout(timeout);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [navigate]);

  // --- FETCH DYNAMIC FAQ DATA FROM JSON FILES ---
  // This replaces the hardcoded array and connects to en.json, hi.json, etc.
  const rawFaqData = t("faqs", { returnObjects: true });
  const faqData = Array.isArray(rawFaqData) ? rawFaqData : [];

  // Deep Search Filter Logic (Updated with safety checks for JSON data)
  const filteredFaqs = faqData.map(section => {
    const isCategoryMatch = (section.category || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchedTopics = (section.topics || []).map(topic => {
      const isTopicMatch = (topic.title || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchedQas = (topic.qas || []).filter(qa => 
        (qa.q || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
        (qa.a || "").toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (isTopicMatch || matchedQas.length > 0) {
        return { ...topic, qas: isTopicMatch ? topic.qas : matchedQas };
      }
      return null;
    }).filter(Boolean);
    
    if (isCategoryMatch || matchedTopics.length > 0) {
      return { ...section, topics: isCategoryMatch ? section.topics : matchedTopics };
    }
    return null;
  }).filter(Boolean);

  // Array map for services grid...
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
      {/* Header and Banner */}
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

      {/* Main Grid */}
      <div className="services-grid">
        {services.map((item, index) => (
          <div key={index} className={`service-card ${item.color}`} onClick={() => item.path && navigate(item.path)}>
            <img src={item.icon} alt={t(item.key)} className="service-icon" />
            <span className="service-title">{t(item.key)}</span>
          </div>
        ))}
      </div>

      {/* Floating FAQ Button */}
      <div 
        onClick={() => setIsFaqOpen(true)}
        title="FAQ"
        style={{
          position: "fixed", bottom: "40px", right: "40px", backgroundColor: "#ffffff",
          border: "3px solid #2e7d32", borderRadius: "50%", width: "70px", height: "70px",
          display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.3)", zIndex: 1000, transition: "all 0.3s ease"
        }}
      >
        <img src={FaqIcon} alt="FAQ" style={{ width: "40px", height: "40px", display: "block" }} />
      </div>

      {/* Full Screen FAQ Modal */}
      {isFaqOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#f5f6f8", 
          zIndex: 9999, display: "flex", flexDirection: "column", fontFamily: "'Segoe UI', Roboto, sans-serif"
        }}>
          
          <div style={{ backgroundColor: "#fff", padding: "30px 60px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
            <h2 style={{ margin: 0, color: "#333", fontSize: "50px", fontWeight: "normal" }}>{t("faq_title") || "Frequently Asked Questions"}</h2>
            <button onClick={() => setIsFaqOpen(false)} style={{ fontSize: "60px", background: "none", border: "none", cursor: "pointer", color: "#666", lineHeight: "1" }}>&times;</button>
          </div>

          <div style={{ padding: "50px 60px 20px 60px" }}>
            <input 
              type="text" placeholder="Search for FAQs" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "90%", padding: "25px 30px", fontSize: "30px", borderRadius: "15px", border: "2px solid #d1d5db", outline: "none" }}
            />
          </div>

          {/* Render Nested Lists */}
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 60px 60px 60px" }}>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((section, categoryIndex) => (
                <div key={categoryIndex} style={{ marginBottom: "50px" }}>
                  <h3 style={{ fontSize: "40px", color: "#1f2937", marginBottom: "25px", fontWeight: "600" }}>{section.category}</h3>

                  <div style={{ backgroundColor: "#fff", borderRadius: "15px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
                    {section.topics.map((topic, topicIndex) => {
                      const topicId = `${categoryIndex}-${topicIndex}`;
                      const isTopicOpen = expandedTopic === topicId;

                      return (
                        <div key={topicIndex} style={{ borderBottom: topicIndex === section.topics.length - 1 ? "none" : "1px solid #f3f4f6" }}>
                          
                          {/* 1. TOPIC HEADER ("Use Aadhaar Freely", etc.) */}
                          <div 
                            onClick={() => setExpandedTopic(isTopicOpen ? null : topicId)} 
                            style={{ 
                              padding: "30px 35px", fontSize: "34px", color: isTopicOpen ? "#1e3a8a" : "#4b5563",
                              backgroundColor: isTopicOpen ? "#f0f4f8" : "#fff", cursor: "pointer",
                              display: "flex", justifyContent: "space-between", alignItems: "center",
                              fontWeight: isTopicOpen ? "600" : "normal"
                            }}
                          >
                            <span>{topic.title}</span>
                            <span style={{ fontSize: "40px" }}>{isTopicOpen ? "▼" : "▶"}</span>
                          </div>

                          {/* 2. INNER QUESTIONS LIST (Visible only if Topic is open) */}
                          {isTopicOpen && (
                            <div style={{ backgroundColor: "#f9fafb", padding: "10px 0" }}>
                              {topic.qas.map((qa, qaIndex) => {
                                const qaId = `${topicId}-${qaIndex}`;
                                const isSubOpen = expandedSubQuestion === qaId;

                                return (
                                  <div key={qaIndex} style={{ padding: "0 35px", marginBottom: "10px" }}>
                                    
                                    {/* INNER QUESTION BAR */}
                                    <div 
                                      onClick={(e) => { e.stopPropagation(); setExpandedSubQuestion(isSubOpen ? null : qaId); }}
                                      style={{
                                        padding: "20px 25px", backgroundColor: "#fff", border: "1px solid #e5e7eb",
                                        borderRadius: "10px", cursor: "pointer", display: "flex", justifyContent: "space-between",
                                        alignItems: "center", fontSize: "28px", color: "#374151", boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                                      }}
                                    >
                                      <span style={{ width: "90%" }}>{qa.q}</span>
                                      <span style={{ fontSize: "35px", color: "#2e7d32" }}>{isSubOpen ? "−" : "+"}</span>
                                    </div>

                                    {/* INNER ANSWER */}
                                    {isSubOpen && (
                                      <div style={{ padding: "20px 25px", fontSize: "26px", color: "#4b5563", lineHeight: "1.6", borderLeft: "4px solid #2e7d32", marginLeft: "20px", marginTop: "10px", whiteSpace: "pre-wrap" }}>
                                      {qa.a}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: "30px", color: "#6b7280", textAlign: "center", marginTop: "50px" }}>No FAQs found.</p>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default Kioskhome2;
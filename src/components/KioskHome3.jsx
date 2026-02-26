import React from "react";
import "../style/KioskHome3.css";
import mascot from "../assets/Img/mascot.png";
import AadhaarLogo from "../assets/aadhar.svg";

const services = [
  { title: "Download Aadhaar", sub: "आधार डाउनलोड करें", color: "blue", icon: "⬇️" },
  { title: "Update Aadhaar", sub: "आधार अपडेट करें", color: "blue2", icon: "📱" },
  { title: "Update Mobile Number", sub: "मोबाइल नंबर बदलें", color: "green", icon: "📞" },
  { title: "Check Aadhaar Status", sub: "आधार स्थिति देखें", color: "yellow", icon: "🔍" },
  { title: "Lock / Unlock Aadhaar", sub: "आधार लॉक / अनलॉक", color: "orange", icon: "🔒" },
  { title: "Book Appointment", sub: "अपॉइंटमेंट बुक करें", color: "red", icon: "📅" },
  { title: "More Services", sub: "अन्य सेवाएं", color: "purple", icon: "⬜" }
];

export default function KioskHome3() {
  return (
    <div className="kiosk-root">
      {/* Header */}
      <div className="kiosk-header">
     

        <div className="language-switch">
          <span className="active">हिंदी</span>
          <span>ENG</span>
          <span>ગુજરાતી</span>
        </div>
      </div>
{/* Aadhaar Logo */}
<div className="aadhaar-logo">
  <img src={AadhaarLogo} alt="Aadhaar Logo" />
</div>

      {/* Title */}
      <h1 className="main-title">AADHAAR SERVICES KIOSK</h1>
      <h2 className="sub-title">आधार सेवा केंद्र</h2>

      <p className="instruction">
        👇 Touch a service below <br />
        सेवा चुनें
      </p>

      {/* Content */}
      <div className="content">
        <div className="mascot">
          <img src={mascot} alt="Mascot" />
        </div>

        <div className="services-grid">
          {services.map((s, i) => (
            <div key={i} className={`service-card ${s.color}`}>
              <div className="icon">{s.icon}</div>
              <div className="text">
                <div className="title">{s.title}</div>
                <div className="sub">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

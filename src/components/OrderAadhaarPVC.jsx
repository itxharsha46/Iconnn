import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/OrderAadhaarPVC.css";
import { useEffect } from "react";

function OrderAadhaarPVC() {
  const navigate = useNavigate();
  const [orderFor, setOrderFor] = useState("others");
  const [idType, setIdType] = useState("aadhaar");
  const [showFAQ, setShowFAQ] = useState(false);

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


  const faqs = [
    {
      question: "What are the different forms of Aadhaar and what are their features?",
      answer: "Aadhaar is available in multiple forms: e-Aadhaar, m-Aadhaar, Aadhaar PVC Card, and Aadhaar letter. All forms are equally valid."
    },
    {
      question: 'What is "Order Aadhaar PVC Card" service?',
      answer: "This service allows you to order a durable PVC card version of your Aadhaar with security features."
    }
  ];

  return (
    <div className="page-wrapper">
      <button className="kiosk-back-btn" onClick={() => navigate(-1)}>
        ←
      </button>

      <div className="central-card">
        <div className="card-header-red">
          <span>Order Aadhaar PVC Card</span>
        </div>

        <div className="split-layout">
          <div className="form-side">
            
            <div className="selection-group">
              {/* Container now pushes the button to the absolute right */}
              <div className="instruction-with-faq">
                <p className="instruction-text">Order PVC card for</p>
                <button className="faq-inline-btn" onClick={() => setShowFAQ(!showFAQ)}>?</button>
              </div>
              <div className="radio-selection-group">
                <label className="radio-container">
                  <input type="radio" name="orderFor" checked={orderFor === "self"} onChange={() => setOrderFor("self")} />
                  <span className="radio-label">Self</span>
                </label>
                <label className="radio-container">
                  <input type="radio" name="orderFor" checked={orderFor === "others"} onChange={() => setOrderFor("others")} />
                  <span className="radio-label">Others</span>
                </label>
              </div>
            </div>

            <div className="selection-group">
              <p className="instruction-text">Select 12 Digit Aadhaar Number/ 28 digit Enrolment ID/ SID</p>
              <div className="radio-selection-group">
                <label className="radio-container">
                  <input type="radio" name="idType" checked={idType === "aadhaar"} onChange={() => setIdType("aadhaar")} />
                  <span className="radio-label">Aadhaar Number</span>
                </label>
                <label className="radio-container">
                  <input type="radio" name="idType" checked={idType === "enrolment"} onChange={() => setIdType("enrolment")} />
                  <span className="radio-label">Enrolment ID Number</span>
                </label>
                <label className="radio-container">
                  <input type="radio" name="idType" checked={idType === "sid"} onChange={() => setIdType("sid")} />
                  <span className="radio-label">SID</span>
                </label>
              </div>
            </div>

            <div className="form-main">
              <div className="input-row">
                <label className="field-label">Enter Aadhaar Number</label>
                <input type="text" className="standard-input" placeholder="Enter 12 digit Aadhaar Number" />
              </div>

              <div className="input-row">
                <label className="field-label">Enter Captcha</label>
                <div className="captcha-flex">
                  <input type="text" className="standard-input" placeholder="Enter Captcha" />
                  <div className="captcha-box">
                    <span className="captcha-code">0934523</span>
                  </div>
                </div>
              </div>

              <button className="primary-blue-btn">Send OTP</button>

              <div className="disclaimer-section">
                <h6>Disclaimer:</h6>
                <ul>
                  <li>The requested Aadhaar PVC card will be delivered on the registered address on that PVC Card.</li>
                  <li>Demographic details cannot be disclosed at this stage.</li>
                  <li>The ordered PVC Card will have the latest demographic information available in the Aadhaar database.</li>
                </ul>
              </div>
            </div>
            <img src="/mascot.png" className="mascot-watermark" alt="Mascot" />
          </div>

          {showFAQ && (
            <div className="faq-side">
              <div className="faq-side-header">
                <h5 className="faq-side-title">FAQs</h5>
                <button className="close-faq" onClick={() => setShowFAQ(false)}>×</button>
              </div>
              <div className="faq-list">
                {faqs.map((faq, i) => (
                  <details key={i} className="faq-item-inline">
                    <summary>{faq.question}</summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderAadhaarPVC;
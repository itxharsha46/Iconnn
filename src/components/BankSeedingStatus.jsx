import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function BankSeedingStatus() {
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
  }, []);
  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="aadhaar-card shadow-sm">
        {/* Header */}
        <div className="aadhaar-header text-center">
           {t("bank_seeding_login_title")}
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Aadhaar Number */}
          <div className="mb-4">
            <label className="form-label aadhaar-label">
            {t("enter_aadhaar")}
            </label>
            <input
              type="text"
              className="form-control aadhaar-input"
              placeholder=""
            />
          </div>

          {/* Captcha */}
          <div className="mb-4">
            <label className="form-label aadhaar-label">
 {t("enter_captcha")}
            </label>

            <div className="d-flex align-items-center gap-2">
              <input
                type="text"
                className="form-control aadhaar-input"
              />

              <div className="captcha-box d-flex align-items-center">
                <span className="captcha-text">46ef7</span>
                <button className="icon-btn">🔊</button>
                <button className="icon-btn">↻</button>
              </div>
            </div>
          </div>

          {/* Button */}
          <button className="btn btn-secondary w-100" disabled>
      {t("send_otp")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BankSeedingStatus
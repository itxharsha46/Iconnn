import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/ReportDeathFamily.css";

function ReportDeathFamily() {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="aadhaar-card shadow-sm position-relative">

        {/* Back Button */}
        <button
          className="btn btn-light position-absolute top-0 start-0 m-3"
          onClick={() => navigate(-1)}
        >
          ← {t("back")}
        </button>

        <div className="aadhaar-header text-center">
          {t("reportDeathTitle")}
        </div>

        <div className="p-4">

          {/* Aadhaar Number */}
          <div className="mb-4">
            <label className="form-label aadhaar-label">
              {t("enterAadhaar")}
            </label>
            <input
              type="text"
              className="form-control aadhaar-input"
            />
          </div>

          {/* Captcha */}
          <div className="mb-4">
            <label className="form-label aadhaar-label">
              {t("enterCaptcha")}
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
            {t("loginWithOtp")}
          </button>

        </div>
      </div>
    </div>
  );
}

export default ReportDeathFamily;
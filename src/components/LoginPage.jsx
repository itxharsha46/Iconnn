import React, { useEffect, useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/LoginCard.css";
import AudioIcon from "../assets/AudioIcon.svg";
import RefreshIcon from "../assets/RefreshIcon.svg";
import VirtualKeyboard from "../components/VirtualKeyboard";
import mascot from "../assets/Img/mascot.png";
import { useTranslation } from "react-i18next";

function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
const keyboardRef = useRef(null);
const [keyboardType, setKeyboardType] = useState("full");
  const [aadhaar, setAadhaar] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);

  const dummyOtp = "123456";

  const dummyAadhaars = [
    "123412341234",
    "111122223333",
    "999988887777",
  ];

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

  const generateCaptcha = () =>
    Math.random().toString(36).substring(2, 8);

  const [captchaText, setCaptchaText] = useState(generateCaptcha());

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      activeField &&
      keyboardRef.current &&
      !keyboardRef.current.contains(event.target)
    ) {
      setActiveField(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("touchstart", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    document.removeEventListener("touchstart", handleClickOutside);
  };
}, [activeField]);


  // ---------------- VALIDATION ----------------
  useEffect(() => {
    const cleanedAadhaar = aadhaar.replace(/\s/g, "");
    const is12Digit = /^\d{12}$/.test(cleanedAadhaar);
    const isDummyAadhaar = dummyAadhaars.includes(cleanedAadhaar);
    const isValidCaptcha =
      captcha.toLowerCase() === captchaText.toLowerCase();

    setIsEnabled(is12Digit && isDummyAadhaar && isValidCaptcha);
  }, [aadhaar, captcha, captchaText]);

  // ---------------- FORMAT AADHAAR ----------------
  const formatAadhaar = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 12);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  // ---------------- VIRTUAL KEYBOARD ----------------
  const handleKeyPress = (key) => {
    if (activeField === "aadhaar") {
      const raw = aadhaar.replace(/\s/g, "");
      if (raw.length < 12) {
        const updated = raw + key.replace(/\D/g, "");
        setAadhaar(formatAadhaar(updated));
      }
    }

    if (activeField === "captcha" && !otpSent) {
      setCaptcha((prev) => prev + key);
    }

    if (activeField === "otp" && otp.length < 6) {
      setOtp((prev) => prev + key.replace(/\D/g, ""));
    }
  };

  const handleBackspace = () => {
    if (activeField === "aadhaar") {
      const raw = aadhaar.replace(/\s/g, "").slice(0, -1);
      setAadhaar(formatAadhaar(raw));
    }

    if (activeField === "captcha")
      setCaptcha((prev) => prev.slice(0, -1));

    if (activeField === "otp")
      setOtp((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (activeField === "aadhaar") setAadhaar("");
    if (activeField === "captcha") setCaptcha("");
    if (activeField === "otp") setOtp("");
  };

  // ---------------- CAPTCHA AUDIO ----------------
  const speakCaptcha = () => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      captchaText.split("").join(" ")
    );
    utterance.lang = "en-IN";
    utterance.rate = 0.6;
    window.speechSynthesis.speak(utterance);
  };

  // ---------------- OTP ----------------
  const handleGenerateOtp = () => {
    if (isEnabled) setOtpSent(true);
  };

  const handleFinalLogin = () => {
    if (otp === dummyOtp) {
      navigate("/main-login-body");
    } else {
      alert("Invalid OTP");
    }
  };

  const handleRefreshCaptcha = () => {
    setCaptcha("");
    setCaptchaText(generateCaptcha());
  };

  return (
    <div className="full-screen-center-login">
      <div className="login-wrapper">

        <div className="uidai-header-login text-center">
          <img src={mascot} alt="Mascot" className="login-mascot" />
   <span className="login-title">{t("login")}</span>
        </div>

        {/* Aadhaar */}
        <div className="mb-4">
          <label className="form-label labelTextLogin">
         {t("enterAadhaar")}
          </label>
          <input
            type="text"
            className="simple-input"
            placeholder="XXXX XXXX XXXX"
            value={aadhaar}
            readOnly
         onFocus={() => {
  setActiveField("aadhaar");
  setKeyboardType("full");
}}
          />
        </div>

        {/* Captcha Input */}
        <div className="mb-3">
          <label className="form-label labelTextLogin">
          {t("enterCaptcha")}
          </label>
          <input
            type="text"
            className="simple-input"
            value={captcha}
            readOnly
            disabled={otpSent}
         onFocus={() => {
  setActiveField("captcha");
  setKeyboardType("full");
}}
          />
        </div>

        {/* Captcha Display */}
        <div className="captcha-display-box mb-3">
          <div className="captcha-text-login">{captchaText}</div>

          <button
            className="captcha-btn"
            onClick={speakCaptcha}
            disabled={otpSent}
          >
            <img src={AudioIcon} alt="Audio" />
          </button>

          <button
            className="captcha-btn-login"
            onClick={handleRefreshCaptcha}
            disabled={otpSent}
          >
            <img src={RefreshIcon} alt="Refresh" />
          </button>
        </div>

        {/* GET OTP BUTTON */}
        {!otpSent && (
          <button
            className="uidai-primary-btn btn-login-color"
            disabled={!isEnabled}
            onClick={handleGenerateOtp}
          >
  {t("getOtp")}
          </button>
        )}

        {/* OTP Section */}
        {otpSent && (
          <>
            <div className="otp-info mt-3">
            {t("otpGenerated")}
            </div>

            <input
              type="text"
              className="simple-input mt-2"
              placeholder={t("enterOtp")}
              value={otp}
              readOnly
              onFocus={() => {
  setActiveField("otp");
  setKeyboardType("numeric");  
}}
            />

            <button
              className="uidai-primary-btn mt-3"
              disabled={otp.length !== 6}
              onClick={handleFinalLogin}
            >
             {t("login")}
            </button>
          </>
        )}

        {/* Back */}
        <div className="uidai-back mt-3" onClick={() => navigate(-1)}>
             ← {t("back")}
        </div>
      </div>

      {/* Virtual Keyboard */}
{activeField && (
  <div ref={keyboardRef} className="keyboard-wrapper">
    <VirtualKeyboard
      visible={true}
      onKeyPress={handleKeyPress}
        keyboardType={keyboardType} 
      onBackspace={handleBackspace}
      onClear={handleClear}
      onClose={() => setActiveField(null)}
    />
  </div>
)}


    </div>
  );
}

export default LoginPage;

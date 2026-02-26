import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/BankAppointment.css";
import { fetchCaptcha } from "../APIs/captchaAPI";
import AudioIcon from "../assets/AudioIcon.svg";
import RefreshIcon from "../assets/RefreshIcon.svg";
import VirtualKeyboard from "./VirtualKeyboard";
import { useTranslation } from "react-i18next";



const BankAppointment = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
const [loading, setLoading] = useState(false);
const [keyboardType, setKeyboardType] = useState("full");
  const [mode, setMode] = useState("mobile");

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const keyboardRef = React.useRef(null);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);


  const [captchaData, setCaptchaData] = useState({
    img: "",
    audio: "",
    trxId: ""
  });


  const [captchaInput, setCaptchaInput] = useState("");

  const [errors, setErrors] = useState({});
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showKeyboard &&
        keyboardRef.current &&
        !keyboardRef.current.contains(event.target)
      ) {
        setShowKeyboard(false);
        setFocusedInput(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showKeyboard]);

  // =============================
  // Idle Timeout
  // =============================
  useEffect(() => {
    let timeout;
    const idleTime = window.APP_CONFIG?.IDLE_TIMEOUT || 60000;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        navigate("/kiosk-home2");
      }, idleTime);
    };

    ["mousemove", "mousedown", "click", "scroll", "keypress", "touchstart"]
      .forEach(event => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timeout);
      ["mousemove", "mousedown", "click", "scroll", "keypress", "touchstart"]
        .forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [navigate]);

const loadCaptcha = async () => {
  setLoading(true);

  const result = await fetchCaptcha();

  if (result.success) {
    setCaptchaData({
      img: `data:image/jpeg;base64,${result.base64}`,
      audio: result.audioBase64
        ? `data:audio/wav;base64,${result.audioBase64}`
        : "",
      trxId: result.transactionId
    });
  } else {
    setCaptchaData({ img: "", audio: "", trxId: "" });
  }

  setCaptchaInput("");
  setLoading(false);
};



  useEffect(() => {
    loadCaptcha();
  }, []);

  const playAudio = () => {
    if (!captchaData.audio) return;

    const audio = new Audio(captchaData.audio);
    audio.play().catch(err => console.error("Audio error:", err));
  };


  // =============================
  // OTP Timer
  // =============================
  useEffect(() => {
    let interval;

    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      setResendEnabled(true);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // =============================
  // Send OTP
  // =============================
const handleSendOtp = async () => {
  let newErrors = {};

  if (!name.trim()) newErrors.name = t("appointment.nameRequired");

 if (!contact.trim()) {
  newErrors.contact =
   mode === "mobile"
      ? t("mobile_required_appointment")
      : t("email_required_appointment");
} else if (mode === "email") {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(contact)) {
     newErrors.contact = t("invalid_email_format");
  }
}


  

  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

  try {
    setLoading(true);

    // 🔥 CALL YOUR SEND OTP API HERE
    await sendOtpAPI({
      name,
      contact,
      mode,
      captchaValue: captchaInput,
      captchaTxnId: captchaData.trxId
    });

    setOtpSent(true);
    setTimer(60);
    setResendEnabled(false);

  } catch (error) {
    if (error.response?.data?.errorCode === "INVALID_CAPTCHA") {
   setErrors({ captcha: t("invalid_captcha") });
    loadCaptcha(); 
  } else if (error.response?.data?.message) {
    setErrors({ contact: error.response.data.message });
  } else {
setErrors({ contact: t("something_wrong") });
  }
  } finally {
    setLoading(false);
  }
};

  const handleKeyPress = (key) => {
    switch (focusedInput) {

      case "name":
        if (name.length < 60)
          setName(name + key);
        break;

      case "contact":
        if (mode === "mobile") {
          if (contact.length < 10)
            setContact(contact + key.replace(/\D/g, ""));
        } else {
          setContact(contact + key);
        }
        break;

      case "captcha":
        setCaptchaInput(captchaInput + key);
        break;

      case "otp":
        if (otp.length < 6)
          setOtp(otp + key.replace(/\D/g, ""));
        break;

      default:
        break;
    }
  };

  const handleBackspace = () => {
    switch (focusedInput) {
      case "name":
        setName(name.slice(0, -1));
        break;
      case "contact":
        setContact(contact.slice(0, -1));
        break;
      case "captcha":
        setCaptchaInput(captchaInput.slice(0, -1));
        break;
      case "otp":
        setOtp(otp.slice(0, -1));
        break;
      default:
        break;
    }
  };

  const handleClear = () => {
    switch (focusedInput) {
      case "name":
        setName("");
        break;
      case "contact":
        setContact("");
        break;
      case "captcha":
        setCaptchaInput("");
        break;
      case "otp":
        setOtp("");
        break;
      default:
        break;
    }
  };

  const handleAuthenticate = async () => {
  try {
    setLoading(true);

    await verifyOtpAPI({
      contact,
      otp
    });

    navigate("/welcome-appointment");

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="bank-appointment-page">
      <div className="bank-glass-card">

      <div className="bank-login-title">
  {t("appointment.loginTitle")} <br />
  {t("appointment.otpAuth")}
</div>

        {/* OTP MODE */}
        <div className="bank-otp-icons">
          <div
            className={`bank-otp-icon ${mode === "mobile" ? "active" : ""}`}
            onClick={() => setMode("mobile")}
          >
            📞
          </div>

          <div
            className={`bank-otp-icon ${mode === "email" ? "active" : ""}`}
            onClick={() => setMode("email")}
          >
            ✉
          </div>
        </div>

     <p className="bank-otp-text">
  {mode === "mobile"
    ? t("appointment.mobileOtp")
    : t("appointment.emailOtp")}
</p>

        {/* FORM */}
        <div className="bank-form-section">

          <div className="bank-input-group">
           <label>{t("appointment.name")}</label>
            <input
              type="text"
              value={name}
              maxLength={60}
             onFocus={() => {
  setFocusedInput("name");
  setKeyboardType("full");
  setShowKeyboard(true);
}}
              onChange={e => setName(e.target.value)}
            />

            {errors.name && <span className="error-bank">{errors.name}</span>}
          </div>

          <div className="bank-input-group">
            <label>
              <label>
  {mode === "mobile"
    ? t("appointment.mobileNumber")
    : t("appointment.email")}
</label>
            </label>
         <input
  type={mode === "mobile" ? "tel" : "email"}
  maxLength={mode === "mobile" ? 10 : 99}
  value={contact}
 onFocus={() => {
  setFocusedInput("contact");
  setKeyboardType(mode === "mobile" ? "numeric" : "full");
  setShowKeyboard(true);
}}
  onChange={e => {
    setContact(e.target.value);
    setErrors(prev => ({ ...prev, contact: "" }));
  }}
/>


            {errors.contact && <span className="error-bank">{errors.contact}</span>}
          </div>

          {/* CAPTCHA */}
          <div className="bank-input-group">
   <label>{t("appointment.enterCaptcha")}</label>

            <div className="bank-captcha-wrapper">

              <div className="bank-captcha-display">

                <div className="bank-captcha-image-box">
                  {captchaData.img ? (
                    <img src={captchaData.img} alt="captcha" />
                  ) : (
                    <span>Loading...</span>
                  )}
                </div>

                <button
                  type="button"
                  className="bank-captcha-btn"
                  onClick={playAudio}
                  disabled={!captchaData.audio}
                >
                  <img src={AudioIcon} alt="Audio captcha" />
                </button>

                <button
                  type="button"
                  className="bank-captcha-btn"
                  onClick={loadCaptcha}
                >
                  <img src={RefreshIcon} alt="Refresh captcha" />
                </button>

              </div>
            </div>

            <input
              type="text"
              value={captchaInput}
              onFocus={() => {
                setFocusedInput("captcha");
                  setKeyboardType("full");
                setShowKeyboard(true);
              }}
              onChange={e => setCaptchaInput(e.target.value)}
            />

            {errors.captcha && (
              <span className="error-bank">{errors.captcha}</span>
            )}
          </div>
        </div>
        <div className="bank-button-section">

          {!otpSent && (
            <button className="bank-send-otp-btn" onClick={handleSendOtp}>
           {t("appointment.sendOtp")}
            </button>
          )}

          {otpSent && (
            <>
              <button
                className="bank-resend-btn"
                disabled={!resendEnabled}
                onClick={handleSendOtp}
              >
               {resendEnabled
  ? t("appointment.resendOtp")
  : `${t("appointment.resendIn")} ${timer} ${t("appointment.seconds")}`}
              </button>

              <div className="bank-input-group">
             <label>{t("appointment.enterOtp")}</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onFocus={() => {
                    setFocusedInput("otp");
                      setKeyboardType("numeric"); 
                    setShowKeyboard(true);
                  }}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <div className="bank-otp-counter">
                  {otp.length}/6
                </div>
              </div>

          <button
  className="bank-auth-btn"
  onClick={handleAuthenticate}
>
{t("appointment.authenticate")}
</button>


            </>
          )}

          <button
            className="bank-back-btn"
            onClick={() => navigate(-1)}
          >
            ← {t("common.back")}
          </button>

        </div>


      </div>
      {showKeyboard && (
        <div ref={keyboardRef}>
          <VirtualKeyboard
            visible={showKeyboard}
              keyboardType={keyboardType}
            onKeyPress={handleKeyPress}
            onBackspace={handleBackspace}
            onClear={handleClear}
            onClose={() => {
              setShowKeyboard(false);
              setFocusedInput(null);
            }}
          />
        </div>
      )}
      {loading && (
  <div className="bank-loader-overlay">
    <div className="bank-loader"></div>
  </div>
)}


    </div>
  );
};

export default BankAppointment;

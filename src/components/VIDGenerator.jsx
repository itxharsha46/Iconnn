import React, { useState, useEffect } from "react";
import FAQComponent from "./FAQComponent";
import VirtualKeyboard from "./VirtualKeyboard";
import { useNavigate } from "react-router-dom";
import AudioIcon from "../assets/AudioIcon.svg";
import RefreshIcon from "../assets/RefreshIcon.svg";
import "../style/VIDGenerator.css"
import { fetchCaptcha } from "../APIs/captchaAPI";
import { verifyUid } from "../APIs/verifyUidAPI";
import { retrieveVIDNumber } from "../APIs/retrieveorgeneratevid";
import Popup from './Popup';
import { useTranslation } from "react-i18next";
function VIDGenerator() {
  const navigate = useNavigate();
const { t } = useTranslation();
  /* ---------------- State ---------------- */
  const [aadhaar, setAadhaar] = useState("");
  // const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");


  // const [generatedCaptcha, setGeneratedCaptcha] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [aadhaarError, setAadhaarError] = useState("");
  const [captchaError, setCaptchaError] = useState("");
const [keyboardType, setKeyboardType] = useState("full");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otptxnId, setotptxnId] = useState("");
  const [otpError, setOtpError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [aadhaarType, setAadhaarType] = useState("aadhaar");
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [captchaData, setCaptchaData] = useState({
  img: "",
  audio: ""
});
useEffect(() => {
  const hideKeyboard = (e) => {
    if (
      !e.target.closest(".simple-input") &&
      !e.target.closest(".vk-chromeos")
    ) {
      setShowKeyboard(false);
      setFocusedInput(null);
    }
  };

  document.addEventListener("mousedown", hideKeyboard);
  return () => document.removeEventListener("mousedown", hideKeyboard);
}, []);


  // const DUMMY_OTP = "123456";
  // const DUMMY_AADHAAR = "999988887777";

  /* ---------------- Captcha ---------------- */
  

const loadNewCaptcha = async () => {
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
    setCaptchaData({
      img: "",
      audio: "",
      trxId: ""
    });
  }

  setCaptchaInput("");   // ✅ clear input on refresh
  setCaptchaError("");   // ✅ clear error
};

useEffect(() => {
  loadNewCaptcha();
}, []);
  const playAudio = () => {
  if (!captchaData.audio || captchaData.audio.includes('undefined')) {
    console.error("Audio data is missing or undefined");
    return;
  }

  try {
    const audio = new Audio(captchaData.audio);
    
   
    audio.addEventListener('error', (e) => {
      console.error("Audio Error Object:", audio.error);
    });

    audio.play().catch(error => {
      console.error("Playback failed:", error.name, error.message);
 
    });
  } catch (err) {
    console.error("Audio initialization failed:", err);
  }
};



  /* ---------------- Validation ---------------- */
const isAadhaarValid = /^\d{12}$/.test(aadhaar);

  // const isCaptchaValid = captcha === generatedCaptcha;
  const isOtpValid = /^\d{6}$/.test(otp);

  /* ---------------- OTP ---------------- */
const handleSendOtp = async () => {
  let hasError = false;

  // Aadhaar validation
  if (!isAadhaarValid) {
    setAadhaarError(t("aadhaar_invalid_12"));
    hasError = true;
  } else {
    setAadhaarError("");
  }

  // Captcha validation
  if (!captchaInput) {
 setCaptchaError(t("captcha_required"));
    hasError = true;
  } else if (!captchaData.trxId) {
  setCaptchaError(t("captcha_expired"));
    hasError = true;
  } else {
    setCaptchaError("");
  }

  // Stop if any error
  if (hasError) return;
  const res = await verifyUid({
    uid: aadhaar,
    captcha: captchaInput,
    captchaTxnId: captchaData.trxId
  });

  if (res.success) {
    //alert("handleVerifyUid verifyUid => " +res.data.status)
    if (res.data.status === "Failure") {
      setPopupMessage(res.data.message);
      setShowPopup(true);
      return;
    }else{
      // If everything valid
      setotptxnId(res.data.txnId);
      setOtpSent(true);
    }
  }
  
};


  const handleVerifyOtp = async () => {
   if (!/^\d{6}$/.test(otp)) {
    setOtpError(t("otp_invalid_6"));
      return;
    }
    setOtpError("");
    const isVIDGenerate =  aadhaarType === "aadhaar" ? 1 :0;
    const res = await retrieveVIDNumber({
    uid: aadhaar,
    otp: otp,
    otptxnId: otptxnId,
    isGenerateNewVidNumber : isVIDGenerate
  });

  if (res.success) {
    //alert("handleVerifyUid verifyUid => " +res.data.status)
    if (res.data.status === "Failure") {
      setPopupMessage(res.data.errorDetails.messageEnglish);
      setShowPopup(true);
      return;
    }else{
      // If everything valid
      navigate("/vid-success", {
          state: {
            vidNumber: res.data.data.vidNumber
          }
        }
      );
    }
  }
    
  };

  /* ---------------- Virtual Keyboard ---------------- */
 const handleKeyPress = (key) => {
  if (!focusedInput) return;

  switch (focusedInput) {
    case "aadhaar":
      if (aadhaar.length < 12)
        setAadhaar((prev) => prev + key);
      break;

   case "captcha":
  setCaptchaInput((prev) => prev + key);
  break;


    case "otp":
      if (otp.length < 6)
        setOtp((prev) => prev + key);
      break;

    default:
      break;
  }
};


  const handleBackspace = () => {
    if (focusedInput === "aadhaar") setAadhaar((p) => p.slice(0, -1));
  if (focusedInput === "captcha") setCaptchaInput((p) => p.slice(0, -1));

    if (focusedInput === "otp") setOtp((p) => p.slice(0, -1));
  };

  const handleClear = () => {
    if (focusedInput === "aadhaar") setAadhaar("");
if (focusedInput === "captcha") setCaptchaInput("");

    if (focusedInput === "otp") setOtp("");
  };

  /* ---------------- FAQ ---------------- */
  const faqs = [
    {
      question: "What are the different forms of Aadhaar?",
      answer:
        "Aadhaar is available as e-Aadhaar, m-Aadhaar, PVC Card, and Aadhaar letter."
    },
    {
      question: "Can I use any form of Aadhaar?",
      answer: "Yes, all forms are equally valid."
    }
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


  return (
    <div className="full-screen-center-retrive">
      {showPopup && (
              <Popup
                message={popupMessage}
                onClose={() => setShowPopup(false)}
              />
            )}
        <div className="aadhaar-wrapper">
        {/* Header */}
     <div className="uidai-header-retreive position-relative">
          <div className="uidai-header-left d-flex align-items-center">  
            <span className="ms-3">{t("generate_retrieve_vid")}</span>       </div>
            <button
            className="kiosk-back-circle-retrive header-back-btn"
              onClick={() => navigate("/kiosk-home2")}
            >
              ⬅
            </button>
       
    
        </div>

        {/* Select Type */}
         <div className="row justify-content-center eaadhaar-page">
               <div className="col-12">
              <div className="card shadow-sm p-4 position-relative">
        <div className="d-flex justify-content-between align-items-center mb-3">
       <h5 className="selectAadhar mb-0">{t("please_select")}</h5>
          <button
            className="help-btn-retrive"
            onClick={() => setShowFaqModal(true)}
          >
            <span className="help-icon-aadhar-vid">?</span>
          </button>
        </div>

        <div className="mb-3">
           <label className="me-3 radioBtn">
            <input
              type="radio"
              value="aadhaar"
              checked={aadhaarType === "aadhaar"}
              onChange={(e) => setAadhaarType(e.target.value)}
            />
        <span>{t("generate_vid")}</span>
          </label>

           <label className="me-3 radioBtn">
            <input
              type="radio"
              value="retrieve"
              checked={aadhaarType === "retrieve"}
              onChange={(e) => setAadhaarType(e.target.value)}
            />
          <span>{t("retrieve_vid")}</span>
          </label>
        </div>

        {/* Aadhaar */}
        <div className="mb-4">
          <label className="form-label text-muted labelText">{t("enter_aadhaar")}</label>
          <input
            className="simple-input"
            value={aadhaar}
onFocus={() => {
  setFocusedInput("aadhaar");
  setKeyboardType("full");
  setShowKeyboard(true);
}}

            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setAadhaar(value);

          if (value.length < 12) {
  setAadhaarError(t("aadhaar_must_12"));
} else {
  setAadhaarError("");
}

            }}
          />
          {aadhaarError && (
            <small className="text-danger">{aadhaarError}</small>
          )}
        </div>

      
                      <div className="row align-items-center captcha-row">
      
                        {/* LEFT: Captcha Input (6 columns) */}
                        <div className="col-12 col-md-6 col-lg-6">
                         <div className="mb-3">
                          <label className="form-label text-muted labelText">{t("enter_captcha")}</label>
                            <input
                              type="text"
                              id="captcha"
                              disabled={otpSent}
                              className="simple-input"
                           
value={captchaInput}
onChange={(e) => {
  setCaptchaInput(e.target.value);
  if (captchaError) setCaptchaError("");
}}

onFocus={() => {
  setFocusedInput("captcha");
  setKeyboardType("full");
  setShowKeyboard(true);
}}

      
                              required
                              
                            />
                           
                            {captchaError && <div className="text-danger small">{captchaError}</div>}
      
                          </div>
                        </div>
      
      
                        <div className="col-12 col-md-6 col-lg-6">
                          <div className="captcha-wrapper">
                            <div className="captcha-display" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f4f4f4', padding: '5px', borderRadius: '4px' }}>
      
                              {/* Visual Captcha Image */}
                              <div style={{ background: '#fff', padding: '2px', border: '1px solid #ddd', minWidth: '100px', height: '35px', display: 'flex', justifyContent: 'center' }}>
                                {captchaData.img ? (
                                  <img
                                    src={captchaData.img}
                                    alt="Captcha"
                                    style={{ display: 'block', height: '100%', width: 'auto' }}
                                  />
                                ) : (
                                  <span style={{ fontSize: '10px', color: '#666' }}>{t("loading")}</span>
                                )}
                              </div>
      
                              {/* Real Audio Button */}
                              <button
                                type="button"
                                className="captcha-btn"
                                onClick={playAudio}
                            disabled={!captchaData.audio || otpSent}

                               title={t("play_audio_captcha")}
                              >
                                <img src={AudioIcon} alt="Audio" disabled={otpSent}/>
                              </button>
      
                              {/* Real Refresh Button */}
                              <button
                                type="button"
                                disabled={otpSent}
                                className="captcha-btn"
                             onClick={() => {
  setCaptchaInput("");
  loadNewCaptcha();
}}

                              title={t("refresh_captcha")}
                              >
                                <img src={RefreshIcon} alt="Refresh" disabled={otpSent}/>
                              </button>
                            </div>
                          </div>
                        </div>
      
                      </div>

        {/* Send OTP */}
        <button
          className="btn btn-primary mt-3"
        disabled={otpSent}

          onClick={handleSendOtp}
        >
        {t("send_otp")}
        </button>

        {/* OTP */}
        {otpSent && (
          <>
            <div className="mt-4">
              <label className="form-label">{t("enter_otp")}</label>
              <input
                className="form-control"
                value={otp}
onFocus={() => {
  setFocusedInput("otp");
  setKeyboardType("numeric");   // 🔥 ONLY OTP numeric
  setShowKeyboard(true);
}}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ""))
                }
              />
              {otpError && (
                <small className="text-danger">{otpError}</small>
              )}
            </div>

            <button
              className="btn btn-success mt-3"
              disabled={!isOtpValid}
              onClick={handleVerifyOtp}
            >
             {t("verify_otp")}
            </button>
          </>
        )}
</div>
</div>
</div>
            {showFaqModal && (
          <div className="faq-modal-backdrop">
            <div className="faq-modal">

              <div className="faq-modal-header-vid">
              <h5>{t("faq_title")}</h5>
                <button
                  className="close-btn"
                  onClick={() => setShowFaqModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="faq-modal-body">
                <FAQComponent faqs={faqs} />
              </div>

            </div>
          </div>
        )}

        {/* Virtual Keyboard */}
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
    </div>
  );
}

export default VIDGenerator;

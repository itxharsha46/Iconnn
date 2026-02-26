 import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FAQComponent from "./FAQComponent";
import VirtualKeyboard from "./VirtualKeyboard";
import AudioIcon from "../assets/AudioIcon.svg";
import RefreshIcon from "../assets/RefreshIcon.svg";
import "../style/AadhaarValidity.css";
import "../components/AadhaarValidSuccess";
import { fetchCaptcha } from "../APIs/captchaAPI";
import { validateUIDNumber } from '../APIs/validateaadhaarAPI';
import Popup from "../components/Popup";
import { useTranslation } from "react-i18next";

function AadhaarValidity() {
  const navigate = useNavigate();
const { t } = useTranslation();
  /* ===============================
     STATE
  =============================== */

  const [aadhaar, setAadhaar] = useState("");
  const [aadhaarError, setAadhaarError] = useState("");

  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

 const [captchaData, setCaptchaData] = useState({
  img: "",
  audio: "",
  trxId: ""
});


  const [focusedInput, setFocusedInput] = useState(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);

  /* ===============================
     CLOSE KEYBOARD ON OUTSIDE CLICK
  =============================== */
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

  /* ===============================
     LOAD CAPTCHA FROM API
  =============================== */
  useEffect(() => {
    loadNewCaptcha();
  }, []);

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

  setCaptchaInput("");
};


 const playAudio = () => {
  if (!captchaData.audio) return;

  const audio = new Audio(captchaData.audio);
  audio.play().catch(err =>
    console.error("Audio error:", err)
  );
};


  /* ===============================
     VALIDATION
  =============================== */
  const validateAadhaar = (value) => {
    if (!value) return setAadhaarError("");

    if (!/^\d+$/.test(value))
      return setAadhaarError("Only numbers are allowed");

    if (value.length < 12)
      return setAadhaarError("Aadhaar number must be 12 digits");

    if (/^(\d)\1{11}$/.test(value))
      return setAadhaarError("Invalid Aadhaar number");

    setAadhaarError("");
  };

  const isAadhaarValid =
    aadhaar.length === 12 && aadhaarError === "";

  // const isCaptchaValid =
  //   captchaInput.trim().toLowerCase() ===
  //   captchaData.text?.toLowerCase();

// const canProceed =
//   isAadhaarValid &&
//   captchaInput.trim() !== "" &&
//   captchaData.trxId;

  /* ===============================
     VIRTUAL KEYBOARD
  =============================== */
  const handleKeyPress = (key) => {
    if (focusedInput === "aadhaar") {
      if (/\d/.test(key) && aadhaar.length < 12) {
        const val = aadhaar + key;
        setAadhaar(val);
        validateAadhaar(val);
      }
    }

    if (focusedInput === "captcha") {
      setCaptchaInput(captchaInput + key);
    }
  };

  const handleBackspace = () => {
    if (focusedInput === "aadhaar") {
      const val = aadhaar.slice(0, -1);
      setAadhaar(val);
      validateAadhaar(val);
    }

    if (focusedInput === "captcha") {
      setCaptchaInput(captchaInput.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (focusedInput === "aadhaar") {
      setAadhaar("");
      setAadhaarError("");
    }

    if (focusedInput === "captcha") {
      setCaptchaInput("");
    }
  };

const handleSubmit = async () => {
  let valid = true;

  // Aadhaar validation
  if (!aadhaar) {
   setAadhaarError(t("aadhaar_required"));
    valid = false;
  } else if (!isAadhaarValid) {
  setAadhaarError(t("aadhaar_invalid_12"));
    valid = false;
  }

  // Captcha validation
  if (!captchaInput.trim()) {
  setCaptchaError(t("captcha_required"));
    valid = false;
  }

  if (!captchaData.trxId) {
  setCaptchaError(t("captcha_not_loaded"));
    valid = false;
  }

  if (!valid) return;

  try {
    const payload = {
      aadhaarNumber: aadhaar,
      captchaTxnId: captchaData.trxId,
      captcha: captchaInput
    };

    // Call backend here
    const res = await validateUIDNumber({
      uid: aadhaar,
      captcha: captchaInput,
      captchaTxnId: captchaData.trxId
    });

    if (res.success) {
      console.log(res);
      console.log("handleVerifyUid validateUIDNumber => " + res.data.status)
      if (res.data.status != "Success") {
        setPopupMessage(res.data.errorDetails.messageEnglish);
        setShowPopup(true);
        return;
      }
      else {
        navigate("/aadhaar-valid-success", {
          state: { uidResponse: res.data }
        });
      }
    }

  } catch (error) {
setCaptchaError(t("captcha_verification_failed"));
    loadNewCaptcha();
  }
};


  /* ===============================
     FAQ
  =============================== */
  const faqs = [
    {
      question: "How Aadhaar PVC Card is different from Aadhaar Letter?",
      answer:
        "Aadhaar letter is laminated paper based document issued to the Aadhaar number holders after enrolment or update. Aadhaar PVC Card is PVC based durable and easy to carry card with multiple security features. Aadhaar PVC card is equally valid."
    }
   
  ];

useEffect(() => {
  let timeout;

  const idleTime =
    window.APP_CONFIG?.IDLE_TIMEOUT;

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
    <div className="full-screen-center-validity">
      {showPopup && (
        <Popup
          message={popupMessage}
          onClose={() => setShowPopup(false)}
        />
      )}

     <div className="aadhaar-wrapper">

        {/* HEADER */}
<div className="uidai-header-val position-relative">
  

  <div className="uidai-header-left d-flex align-items-center">

<span className="ms-3">{t("check_aadhaar_validity_title")}</span>
          </div>            <button
              className="kiosk-back-circle-validity header-back-btn"
              onClick={() => navigate("/kiosk-home2")}
            >
              ⬅
            </button>
            
        </div>

        <div className="row justify-content-center eaadhaar-page">
          <div className="col-12">
            <div className="card shadow-sm p-4 position-relative">

              {/* HELP BUTTON */}
              <div className="d-flex justify-content-end mb-3">
                <button
                  className="help-btn"
                  onClick={() => setShowFaqModal(true)}
                >
                  <span className="help-icon-aadhar-validity">?</span>
                </button>
              </div>

              {/* AADHAAR INPUT */}
              <div className="mb-4">
                <label className="form-label text-muted labelText">
                {t("enter_aadhaar")}
                </label>

                <input
                  type="text"
                  className={`simple-input ${aadhaarError ? "is-invalid" : ""}`}
                  maxLength={12}
                  value={aadhaar}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setAadhaar(val);
                    validateAadhaar(val);
                  }}
                  onFocus={() => {
                    setFocusedInput("aadhaar");
                    setShowKeyboard(true);
                  }}
                />

                {aadhaarError && (
                  <div className="text-danger small mt-1">
                    {aadhaarError}
                  </div>
                )}
              </div>

              {/* CAPTCHA ROW */}
              <div className="row align-items-center captcha-row">

                <div className="col-12 col-md-6">
                  <label className="form-label text-muted labelText">
                    {t("enter_captcha")}
                  </label>
                  <input
  type="text"
  className={`simple-input ${captchaError ? "is-invalid" : ""}`}
  value={captchaInput}
  onChange={(e) => {
    setCaptchaInput(e.target.value);
    if (captchaError) setCaptchaError("");
  }}
  onFocus={() => {
    setFocusedInput("captcha");
    setShowKeyboard(true);
  }}
/>

{captchaError && (
  <div className="text-danger small mt-1">
    {captchaError}
  </div>
)}

                </div>

                <div className="col-12 col-md-6">
                  <div className="captcha-display d-flex align-items-center gap-2 bg-light p-2 rounded">

                    <div style={{
                      background: "#fff",
                      padding: "2px",
                      border: "1px solid #ddd",
                      minWidth: "100px",
                      height: "35px",
                      display: "flex",
                      justifyContent: "center"
                    }}>
                      {captchaData.img ? (
                        <img
                          src={captchaData.img}
                          alt="Captcha"
                          style={{ height: "100%" }}
                        />
                      ) : (
                        <span style={{ fontSize: "10px" }}>{t("loading")}</span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="captcha-btn"
                      onClick={playAudio}
                      disabled={!captchaData.audio}
                    >
                      <img src={AudioIcon} alt="Audio" />
                    </button>

                <button
  type="button"
  className="captcha-btn"
  onClick={() => {
    setCaptchaInput("");
    loadNewCaptcha();
  }}
>
  <img src={RefreshIcon} alt="Refresh" />
</button>


                  </div>
                </div>

              </div>

              <button
                className="send-otp-btn mt-4"
                // disabled={!canProceed}
                onClick={handleSubmit}
              >
             {t("proceed")}
              </button>

            </div>
          </div>
        </div>

        {/* FAQ MODAL */}
        {showFaqModal && (
          <div className="faq-modal-backdrop">
            <div className="faq-modal">
              <div className="faq-modal-header-validity">
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

        {/* VIRTUAL KEYBOARD */}
        <VirtualKeyboard
          visible={showKeyboard}
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

export default AadhaarValidity;

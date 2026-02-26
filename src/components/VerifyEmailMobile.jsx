
import FAQComponent from './FAQComponent';
import VirtualKeyboard from './VirtualKeyboard';
import { Link, useNavigate } from "react-router-dom";
import "../style/VerifyEmailMobile.css";
import AudioIcon from "../assets/AudioIcon.svg";
import RefreshIcon from "../assets/RefreshIcon.svg";
import React, { useState, useRef, useEffect } from 'react';
import { fetchCaptcha } from "../APIs/captchaAPI";
import { verifyEmailMobile } from '../APIs/verifyemailmobile';
import Popup from "../components/Popup";
import { useTranslation } from "react-i18next";

function VerifyEmailMobile() {
  const navigate = useNavigate();
const { t } = useTranslation();

  // state
  const [aadhaar, setAadhaar] = useState("");
  const [contact, setContact] = useState("");
  const [captcha, setCaptcha] = useState("");
  // const [captchaText, setCaptchaText] = useState(generateCaptcha());
  const [focusedInput, setFocusedInput] = useState(null);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifyType, setVerifyType] = useState("mobile");
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const keyboardRef = useRef(null);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");
const [aadhaarError, setAadhaarError] = useState("");
const [contactError, setContactError] = useState("");
const [verificationError, setVerificationError] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");






  const [captchaData, setCaptchaData] = useState({
    img: "",
    audio: "",
    trxId: ""
  });

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
  };

  useEffect(() => {
    loadNewCaptcha();
  }, []);

  const playAudio = () => {
    if (!captchaData.audio) return;

    const audio = new Audio(captchaData.audio);
    audio.play().catch(err => console.error("Audio error:", err));
  };



 



  const validateCaptcha = () => {
    if (!captchaInput) {
   setCaptchaError(t("captcha_required"));
      return false;
    }

    if (!captchaData.trxId) {
      setCaptchaError(t("captcha_not_loaded"));
      return false;
    }

    setCaptchaError("");
    return true;
  };

 const canSubmitCaptcha = !!aadhaar && !!contact && !!captchaInput && !!captchaData.trxId;


const handleSubmitCaptcha = async () => {
  setAadhaarError("");
  setContactError("");
  setCaptchaError("");

  let valid = true;

  if (!aadhaar) {
   setAadhaarError(t("aadhaar_required"));
    valid = false;
  }
  if (!contact) {
  setContactError(
  verifyType === "mobile"
    ? t("mobile_required")
    : t("email_required")
);
    valid = false;
  }
  if (!captchaInput) {
  setCaptchaError(t("captcha_required"));
    valid = false;
  }
  if (!valid) return;

  // Call backend API to validate Aadhaar, contact, captcha
  try {
    const _EmailId = verifyType != "mobile" ? contact : null;
    const _MobileNumber = verifyType === "mobile" ? contact : null;
    
    const response = await verifyEmailMobile({
              aadhaar: aadhaar,
              captchaInput: captchaInput,
              captchaTrxId: captchaData.trxId,
              emailId: _EmailId,
              mobileNumber: _MobileNumber,
              verificationCode: null
            });
    // const response = await fetch("/api/verify-contact", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     aadhaar,
    //     contact,
    //     type: verifyType,
    //     captcha: captchaInput,
    //     captchaTrxId: captchaData.trxId
    //   })
    // });
    if(response.data.status != "Success"){
      setPopupMessage(response.data.errorDetails.messageEnglish);
      setShowPopup(true);
      return;
    }else if(response.data.status == "Success" && response.data.responseData &&
      !response.data.responseData.otpSentSuccessfully
    ){
      setPopupMessage(response.data.responseData.message);
      setShowPopup(true);
      return;
    }else if (response.data.status == "Success" && response.data.responseData &&
      response.data.responseData.otpSentSuccessfully) {
      setShowVerificationInput(true);
      setFocusedInput("verification");
    } else {
      // Show errors returned from backend
      // if (result.errors?.aadhaar) setAadhaarError(result.errors.aadhaar);
      // if (result.errors?.contact) setContactError(result.errors.contact);
      // if (result.errors?.captcha) setCaptchaError(result.errors.captcha);
    }
  } catch (err) {
    console.error(err);
   setPopupMessage(t("something_wrong"));
    setShowPopup(true);
  }
};



// const handleSubmitCaptcha = () => {
//   let valid = true;

//   // Aadhaar validation
//   if (!aadhaar) {
//     setAadhaarError("Aadhaar is required");
//     valid = false;
//   } else if (aadhaar.length !== 12) {
//     setAadhaarError("Aadhaar must be 12 digits");
//     valid = false;
//   } else if (aadhaar !== dummyValidAadhaar) {
//     setAadhaarError("Invalid Aadhaar number");
//     valid = false;
//   } else {
//     setAadhaarError("");
//   }

//   // Contact validation

// if (!contact) {
//   setContactError(`${verifyType === "mobile" ? "Mobile number" : "Email"} is required`);
//   valid = false;
// } else if (verifyType === "mobile") {
//   if (contact.length !== 10 || !/^\d+$/.test(contact)) {
//     setContactError("Invalid mobile number");
//     valid = false;
//   } else {
//     setContactError("");
//   }
// } else {
//   if (contact.length < 5 || !/\S+@\S+\.\S+/.test(contact)) {
//     setContactError("Invalid email address");
//     valid = false;
//   } else {
//     setContactError("");
//   }
// }


//   // Captcha validation
//   if (!validateCaptcha()) {
//     valid = false;
//   }

//   if (valid) {
//     setShowVerificationInput(true);
//     setFocusedInput("verification");
//   }
// };


 
const handleVerificationSubmit = async () => {
  if (!verificationCode || verificationCode.length !== 6) {
   setVerificationError(t("verification_code_invalid"));
    return;
  }

  try {
    const response = await fetch("/api/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aadhaar, contact, verificationCode })
    });
    const result = await response.json();

    if (result.success) {
      navigate("/verify-success");
    } else {
      setVerificationError(result.message || t("invalid_verification_code"));
      setVerificationCode("");
    }
  } catch (err) {
    console.error(err);
    setVerificationError("Something went wrong. Please try again.");
  }
};


  const faqs = [
    {
      question: "Is there any fee involved for Online updation of Demographics details?",
      answer:
        "Yes, for online update of demographic information you have to pay Rs. 75/- (including GST)."
    }
  ];
  const handleKeyPress = (key) => {
    switch (focusedInput) {
      case "aadhaar":
        if (aadhaar.length < 12)
          setAadhaar(aadhaar + key.replace(/\D/g, ""));
        break;

      case "contact":
        if (verifyType === "mobile") {
          if (contact.length < 10)
            setContact(contact + key.replace(/\D/g, ""));
        } else {
          setContact(contact + key);
        }
        break;

      case "captcha":
        setCaptcha(captcha + key);
        break;

      case "verification":
        if (verificationCode.length < 6)
          setVerificationCode(verificationCode + key.replace(/\D/g, ""));
        break;

      default:
        break;
    }
  };

  const handleBackspace = () => {
    switch (focusedInput) {
      case "aadhaar":
        setAadhaar(aadhaar.slice(0, -1));
        break;
      case "contact":
        setContact(contact.slice(0, -1));
        break;
      case "captcha":
        setCaptcha(captcha.slice(0, -1));
        break;
      case "verification":
        setVerificationCode(verificationCode.slice(0, -1));
        break;
      default:
        break;
    }
  };

  const handleClear = () => {
    switch (focusedInput) {
      case "aadhaar":
        setAadhaar("");
        break;
      case "contact":
        setContact("");
        break;
      case "captcha":
        setCaptcha("");
        break;
      case "verification":
        setVerificationCode("");
        break;
      default:
        break;
    }
  };

// Enable Verify button only if verification code has 6 digits
const isVerificationCodeValid = verificationCode.length === 6;

  return (
    <>
      <div className="full-screen-center-verify">
        {showPopup && (
                <Popup
                  message={popupMessage}
                  onClose={() => setShowPopup(false)}
                />
              )}
    <div className="aadhaar-wrapper">

          {/* TOP HEADER */}
<div className="uidai-header-verifyem position-relative">
   <div className="uidai-header-left d-flex align-items-center">
   <span className="ms-3">{t("verify_email_mobile")}</span>
  </div>
              <button
                className="kiosk-back-circle-verify header-back-btn"
                onClick={() => navigate("/kiosk-home2")}
              >
                ⬅
              </button>
          
            </div>
          

          {/* CARD */}
          <div className="row justify-content-center eaadhaar-page">
            <div className="col-12">
              <div className="card shadow-sm p-4 position-relative">

                {/* CARD HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="selectVerifyemAadhaar mb-0">
                  {t("verify_details_title")}
                  </h5>
                  <button
                    className="help-btn-retrive"
                    onClick={() => setShowFaqModal(true)}
                  >
                    <span className="help-icon-verify">?</span>
                  </button>
                </div>

                {/* RADIO */}
                <div className="mb-4 d-flex gap-4">
                  <label className="radioBtnVerifyem d-flex align-items-center gap-2">
                    <input
                      type="radio"
                      checked={verifyType === "mobile"}
                      onChange={() => setVerifyType("mobile")}
                    />
              <span>{t("verify_mobile")}</span>
                  </label>

                  <label className="radioBtnVerifyem d-flex align-items-center gap-2">
                    <input
                      type="radio"
                      checked={verifyType === "email"}
                      onChange={() => setVerifyType("email")}
                    />
                 <span>{t("verify_email")}</span>
                  </label>
                </div>

                {/* AADHAAR */}
                <div className="mb-4">
                <label className="form-label text-muted labelText">{t("enter_aadhaar")}</label>
  <input
    className="simple-input"
    value={aadhaar}
    maxLength={12}
    onFocus={() => {
      setFocusedInput("aadhaar");
      setShowKeyboard(true);
    }}
    onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
  />
  {aadhaarError && <small className="text-danger">{aadhaarError}</small>}

                </div>


                {/* CONTACT */}
              <div className="mb-4">
  <label className="form-label text-muted labelText">
{verifyType === "mobile"
  ? t("enter_mobile")
  : t("enter_email")}
  </label>
 <input
  className="simple-input"
  value={contact}
  maxLength={verifyType === "mobile" ? 10 : 100} 
  onFocus={() => {
    setFocusedInput("contact");
    setShowKeyboard(true);
  }}
  onChange={(e) => {
    let val = e.target.value;
    if (verifyType === "mobile") {
      // Allow only digits, max 10
      val = val.replace(/\D/g, "").slice(0, 10);
    }
    setContact(val);
  }}
/>

  {contactError && <small className="text-danger">{contactError}</small>}
</div>




                {/* CAPTCHA */}
                {!showVerificationInput && (
                  <>
                    <div className="row align-items-center captcha-row">
                      <div className="col-12 col-md-6 col-lg-6">
                        <div className="mb-3">
                          <label className="form-label text-muted labelText">
                          {t("enter_captcha")}
                          </label>
                          <input
                            type="text"
                            className="simple-input"
                            value={captchaInput}
                            onFocus={() => {
                              setFocusedInput("captcha");
                              setShowKeyboard(true);
                            }}
                            onChange={(e) => {
                              setCaptchaInput(e.target.value);
                              if (captchaError) validateCaptcha();
                            }}
                          />
                          {captchaError && (
                            <small className="text-danger">{captchaError}</small>
                          )}
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-lg-6">
                        <div className="captcha-wrapper">
                          <div
                            className="captcha-display"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              background: "#f4f4f4",
                              padding: "5px",
                              borderRadius: "4px"
                            }}
                          >
                            <div
                              style={{
                                background: "#fff",
                                padding: "2px",
                                border: "1px solid #ddd",
                                minWidth: "100px",
                                height: "35px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                              }}
                            >
                              {captchaData.img ? (
                                <img
                                  src={captchaData.img}
                                  alt="Captcha"
                                  style={{ height: "100%", width: "auto" }}
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
                              <img src={AudioIcon} alt="Audio captcha" />
                            </button>

                            <button
                              type="button"
                              className="captcha-btn"
                              onClick={() => {
                                setCaptchaInput("");
                                loadNewCaptcha();
                              }}
                            >
                              <img src={RefreshIcon} alt="Refresh captcha" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>


                    <button
                      className="btn send-otp-btn mt-4"
                      // disabled={!canSubmitCaptcha}
                      onClick={handleSubmitCaptcha}
                    >
                      {t("submit")}
                    </button>
                  </>
                )}


                {/* VERIFICATION */}
                {showVerificationInput && (
                  <>
                  <div className="form-group retrieve-form-group mt-3">
  <label className="form-label text-muted labelText">
{t("enter_verification_code")}
  </label>
  <input
    className="simple-input"
    value={verificationCode}
    onFocus={() => {
      setFocusedInput("verification");
      setShowKeyboard(true);
      setVerificationError(""); // clear error when focusing
    }}
    onChange={(e) => setVerificationCode(e.target.value)}
  />
  {verificationError && <small className="text-danger">{verificationError}</small>}
</div>


                    <button
                      className="btn send-otp-btn mt-3"
                      // disabled={!isVerificationCodeValid}
                      onClick={handleVerificationSubmit}
                    >
                  {t("verify")}
                    </button>
                  </>
                )}

              </div>
            </div>
          </div>

          {/* FAQ MODAL */}
          {showFaqModal && (
            <div className="faq-modal-backdrop">
              <div className="faq-modal">
                <div className="faq-modal-header-verify">
                <h5>{t("faq_title")}</h5>

                  <button className="close-btn" onClick={() => setShowFaqModal(false)}>✕</button>
                </div>
                <div className="faq-modal-body">
                  <FAQComponent faqs={faqs} />
                </div>
              </div>
            </div>
          )}

        </div>
        {showKeyboard && (
          <div ref={keyboardRef}>
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
        )}

      </div>
    </>
  );
}

export default VerifyEmailMobile;

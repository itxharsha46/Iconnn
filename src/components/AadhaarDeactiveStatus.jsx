import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FAQComponent from "./FAQComponent";
import VirtualKeyboard from "./VirtualKeyboard";
import "../style/AadhaarDeactiveStatus.css";
import { fetchCaptcha } from "../APIs/captchaAPI";
import { getdeceasedaadhaarstatusbysid } from "../APIs/deceasedaadhaarstatusbysid";
import Popup from "../components/Popup";
import AudioIcon from "../assets/AudioIcon.svg";
import RefreshIcon from "../assets/RefreshIcon.svg";
import { useTranslation } from "react-i18next";

function AadhaarDeactiveStatus() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
const { t, i18n } = useTranslation();
  /* ===============================
     STATE
  =============================== */
  const [sid, setSid] = useState("");
  const [sidError, setSidError] = useState("");

  const [captcha, setCaptcha] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  const [captchaData, setCaptchaData] = useState({
    img: "",
    audio: "",
    trxId: ""
  });


  const [focusedInput, setFocusedInput] = useState(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  /* ===============================
     LOAD CAPTCHA
  =============================== */
  useEffect(() => {
    loadNewCaptcha();
  }, []);
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

    return () => {
      document.removeEventListener("mousedown", hideKeyboard);
    };
  }, []);
useEffect(() => {
  const savedLang = localStorage.getItem("lang");
  if (savedLang) {
    i18n.changeLanguage(savedLang);
  }
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

    setCaptcha("");
    setCaptchaError("");
  };


  const playAudio = () => {
    if (!captchaData.audio) return;
    const audio = new Audio(captchaData.audio);
    audio.play();
  };

  /* ===============================
     VALIDATION
  =============================== */
  const validateSid = (value) => {
    if (!value) return setSidError("");

    if (!value.startsWith("S"))
      return setSidError(t("sid_must_start"));

    if (!/^S\d*$/.test(value))
      return setSidError(t("sid_only_digits"));

    if (value.length < 28)
      return setSidError(t("sid_27_digits"));

    if (value.length > 28)
    setSidError(t("sid_length_exceeded"));

    setSidError("");
  };

  const isSidValid = sid.length === 28 && sidError === "";



  /* ===============================
     VIRTUAL KEYBOARD
  =============================== */
  const handleKeyPress = (key) => {
    if (focusedInput === "sid") {
      let val = sid || "S";
      if (/\d/.test(key) && val.length < 28) {
        val += key;
        setSid(val);
        validateSid(val);
      }
    }

    if (focusedInput === "captcha") {
      setCaptcha(captcha + key);
    }
  };

  const handleBackspace = () => {
    if (focusedInput === "sid") {
      const val = sid.slice(0, -1);
      setSid(val);
      validateSid(val);
    }
    if (focusedInput === "captcha") {
      setCaptcha(captcha.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (focusedInput === "sid") {
      setSid("");
      setSidError("");
    }
    if (focusedInput === "captcha") {
      setCaptcha("");
      setCaptchaError("");
    }
  };

  /* ===============================
     FAQ
  =============================== */
  const faqs = [
    {
      question: "Who is the intended user of this service?",
      answer:
        "An Aadhaar Number Holder who wishes to report the death of a family member."
    },
    {
      question: "What is the objective of this service?",
      answer:
        "The facility is extended to receive request for deactivation of such Aadhaar where its holder has passed away."
    },
    {
      question: "Who can report such cases?",
      answer:
        "Child / Ward / Sibling / Legal Guardian / Spouse / Father / Mother of the deceased."
    },
    {
      question: "What documents / information is required to report death of a family member?",
      answer:
        "Death Certificate of the deceased family member,Aadhaar number of the deceased family member."
    },
    {
      question: "What will be outcome of such reporting?",
      answer:
        "After said reporting and successful validation by UIDAI, the Aadhaar of the deceased person would be deactivated."
    },
    {
      question: "How many states are covered under this service?",
      answer:
        "At present, the facility is available for death certificates issued by 24 States/ UTs i.e. Andaman & Nicobar Islands, Andhra Pradesh, Arunachal Pradesh, Assam, Bihar, Chandigarh, Chhattisgarh, Dadra and Nagar Haveli and Daman and Diu, Haryana, Himachal Pradesh, Jammu and Kashmir, Jharkhand, Ladakh, Lakshadweep, Madhya Pradesh, Maharashtra, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura, Uttar Pradesh and Uttarakhand.Efforts are underway to extend the same to remaining States/ UTs."
    },
    {
      question: "What is the timeline for such deactivation?",
      answer:
        "90 days from acceptance of request."
    },
    {
      question: "What action is needed if one is getting a message (at form submission stage) “Entered Aadhaar is already deactivated” or “Entered Aadhaar is already omitted”?",
      answer:
        "As Aadhaar of the deceased person is already deactivated/ cancelled, no action is necessary in this regard."
    },
    {
      question: "What action is needed if one is getting a message (at form submission stage) “Demographic information provided does not match with the information available in the Aadhaar database”?",
      answer:
        "Please ensure that correct Aadhaar number has been entered or that data in the records of death certificate issuing authority is same as that in Aadhaar."
    },
    {
      question: "What action is needed if one is getting a message (at form submission stage) “Demographic information provided does not match with the information available in the database of death certificate issuing authority. Kindly contact death certificate issuing authority”?",
      answer:
        "The entered information was not found to match with the data received from death certificate issuing authority. Please contact death certificate issuing authority for making necessary rectification."
    },
    {
      question: "How will I get the update on my request?",
      answer:
        "You will get confirmation of deactivation or rejection of request via SMS after completion of the activity."
    }
  ];

  const validateForm = () => {
    let valid = true;

    // SID validation
    if (!sid) {
      setSidError(t("sid_required"));
      valid = false;
    } else if (!sid.startsWith("S")) {
      setSidError("SID must start with 'S'");
      valid = false;
    } else if (!/^S\d{27}$/.test(sid)) {
      setSidError("SID must be 'S' followed by 27 digits");
      valid = false;
    } else {
      setSidError("");
    }


    if (!captcha.trim()) {
   setCaptchaError(t("captcha_required"));   
      valid = false;
    } else if (!captchaData.trxId) {
   setCaptchaError(t("captcha_refresh_error"));
      valid = false;
    } else {
      setCaptchaError("");
    }


    return valid;
  };

  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid) return;

    try {
      setLoading(true); // 🔥 START LOADER

      const result = await getdeceasedaadhaarstatusbysid({
              sid : sid,              
              captchaValue: captcha,
              captchaTxnId: captchaData.trxId
            });
            
            if (result.success && result.data.responseData) {
               setPopupMessage(
                result.data?.responseData.msg || "Failed to resend OTP"
              );
              setShowPopup(true);
              
              // await loadNewCaptcha();
              // setCaptchaInput("");
      
            } else {
              setPopupMessage(
                result.data?.errorDetails.messageEnglish || "Failed to resend OTP"
              );
              setShowPopup(true);
            }
      

    } catch (error) {
      console.error("Captcha verification failed:", error);
      setCaptchaError(t("captcha_verification_failed"));
    } finally {
      setLoading(false); // 🔥 STOP LOADER
    }
  };

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
    <div className="full-screen-center-verify">
       {showPopup && (
        <Popup
          message={popupMessage}
          onClose={() => setShowPopup(false)}
        />
      )}
    <div className="aadhaar-wrapper">

        {/* HEADER */}
<div className="uidai-header-verifyem position-relative">
   <div className="uidai-header-left d-flex align-items-center">
                <span className="ms-3">
{t("check_deceased_status_title")}
            </span>
            
          </div>
            <button
        className="kiosk-back-circle-verify header-back-btn"
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
                  <span className="help-icon-aadhar-deactive">?</span>
                </button>
              </div>

              {/* SID INPUT */}
              <div className="mb-4">
                <label className="form-label text-muted labelText">
                 {t("enter_sid_27")}
                </label>

                <input
                  type="text"
                  className={`simple-input ${sidError ? "is-invalid" : ""}`}
                  value={sid}
                  maxLength={28}
                  onChange={(e) => {
                    let v = e.target.value.toUpperCase();
                    if (v.length === 1) v = "S";
                    else v = "S" + v.substring(1).replace(/\D/g, "");
                    setSid(v);
                    validateSid(v);
                  }}
                  onFocus={() => {
                    setFocusedInput("sid");
                    setShowKeyboard(true);
                  }}
                />
                {sidError && (
                  <div className="text-danger small mt-1">{sidError}</div>
                )}
              </div>

              {/* CAPTCHA ROW */}
              <div className="row align-items-center captcha-row">

                {/* LEFT: Captcha Input (6 columns) */}
                <div className="col-12 col-md-6 col-lg-6">
                  <div className="mb-3">
                    <label className="form-label text-muted labelText">{t("enter_captcha")}</label>
                    <input
                      type="text"
                      id="captcha"
                      //  disabled={otpSent}
                      className="simple-input"

                      value={captcha}

                      onChange={(e) => {
                        setCaptcha(e.target.value);

                        // if (captchaError) validateCaptcha();
                      }}
                      onFocus={() => {
                        setFocusedInput("captcha");
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
                          <span style={{ fontSize: '10px', color: '#666' }}>Loading...</span>
                        )}
                      </div>

                      {/* Real Audio Button */}
                      <button
                        type="button"
                        className="captcha-btn"
                        onClick={playAudio}
                        disabled={!captchaData.audio}
                        title="Play Audio Captcha"
                      >
                        <img src={AudioIcon} alt="Audio" disabled={false}
                        />
                      </button>

                      {/* Real Refresh Button */}
                      <button
                        type="button"
                        disabled={false}

                        className="captcha-btn"
                        onClick={() => {
                          setCaptcha("");
                          setCaptchaError("");
                          loadNewCaptcha();
                        }}

                        title="Refresh"
                      >
                        <img src={RefreshIcon} alt="Refresh" disabled={false}
                        />
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              <button
                className="btn submit-btn mt-5"
                onClick={handleSubmit}
                disabled={loading}
              >
               {loading ? t("please_wait") : t("submit")} 
              </button>



            </div>
          </div>
        </div>

        {/* FAQ MODAL */}
        {showFaqModal && (
          <div className="faq-modal-backdrop">
            <div className="faq-modal">
              <div className="faq-modal-header-aadhaar-deactive">
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

      </div>

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
      {loading && (
  <div className="loader-overlay">
    <div className="loader-spinner"></div>
  </div>
)}

    </div>
  );
}

export default AadhaarDeactiveStatus;

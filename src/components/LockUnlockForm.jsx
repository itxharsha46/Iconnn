import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../style/LockUnlockAadhaar.css";
import ArrowDownIcon from "../assets/ArrowDownBlack.svg?react";
import VirtualKeyboard from "./VirtualKeyboard";
import { fetchCaptcha } from "../APIs/captchaAPI";
import AudioIcon from "../assets/AudioIcon.svg";
import RefreshIcon from "../assets/RefreshIcon.svg";
import { verifyUid } from "../APIs/verifyUidAPI";
import { lockUnockAadhaarNumber } from "../APIs/aadhaarlockunlockAPI";
import { useTranslation } from "react-i18next";
import Popup from "./Popup";
function LockUnlockForm() {
  const navigate = useNavigate();
  
const { t } = useTranslation();
  // ------------------ STATES ------------------
  const [actionType, setActionType] = useState("lock");
  const [vid, setVid] = useState("");
  const [fullName, setFullName] = useState("");
  const [pincode, setPincode] = useState("");
  const [keyboardType, setKeyboardType] = useState("full");
  // const [captcha, setCaptcha] = useState("");
  const [captchaCode, setCaptchaCode] = useState("48F399");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otptxnId, setotptxnId] = useState("");
  const [otpError, setOtpError] = useState("");
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  // ---------------- CAPTCHA STATES ----------------
  const [captchaInput, setCaptchaInput] = useState("");
  // const [captcha, setCaptcha] = useState("");
const [captchaError, setCaptchaError] = useState("");
const [loading, setLoading] = useState(false);

const [captchaData, setCaptchaData] = useState({
  img: "",
  audio: "",
  trxId: ""
});


  // Error states
  const [vidError, setVidError] = useState("");
  const [nameError, setNameError] = useState("");
  const [pinError, setPinError] = useState("");
  // const [captchaError, setCaptchaError] = useState("");

  // UI states
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const keyboardRef = useRef(null);

  // ------------------ KEYBOARD HANDLERS ------------------

  const handleKeyPress = (key) => {
    switch (focusedInput) {
      case "vid":
        if (vid.length < 16) {
          setVid(vid + key.replace(/\D/g, ""));
          setVidError("");
        }
        break;

      case "name":
        if (fullName.length < 60) {
          setFullName(fullName + key);
          setNameError("");
        }
        break;


      case "pin":
        if (pincode.length < 6) {
          setPincode(pincode + key.replace(/\D/g, ""));
          setPinError("");
        }
        break;

      case "captcha":
        setCaptchaInput(captchaInput + key);
        setCaptchaError("");
        break;
      case "otp":
        if (otp.length < 6) {
          setOtp(otp + key.replace(/\D/g, ""));
          setOtpError("");
        }
        break;


      default:
        break;
    }
  };

  const handleBackspace = () => {
    switch (focusedInput) {
      case "vid":
        setVid(vid.slice(0, -1));
        break;
      case "name":
        setFullName(fullName.slice(0, -1));
        break;
      case "pin":
        setPincode(pincode.slice(0, -1));
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
      case "vid":
        setVid("");
        break;
      case "name":
        setFullName("");
        break;
      case "pin":
        setPincode("");
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

  // ------------------ OUTSIDE CLICK CLOSE ------------------

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showKeyboard &&
        keyboardRef.current &&
        !keyboardRef.current.contains(event.target)
      ) {
        setShowKeyboard(false);
        setFocusedInput(null);

        // Important: blur active input
        if (document.activeElement) {
          document.activeElement.blur();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showKeyboard]);

  // ------------------ VALIDATION ------------------

  const validateForm = () => {
    let valid = true;

    if (!vid) {
      setVidError(t("vid_required"));
      valid = false;
    } else if (vid.length !== 16) {
      setVidError(t("vid_16_digits"));
      valid = false;
    }

    if (actionType === "lock") {
      if (!fullName) {
        setNameError(t("name_required"));
        valid = false;
      }

      if (!pincode) {
      setPinError(t("pincode_required"));
        valid = false;
      } else if (pincode.length !== 6) {
         setPinError(t("pincode_6_digits"));
        valid = false;
      }
    }

    if (!captchaInput) {
     setCaptchaError(t("captcha_required"));
      valid = false;
    }


    return valid;
  };

const handleSendOtp = async () => {
  if (!validateForm()) return;

  try {
    setLoading(true);
    const res = await verifyUid({
        uid: vid,
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
    // const response = await fetch("/api/uidai/lock-unlock/send-otp", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     vid,
    //     fullName,
    //     pincode,
    //     captchaValue: captchaInput,
    //     captchaTxnId: captchaData.trxId,
    //     actionType
    //   })
    // });

    // const data = await response.json();

    // if (data.success) {
    //   setOtpSent(true);
    // } else {
    //   setCaptchaError(data.message || "Invalid captcha");
    //   loadNewCaptcha();
    // }

  } catch (error) {
    console.error("Send OTP error:", error);
   setCaptchaError(t("server_error"));
  } finally {
    setLoading(false);
  }
};


  const refreshCaptcha = () => {
    setCaptchaCode(
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
  };
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
  audio.play().catch(err => {
    console.error("Audio play failed:", err);
  });
};

useEffect(() => {
  loadNewCaptcha();
}, []);

const handleSubmit = async () => {

  if (otp.length !== 6) {
 setOtpError(t("otp_6_digits"));
    return;
  }

  if (!declarationChecked) {
    return;
  }

  const maskedAadhaar = "********" + vid.slice(-4);
      //   body: JSON.stringify({
    //     vid,
    //     fullName,
    //     pincode,
    //     captchaValue: captchaInput,
    //     captchaTxnId: captchaData.trxId,
    //     actionType
    //   })
    // });
    const _lock = actionType === "lock" ? 1 :0;
  const res = await lockUnockAadhaarNumber({
        vidNumber: vid,
        lockOrUnlock: _lock,
        otp: otp,
        otpTxnId : otptxnId,
        name : fullName,
        pincode : pincode
      });
    
      if (res.success) {
        alert(res.success)
        //alert("handleVerifyUid 
        // alertverifyUid => " +res.data.status)
        if (res.data.status != "Success") {
          setPopupMessage(res.data.errorDetails.messageEnglish);
          setShowPopup(true);
          return;
        }else{
          // If everything valid
          if(res.data.responseData.isrequestProcessed == "false"){
              setPopupMessage(res.data.responseData.message);
              setShowPopup(true);
              return;
          }else{
            navigate("/lock-unlock-success", {
              state: {
                maskedAadhaar,
                actionType,
                message : res.data.responseData.message
              },
            });
          }
        }
      }
  
};


  const faqs = [
    {
      question: "What is Aadhaar (UID) Lock & Unlock?",
      answer: "This service allows residents to lock or unlock their Aadhaar number for authentication security."
    },
    {
      question: "How can resident Lock UID?",
      answer: "Resident must have 16 digit VID to lock UID."
    },
    {
      question: "How can resident Unlock UID?",
      answer: "Resident can unlock UID using latest VID via UIDAI website."
    }
  ];

  // ------------------ UI ------------------

  return (
    <div className="lock-unlock-container-fixed">
      {showPopup && (
              <Popup
                message={popupMessage}
                onClose={() => setShowPopup(false)}
              />
            )}
      <button
        className="kiosk-back-circle-login"
        onClick={() => navigate(-1)}
      >
        ⬅
      </button>

      <div className="form-card-main">

        <div className="form-card-header">
      <h2 className="header-title">{t("lock_unlock_title")}</h2>
        </div>

        <div className="form-card-body">

          {/* RADIO SECTION */}
          <div className="mb-4 d-flex gap-4">
            <label className="radioBtnVerifyem d-flex align-items-center gap-2">
              <input
                type="radio"
                checked={actionType === "lock"}
                onChange={() => setActionType("lock")}
              />
           {t("lock_aadhaar")}

            </label>

            <label className="radioBtnVerifyem d-flex align-items-center gap-2">
              <input
                type="radio"
                checked={actionType === "unlock"}
                onChange={() => setActionType("unlock")}
              />
           {t("unlock_aadhaar")}
            </label>
          </div>

          {/* VID */}
          <div className="form-group">
            <label className="form-label text-muted labelText">
           {t("enter_vid")}
            </label>

      <input
  className={`simple-input ${vidError ? "input-error" : ""}`}
  value={vid}
  onChange={(e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");
    if (onlyNumbers.length <= 16) {
      setVid(onlyNumbers);
      setVidError("");
    }
  }}
  onClick={(e) => {
    setFocusedInput("vid");
      setKeyboardType("full"); 
    setShowKeyboard(true);
  }}
/>


            {vidError && (
              <div className="error-text">{vidError}</div>
            )}
          </div>

          {/* LOCK ONLY FIELDS */}
          {actionType === "lock" && (
            <>
              <div className="form-group">
                <label className="form-label text-muted labelText">
             {t("enter_full_name")}
                </label>

          <input
  className={`simple-input ${nameError ? "input-error" : ""}`}
  value={fullName}
  onChange={(e) => {
    if (e.target.value.length <= 60) {
      setFullName(e.target.value);
      setNameError("");
    }
  }}
  onClick={(e) => {
    setFocusedInput("name");
      setKeyboardType("full"); 
    setShowKeyboard(true);
  }}
/>


                {nameError && (
                  <div className="error-text">{nameError}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label text-muted labelText">
               {t("enter_pincode")}
                </label>

         <input
  className={`simple-input ${pinError ? "input-error" : ""}`}
  value={pincode}
  onChange={(e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");
    if (onlyNumbers.length <= 6) {
      setPincode(onlyNumbers);
      setPinError("");
    }
  }}
  onClick={() => {
    setFocusedInput("pin");
      setKeyboardType("full"); 
    setShowKeyboard(true);
  }}
/>


                {pinError && (
                  <div className="error-text">{pinError}</div>
                )}
              </div>
            </>
          )}

          {/* CAPTCHA */}
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
  onChange={(e) => {
    setCaptchaInput(e.target.value);
    setCaptchaError("");
  }}
  onClick={(e) => {
    setFocusedInput("captcha");
      setKeyboardType("full"); 
    setShowKeyboard(true);
  }}
/>


                {captchaError && (
                  <small className="text-danger">{captchaError}</small>
                )}

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


          {/* BUTTON */}
          <button
            className="send-otp-btn mt-5"
            onClick={handleSendOtp}
            disabled={isLoading || otpSent}
          >
           {isLoading 
  ? t("sending") 
  : otpSent 
    ? t("otp_sent") 
    : t("send_otp")}
          </button>

          {otpSent && (
            <>
              <div className="form-group mt-4">
                <label className="form-label text-muted labelText">
                  {t("enter_otp")}
                </label>

             <input
  className={`simple-input ${otpError ? "input-error" : ""}`}
  value={otp}
  onChange={(e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");
    if (onlyNumbers.length <= 6) {
      setOtp(onlyNumbers);
      setOtpError("");
    }
  }}
  onClick={(e) => {
    setFocusedInput("otp");
     setKeyboardType("numeric"); 
    setShowKeyboard(true);
  }}
/>


                {otpError && (
                  <div className="error-text">{otpError}</div>
                )}
              </div>

              {/* Declaration */}
              <div className="declaration-box mt-3">
                <label className="d-flex align-items-start gap-2">
                  <input
                    type="checkbox"
                    checked={declarationChecked}
                    onChange={(e) => setDeclarationChecked(e.target.checked)}
                  />
                  <span>
                  {t("declaration_lock")}
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                className="send-otp-btn-lock mt-3"
                disabled={otp.length !== 6 || !declarationChecked}
               onClick={handleSubmit}
              >
              {t("submit")}
              </button>





            </>
          )}

        </div>
      </div>

      {/* KEYBOARD */}
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
  <div className="loader-overlay">
    <div className="loader"></div>
  <p>{t("please_wait")}</p>
  </div>
)}

    </div>
  );

}

export default LockUnlockForm;

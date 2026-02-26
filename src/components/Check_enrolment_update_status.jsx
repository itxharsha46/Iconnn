import React, { useState, useEffect } from "react";
import FAQComponent from "./FAQComponent";
import VirtualKeyboard from "./VirtualKeyboard";
import "../style/Check_enrolment_update_status.css";
import AudioIcon from "../assets/AudioIcon.svg";
import RefreshIcon from "../assets/RefreshIcon.svg";
import { replace, useNavigate } from "react-router-dom";
import { fetchCaptcha } from "../APIs/captchaAPI";
import Popup from "./Popup";
import { checkenrolmentStatus } from "../APIs/checkenrollmentstatusAPI";
import { useTranslation } from "react-i18next";


function Check_enrolment_update_status() {
   const navigate = useNavigate();
const { t } = useTranslation();
  // Form states
  const [selectedType, setSelectedType] = useState("enrolment");
  const [enrolmentNo, setEnrolmentNo] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [time, setTime] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  //const [captchaData, setCaptchaData] = useState({ img: "", audio: "", text: "", captchaId: "" });
  const [statusFetched, setStatusFetched] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [enrolmentError, setEnrolmentError] = useState("");
  const [referenceError, setReferenceError] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  
  const [captchaData, setCaptchaData] = useState({
  img: "",
  audio: "",
  trxId: ""
});


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
  setCaptchaError("");
};


  // Submit form
const handleSubmit = async () => {
  let valid = true;

  setEnrolmentError("");
  setReferenceError("");
  setCaptchaError("");

  /* ---------------- CAPTCHA VALIDATION ---------------- */

  if (!captchaInput.trim()) {
    setCaptchaError("Captcha is required");
    valid = false;
  } else if (!captchaData.trxId) {
    setCaptchaError("Captcha not loaded. Please refresh.");
    valid = false;
  }

  /* ---------------- ENROLMENT / REFERENCE VALIDATION ---------------- */

  if (selectedType === "enrolment") {
    if (!enrolmentNo.trim()) {
      setEnrolmentError("Enter enrolment number");
      valid = false;
    } else if (enrolmentNo.length !== 14) {
      setEnrolmentError("Enrolment number must be 14 digits");
      valid = false;
    }
  } else {
    if (!referenceNo.trim()) {
      setReferenceError(`Enter ${selectedType.toUpperCase()} number`);
      valid = false;
    }
  }

  if (!valid) return;

  /* ---------------- API CALL WITH LOADER ---------------- */

  try {
    setLoading(true);   // 🔥 START LOADER

    // 🔥 Replace this with your real API call
    // Example:
    console.log("date "+date)
    console.log("time "+time)
    console.log("selectedType "+selectedType)
    console.log(selectedType + " " +enrolmentNo)
    console.log(selectedType +" " + referenceNo)
    var _srn = "";
    var _eid = "";
    if(selectedType == "enrolment"){
        if(date && time){
          _eid = enrolmentNo+date?.replace('-','')?.time?.replace(':','');
        }else{
          _eid = enrolmentNo;
        }
    }else if(selectedType == "sid"){      
        _eid = referenceNo;
    }else{
      _srn = referenceNo;
    }
    //console.log(urn)
    const response = await checkenrolmentStatus({
      srn: _srn,
      eid: _eid,
      captchaValue: captchaInput,
      captchaTxnId: captchaData.trxId
    });
    
    console.log(response)
    // Dummy delay (remove when API added)
    //await new Promise((resolve) => setTimeout(resolve, 2000));
    if(response.data.errorCode != null){
        setPopupMessage(response.data?.errorDetails.messageEnglish);
        setShowPopup(true);
    }else{
    // After successful API response
        setPopupMessage(response.data?.statusData[0].resMessage);
        setShowPopup(true);
      
      //setStatusFetched(true);
    }

  } catch (error) {
    console.error("Status API error:", error);
    alert("Something went wrong. Please try again.");

  } finally {
    setLoading(false);   // 🔥 STOP LOADER
  }
};


 

  useEffect(() => {
    loadNewCaptcha();
  }, []);

  // Hide keyboard on click outside
  useEffect(() => {
    const hideKeyboard = (e) => {
      if (!e.target.closest(".simple-input") && !e.target.closest(".vk-chromeos")) {
        setShowKeyboard(false);
        setFocusedInput(null);
      }
    };
    document.addEventListener("mousedown", hideKeyboard);
    return () => document.removeEventListener("mousedown", hideKeyboard);
  }, []);

  // Idle redirect
  useEffect(() => {
    let timeout;
    const idleTime = window.APP_CONFIG?.IDLE_TIMEOUT || 30000;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => navigate("/kiosk-home2"), idleTime);
    };
    ["mousemove","mousedown","click","scroll","keypress","touchstart"].forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      clearTimeout(timeout);
      ["mousemove","mousedown","click","scroll","keypress","touchstart"].forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [navigate]);

  // Audio captcha
const playAudio = () => {
  if (!captchaData.audio) return;

  const audio = new Audio(captchaData.audio);
  audio.play().catch(err => console.error("Audio error:", err));
};


  // Virtual keyboard
  const handleKeyPress = (key) => {
    if (focusedInput === "enrolment" && enrolmentNo.length < 14) setEnrolmentNo(enrolmentNo + key);
    if (focusedInput === "reference") setReferenceNo(referenceNo + key);
    if (focusedInput === "captcha") setCaptchaInput(captchaInput + key);
  };

  const handleBackspace = () => {
    if (focusedInput === "enrolment") setEnrolmentNo(enrolmentNo.slice(0, -1));
    if (focusedInput === "reference") setReferenceNo(referenceNo.slice(0, -1));
    if (focusedInput === "captcha") setCaptchaInput(captchaInput.slice(0, -1));
  };

  const handleClear = () => {
    if (focusedInput === "enrolment") setEnrolmentNo("");
    if (focusedInput === "reference") setReferenceNo("");
    if (focusedInput === "captcha") setCaptchaInput("");
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setEnrolmentNo("");
    setReferenceNo("");
    setDate("");
    setTime("");
    setCaptchaInput("");
    setFocusedInput(null);
    setEnrolmentError("");
    setReferenceError("");
  };
  const faqs = [
    {
      question: "What are the different forms of Aadhaar and what are their features?",
      answer: "The different forms of Aadhaar are Aadhaar Letter, Aadhaar PVC card, eAadhaar and mAadhaar. All forms of Aadhaar are equally valid and acceptable."
    },
    {
      question: "Can I choose to have and use any form of Aadhaar?",
      answer: "Yes"
    },
    {
      question: "What is “Order Aadhaar PVC Card” service?",
      answer: "“Order Aadhaar PVC Card” is an online service launched by UIDAI which facilitates the Aadhaar holder to get their Aadhaar details printed on PVC card by paying nominal charges."
    },
    {
      question: "What are the security features of “Aadhaar PVC Card”?",
      answer: "This card contains security features like:Tamper proof QR Code ,Micro text,Ghost image,Issue Date & Print Date,Guilloche Pattern,Embossed Aadhaar Logo"
    },
    {
      question: "What are the charges to be paid for “Aadhaar PVC Card”?",
      answer: "Charges to be paid are Rs.75/- (Inclusive of GST & speed post charges)."
    },
     {
      question: "How one can raise the request for “Aadhaar PVC Card”?",
      answer: "''Aadhaar PVC Card' request can be raised by visiting the UIDAI Official Website (https://www.uidai.gov.in or https://myaadhaar.uidai.gov.in) or mAadhaar application"
    },
     {
      question: "How to raise request using Registered Mobile Number?",
      answer: "Please Visit https://uidai.gov.in or https://myaadhaar.uidai.gov.in/genricPVC.Click on “Order Aadhaar PVC Card” Service.Click on Login, Enter your 12-digit Aadhaar Number (UID).Enter the security code .Click on “Login with OTP” button.Enter OTP received on registered mobile number.Click on 'Order Aadhaar PVC Card' tile.On next screen, select option 'Order Aadhaar PVC Card for Self', preview of the Aadhaar details will appear for verification by Aadhaar number holder before placing the order for Aadhaar PVC Card.Click on the check box against “Terms and Conditions”. (Note: Click on hyper link to see details).Click on “Submit” Button to complete OTP verification.Click on “Make payment”. You will be re-directed to Payment Gateway page with payment options as Credit/Debit Card, Net banking and UPI.After successful payment, receipt will get generated having digital signature which can be downloaded by Aadhaar number holder in PDF format. Aadhaar number holder will also get the Service Request Number via SMS.Aadhaar number holder can track the status of SRN till dispatch of Aadhaar Card on Check Aadhaar Card Status.SMS containing AWB number will also be sent once dispatched from DoP. Aadhaar number holder can further track delivery status by visiting DoP website."
    }
  ];


  return (
   <div className="full-screen-center-retrive">
      {showPopup && (
        <Popup
          message={popupMessage}
          onClose={() => setShowPopup(false)}
        />
      )}
          <div className="aadhaar-wrapper">
           <div className="uidai-header-retreive position-relative">
           <div className="uidai-header-left d-flex align-items-center">
              <span className="ms-3"> {t("checkEnrolmentOrUpdateStatus")}</span>
          </div>
            <button  className="kiosk-back-circle-retrive header-back-btn" onClick={() => navigate("/kiosk-home2")}>⬅</button>
          
        </div>

        <div className="eaadhaar-page">
          <div className="col-12">
            <div className="col-12">
              <div className="card shadow-sm p-4 position-relative">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0 fw-bold">  {t("checkEnrolmentOrUpdateStatus")}</h5>
                  <button className="help-btn-retrive" onClick={() => setShowFaqModal(true)}>
                    <span className="help-icon-aadhar-enroll">?</span>
                  </button>
                </div>

           <p className="text-muted small">
  {t("checkIfAadhaarGenerated")}
</p>
              <p className="small">
  {t("enrolment14DigitInfo")}
</p>
               <p className="small">
  {t("lostEidText")} <a href="#">{t("clickHere")}</a>
</p>

                {/* Radio buttons */}
                <div className="mb-3">
                  {["enrolment", "srn", "urn", "sid"].map((type) => (
                    <label key={type} className="radioBtn me-3">
                      <input type="radio" checked={selectedType === type} onChange={() => handleTypeChange(type)} />
                      {type.toUpperCase()}
                    </label>
                  ))}
                </div>

                {/* ENROLMENT */}
                {selectedType === "enrolment" && (
                  <>
                    <div className="mb-4">
                      <label className="form-label text-muted labelText">  {t("enter14DigitEnrolment")}</label>
                      <input
                        type="text"
                        className={`simple-input ${enrolmentError ? "is-invalid" : ""}`}
                        value={enrolmentNo}
                        maxLength={14}
                        inputMode="numeric"
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setEnrolmentNo(val);
                          if (val.length !== 14) setEnrolmentError("Must be 14 digits");
                          else setEnrolmentError("");
                        }}
                        onFocus={() => { setFocusedInput("enrolment"); setShowKeyboard(true); }}
                      />
                      {enrolmentError && <div className="text-danger small mt-1">{enrolmentError}</div>}
                    </div>

                    <p className="small fw-semibold">  {t("mentionDateTimeOptional")}</p>

                    <div className="mb-4">
                      <label className="form-label text-muted labelText">  {t("selectDate")}</label>
                      <input type="date" className="simple-input" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>

                    <div className="mb-4">
                      <label className="form-label text-muted labelText">  {t("selectTime")}</label>
                      <input type="time" step="1" className="simple-input" value={time} onChange={(e) => setTime(e.target.value)} />
                    </div>
                  </>
                )}

                {/* SRN / URN / SID */}
                {selectedType !== "enrolment" && (
                  <div className="mb-4">
                  <label className="form-label text-muted labelText">
  {selectedType === "urn"
    ? t("enter8DigitUrn")
    : selectedType === "sid"
    ? t("enterSidNumber")
    : t("enterSrnNumber")}
</label>
                    <input
                      type="text"
                      className={`simple-input ${referenceError ? "is-invalid" : ""}`}
                      value={referenceNo}
                      maxLength={selectedType === "urn" ? 8 : selectedType === "sid" ? 28 : undefined}
                      onChange={(e) => setReferenceNo(e.target.value)}
                      onFocus={() => { setFocusedInput("reference"); setShowKeyboard(true); }}
                    />
                    {referenceError && <div className="text-danger small mt-1">{referenceError}</div>}
                  </div>
                )}

                {/* CAPTCHA */}
                <div className="row align-items-center captcha-row">
                  <div className="col-12 col-md-6 col-lg-6">
                    <div className="mb-3">
                      <label className="form-label text-muted labelText">  {t("enterCaptcha")}</label>
                      <input
                        type="text"
                        className="simple-input"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        onFocus={() => { setFocusedInput("captcha"); setShowKeyboard(true); }}
                      />
                      {captchaError && <div className="text-danger small">{captchaError}</div>}
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-6">
                    <div className="captcha-wrapper">
                      <div className="captcha-display" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f4f4f4', padding: '5px', borderRadius: '4px' }}>
                        <div style={{ background: '#fff', padding: '2px', border: '1px solid #ddd', minWidth: '100px', height: '35px', display: 'flex', justifyContent: 'center' }}>
                          {captchaData.img ? <img src={captchaData.img} alt="Captcha" style={{ height: '100%' }} /> : <span style={{ fontSize: '10px', color: '#666' }}>Loading...</span>}
                        </div>
                        <button type="button" className="captcha-btn" onClick={playAudio}><img src={AudioIcon} alt="Audio" /></button>
                        <button
  type="button"
  className="captcha-btn"
  onClick={() => {
    setCaptchaInput("");
    loadNewCaptcha();
  }}
>
<img src={RefreshIcon} alt="Refresh" /></button>
                      </div>
                    </div>
                  </div>
                </div>

           <button
  className="submit-btn mt-4"
  onClick={handleSubmit}
  disabled={loading}
>
  {loading ? (
    <span className="loader-spinner"></span>
  ) : (
    "Submit"
  )}
</button>


            
              </div>
            </div>

            {showFaqModal && (
              <div className="faq-modal-backdrop">
                <div className="faq-modal">
                  <div className="faq-modal-header-enroll">
                    <h5>{t("submit")}</h5>
                    <button className="close-btn" onClick={() => setShowFaqModal(false)}>✕</button>
                  </div>
                  <div className="faq-modal-body">
                    <FAQComponent faqs={faqs} />
                  </div>
                </div>
              </div>
            )}

{/* Status card container - always present */}
<div className="status-card mt-4 p-4 shadow-sm bg-white border-0">
  {statusFetched ? (
    <>
      {/* Status steps and message - show after submit */}
      <div className="d-flex justify-content-between align-items-center mb-5 position-relative px-3">
        <div
          style={{
            position: "absolute",
            top: "25px",
            left: "10%",
            right: "10%",
            height: "2px",
            background: "#0054A6",
            zIndex: 0,
          }}
        ></div>

        {[
     [
  { label: t("draft"), icon: "✎" },
  { label: t("payment"), icon: "₹" },
  { label: t("verification"), icon: "✓" },
  { label: t("validation"), icon: "Q" },
  { label: t("completed"), icon: "↺" },
]
        ].map((step, idx) => (
          <div key={step.label} className="text-center" style={{ zIndex: 1, width: "20%" }}>
            <div
              className="mx-auto d-flex align-items-center justify-content-center"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: idx <= 2 ? "#00AEEF" : "#0054A6",
                color: "#fff",
                fontSize: "20px",
                border: "4px solid #fff",
                boxShadow: "0 0 0 2px #00AEEF",
              }}
            >
              {step.icon}
            </div>
            <p className="mt-2 mb-0 fw-bold" style={{ fontSize: "14px" }}>
              {step.label}
            </p>
          </div>
        ))}
      </div>

      <div className="status-message text-center pt-3 border-top">
      <p className="text-primary mb-2">
  {t("aadhaarUpdatedMessage")}{" "}
  <a
    href="https://www.uidai.gov.in"
    target="_blank"
    rel="noreferrer"
    className="ms-1 fw-bold"
  >
    www.UIDAI.gov.in
  </a>
</p>
        {/* <p className="small">
          <a href="#" className="text-decoration-underline text-dark fw-bold">
            Click here
          </a>{" "}
          to order a secure, wallet-sized Aadhaar PVC card.
        </p> */}
      </div>
    </>
  ) : (
    <>
      {/* Placeholder content - shown before submit */}
      <div className="text-center py-5 text-muted">
       <p>
  {t("enterDetailsToCheckStatus")}
</p>
      </div>
    </>
  )}
</div>

            <VirtualKeyboard
              visible={showKeyboard}
              onKeyPress={handleKeyPress}
              onBackspace={handleBackspace}
              onClear={handleClear}
              onClose={() => { setShowKeyboard(false); setFocusedInput(null); }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Check_enrolment_update_status;

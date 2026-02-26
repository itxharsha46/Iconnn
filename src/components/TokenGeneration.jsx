import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import VirtualKeyboard from './VirtualKeyboard';
import { useTranslation } from "react-i18next";
import "../style/EAadhaarDownload.css";
import { printTokenReceipt } from '../APIs/printtokenreceiptAPI';
import Popup from './Popup';
function TokenGeneration() {
  const navigate = useNavigate();
const { t } = useTranslation();
  // --- Form State ---
  const [visitorName, setVisitorName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [visitReason, setVisitReason] = useState("");

  // --- Receipt State ---
  const [showReceipt, setShowReceipt] = useState(false);
   const [showReceiptPrintingError, setshowReceiptPrintingError] = useState(false);
  const [tokenDetails, setTokenDetails] = useState(null);

  // --- UI State ---
  const [focusedInput, setFocusedInput] = useState(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [errors, setErrors] = useState({});

  const [serviceType, setServiceType] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // --- Refs for Virtual Keyboard ---
  const nameRef = useRef(null);
  const mobileRef = useRef(null);
  const reasonRef = useRef(null);

  // --- Date/Time Helper ---
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString('en-IN', { 
      day: '2-digit', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit', hour12: true 
    });
  };

  // --- Generate Token Handler ---
  const handleGenerateToken = async () => {
    const newErrors = {};

    // 1. Name Validation
    if (!visitorName.trim()) {
      newErrors.name = "Full Name is required";
    }

    // 2. Mobile Validation (Strict 10 Digits)
    if (!mobileNumber.trim()) {
      newErrors.mobile = "Mobile Number is required";
    } else if (mobileNumber.length !== 10) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    // 3. Reason Validation
    // if (!visitReason.trim()) {
    //   newErrors.reason = "Reason for visit is required";
    // }

    // 4. Service Type Validation
if (!serviceType) {
  newErrors.serviceType = "Please select a service type";
}


    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const tokenNum = Math.floor(1000 + Math.random() * 9000); // Random 4-digit token
    setTokenDetails({
  token: tokenNum,
  name: visitorName,
  mobile: mobileNumber,
  reason: visitReason,
  service: serviceType,
  date: getCurrentDateTime()
    });
    const res = await printTokenReceipt({
          name: visitorName,
          mobilenumber: mobileNumber,
          reason: serviceType,
        });
    setErrors({});
    if(res.data != "Receipt printed successfully"){
      setPopupMessage(res?.data);
      setShowPopup(true);
    }else{
      setShowReceipt(true);
    }
    
   
  };

  // --- Virtual Keyboard Logic ---
  const refMap = {
    name: nameRef,
    mobile: mobileRef,
    reason: reasonRef
  };

  const handleKeyPress = (key) => {
    if (!focusedInput) return;
    switch (focusedInput) {
      case "name": setVisitorName(prev => prev + key); break;
      case "mobile": if (mobileNumber.length < 10) setMobileNumber(prev => prev + key); break;
      case "reason": setVisitReason(prev => prev + key); break;
    }
    refMap[focusedInput]?.current?.focus();
  };

  const handleBackspace = () => {
    if (!focusedInput) return;
    switch (focusedInput) {
      case "name": setVisitorName(prev => prev.slice(0, -1)); break;
      case "mobile": setMobileNumber(prev => prev.slice(0, -1)); break;
      case "reason": setVisitReason(prev => prev.slice(0, -1)); break;
    }
  };

  const handleClear = () => {
    if (!focusedInput) return;
    switch (focusedInput) {
      case "name": setVisitorName(""); break;
      case "mobile": setMobileNumber(""); break;
      case "reason": setVisitReason(""); break;
    }
  };

  // --- Hide Keyboard on Outside Click ---
  useEffect(() => {
    const hideKeyboard = (e) => {
      if (!e.target.closest(".floating-input") && !e.target.closest(".simple-input") && !e.target.closest(".vk-chromeos")) {
        setShowKeyboard(false);
        setFocusedInput(null);
      }
    };
    document.addEventListener("mousedown", hideKeyboard);
    return () => document.removeEventListener("mousedown", hideKeyboard);
  }, []);

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
    <div className="full-screen-center">
      {showPopup && (
              <Popup
                message={popupMessage}
                onClose={() => setShowPopup(false)}
              />
            )}

     <div className="aadhaar-wrapper">        
        {/* Header Section */}
  <div className="uidai-header position-relative">
  

  <div className="uidai-header-left d-flex align-items-center">
            <span className="ms-3">  {t("tokenGenerationTitle")}</span>          </div>
            <button    className="kiosk-back-circle header-back-btn" onClick={() => navigate("/kiosk-home2")} aria-label="Go back">
              ⬅
            </button>
    

        </div>

        <div className="row justify-content-center eaadhaar-page">
          <div className="col-12">
            <div className="card shadow-sm p-4 position-relative">

              {!showReceipt ? (
                // --- FORM VIEW ---
                <>
                  <h5 className="selectAadhar mb-4">  {t("enterVisitorDetails")}</h5>

                  {/* Name Input */}
                  <div className="mb-4">
                    <label className="form-label text-muted labelText">{t("fullName")}</label>
                    <input 
                      type="text" 
                      className="simple-input" 
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      onFocus={() => { setFocusedInput("name"); setShowKeyboard(true); }}
                      ref={nameRef}
                    />
                    {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
                  </div>

                  {/* Mobile Input */}
                  <div className="mb-4">
                    <label className="form-label text-muted labelText">{t("mobileNumber")}</label>
                    <input 
                      type="text" 
                      className="simple-input" 
                      value={mobileNumber}
                      maxLength={10}
                      // Ensures only numbers are typed
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                      onFocus={() => { setFocusedInput("mobile"); setShowKeyboard(true); }}
                      ref={mobileRef}
                    />
                    {errors.mobile && <div className="text-danger small mt-1">{errors.mobile}</div>}
                  </div>

                  {/* Reason Input */}
                  {/* <div className="mb-4">
                    <label className="form-label text-muted labelText">Reason for Visit</label>
                    <input 
                      type="text" 
                      className="simple-input" 
                      value={visitReason}
                      onChange={(e) => setVisitReason(e.target.value)}
                      onFocus={() => { setFocusedInput("reason"); setShowKeyboard(true); }}
                      ref={reasonRef}
                    />
                    {errors.reason && <div className="text-danger small mt-1">{errors.reason}</div>}
                  </div> */}

                  {/* Service Type Dropdown */}
<div className="mb-4">
  <label className="form-label text-muted labelText">{t("serviceType")}</label>
  <select
    className="simple-input"
    value={serviceType}
    onChange={(e) => setServiceType(e.target.value)}
  >
  <option value="">{t("selectService")}</option>
    <option value="Update Mobile Number">Update Mobile Number</option>
    <option value="Update Email ID">Update Email ID</option>
     <option value="Update Address">Update Address</option>
      <option value="Update Name">Update Name</option>
       <option value="Update DOB">Update Date of Birth</option>
        <option value="Update gender">Update Gender</option>
         <option value="Update bio">Update Biometric</option>
          <option value="Update document">Update Document</option>
          <option value="Others">Others</option>
  </select>

  {errors.serviceType && (
    <div className="text-danger small mt-1">{errors.serviceType}</div>
  )}
</div>


                  {/* Generate Button */}
                  <button className="send-otp-btn mt-3" onClick={handleGenerateToken}>
                  {t("generateReceipt")}
                  </button>
                </>
              ) : (
                // --- RECEIPT SUMMARY VIEW showReceiptPrintingError---
                <div className="receipt-container text-center animate-fade-in">
                  <h2 style={{color:'green'}}>  {t("pleaseCollectReceipt")}</h2>
                  <div className="receipt-details text-start mx-auto p-4" style={{ maxWidth: '400px', background: '#f8f9fa', borderRadius: '8px', border: '1px dashed #ccc' }}>
                    <h6 className="text-center text-muted mb-3 text-uppercase border-bottom pb-2">Receipt Summary</h6>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">{t("name")}:</span>
                      <span className="fw-bold">{tokenDetails.name}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">{t("mobile")}:</span>
                      <span className="fw-bold">{tokenDetails.mobile}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">{t("service")}:</span>
                      <span className="fw-bold">{tokenDetails.service}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">{t("date")}:</span>
                      <span className="fw-bold">{tokenDetails.date}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button className="btn btn-outline-primary me-3" onClick={() => navigate("/")}>
                      OK
                    </button>
                    {/* <button className="btn btn-primary" onClick={() => {
                      setShowReceipt(false);
                      setVisitorName("");
                      setMobileNumber("");
                      setVisitReason("");
                      setServiceType("");

                    }}>
                      New Token
                    </button> */}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Virtual Keyboard */}
        <VirtualKeyboard 
          visible={showKeyboard} 
          onKeyPress={handleKeyPress} 
          onBackspace={handleBackspace} 
          onClear={handleClear} 
          onClose={() => { setShowKeyboard(false); setFocusedInput(null); }} 
        />
      </div>
    </div>
  );
}

export default TokenGeneration;
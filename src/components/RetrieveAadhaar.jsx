import React, { useState, useRef } from 'react';
import { useEffect } from 'react';
import FAQComponent from './FAQComponent';
import VirtualKeyboard from './VirtualKeyboard';
import { Link } from "react-router-dom";
import "../style/RetrieveAadhaar.css";
import AudioIcon from "../assets/AudioIcon.svg";
import RefreshIcon from "../assets/RefreshIcon.svg";
import { useNavigate } from "react-router-dom";
import { fetchCaptcha } from "../APIs/captchaAPI";
import { validateUIDNumber } from "../APIs/retrieveuideidAPI"
import Popup from './Popup';
import { useTranslation } from "react-i18next";



function RetrieveAadhaar() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [focusedInput, setFocusedInput] = useState(null);
  const [nameError, setNameError] = useState("");
  const [dobError, setDobError] = useState("");
  const [contactError, setContactError] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [aadhaarType, setAadhaarType] = useState("aadhaar");
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const keyboardRef = useRef(null);
  const [captchaInput, setCaptchaInput] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [keyboardType, setKeyboardType] = useState("full");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const DUMMY_OTP = "123456";
  // const DUMMY_NAME = "TEST USER";

  // Form states
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [captcha, setCaptcha] = useState("");


  const [captchaData, setCaptchaData] = useState({
    img: "",
    audio: "",
    trxId: ""
  });


  const speakCaptcha = () => {
    if (!("speechSynthesis" in window)) {
      alert("Your browser does not support audio captcha");
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    const spacedCaptcha = captchaText.split("").join(" ");
    const utterance = new SpeechSynthesisUtterance(spacedCaptcha);
    const voices = synth.getVoices();
    utterance.voice = voices.find(v => v.lang === "en-IN") || voices[0];
    utterance.lang = "en-IN";
    utterance.rate = 0.6;
    utterance.pitch = 1;
    utterance.volume = 1;
    synth.speak(utterance);
  };
  const faqs = [
    { question: "How many times Aadhaar data can be updated?", answer: "Following limits are applicable for the update of Aadhaar information:Name: Twice in Life Time, Gender: Once in Life Time,Date of Birth: Once in life time" },
    { question: "What changes can I do to my name in Aadhaar?", answer: "For minor corrections in your name or change in name, kindly visit nearest Aadhaar Seva Kendra." },
    { question: "What is \"Order Aadhaar PVC Card\" service?", answer: "This service allows you to order a durable PVC (plastic) card version of your Aadhaar. The card includes security features like a hologram, guilloche pattern, ghost image, and micro text." },
    { question: "What documents are required for Online Address Update?", answer: "POA document as per supporting document list will be required." },
    { question: "Which are the documents required for updation in Aadhaar Address?", answer: "List of supporting documents which you can select from is available here. Please select the appropriate document from the list and provide a scan/image of the same while undertaking demographic data correction." },
    { question: "How can I submit my supporting documents in case of Address Update online Service?", answer: "You will be prompted to upload scan/image of the supporting document in pdf or jpeg format in the Update Address online Service. Please upload correct supporting document for processing of your request. For certain documents like Passport, Rent and Property agreement, image of multiple pages would be required." },
    { question: "Can I update my local language through Update Aadhaar online Service?", answer: "At present you can not update your local language through online portal." },
    { question: "Can I update my date of birth through Update Aadhaar online Service?", answer: "No, to update Date of Birth (DoB) kindly visit nearest Aadhaar Seva Kendra with DoB proof document." },
    { question: "I have already updated Date of Birth in my Aadhaar once. Can I update/ correct it?", answer: "No. You can update your Date of Birth (DoB) only once. Further Date of Birth (DoB) can be changed under exceptional circumstances, kindly call 1947 in this regard." },
    { question: "Does submission of request guarantee update of demographic information?", answer: "Submission of information does not guarantee update of Aadhaar data. Changes submitted through Update Aadhaar online Service are subjected to verification and validation by the UIDAI and after validation only the change request is processed further for Aadhaar update." },
    { question: "I have lost my mobile number/ do not possess the number that I enrolled with Aadhaar. How should I submit my update request?", answer: "In case you have lost/do not possess the mobile number anymore that is registered with Aadhaar, you have to personally visit the nearest Aadhaar Seva Kendra for updation of mobile number." },
    { question: "Will my Aadhaar number get changed after updation?", answer: "No, your Aadhaar number will remain same even after the update." },
    { question: "I want to cancel the update request. Will I be able to do it?", answer: "A resident can cancel the update request from the ‘Requests’ space in the myAadhaar dashboard until the request is picked up for further processing. If cancelled, the amount paid will be refunded to the account within 21 days" },
    { question: "Where can I see all my update requests?", answer: "A resident can view his/her update requests inside the ‘Requests’ space inside the myAadhaar dashboard." },
    { question: "How do I add my father’s / husband’s name to my address?", answer: "Relationship details are a part of address field in Aadhaar. This has been standardized to C/o (Care of). Filling this is optional." }
  ];

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

  // Virtual Keyboard Handlers
  const handleKeyPress = (key) => {

    // 🔹 BACKSPACE
    if (key === "backspace") {
      switch (focusedInput) {
        case "mobile":
          setMobile((prev) => prev.slice(0, -1));
          break;

        case "email":
          setEmail((prev) => prev.slice(0, -1));
          break;

        case "name":
          setName((prev) => prev.slice(0, -1));
          break;

        case "otp":
          setOtp((prev) => prev.slice(0, -1));
          break;

        case "captcha":
          setCaptchaInput((prev) => prev.slice(0, -1));
          break;

        default:
          break;
      }
      return;
    }

    // 🔹 CLEAR
    if (key === "clear") {
      switch (focusedInput) {
        case "mobile":
          setMobile("");
          break;

        case "email":
          setEmail("");
          break;

        case "name":
          setName("");
          break;

        case "otp":
          setOtp("");
          break;

        case "captcha":
          setCaptchaInput("");
          break;

        default:
          break;
      }
      return;
    }

    // 🔹 NORMAL KEY INPUT
    switch (focusedInput) {

      case "mobile":
        if (/^\d$/.test(key) && mobile.length < 10) {
          setMobile((prev) => prev + key);
        }
        break;

      case "email":
        if (email.length < 50) {
          setEmail((prev) => prev + key);
        }
        break;

      case "name":
        if (name.length < 60) {
          setName((prev) => prev + key);
        }
        break;

      case "otp":
        if (/^\d$/.test(key) && otp.length < 6) {
          setOtp((prev) => prev + key);
        }
        break;

      case "captcha":
        if (captchaInput.length < 6) {
          setCaptchaInput((prev) => prev + key);
        }
        break;

      default:
        break;
    }
  };


  const handleBackspace = () => {
    switch (focusedInput) {
      case 'name': setName(name.slice(0, -1)); break;
      case 'dob': setDob(dob.slice(0, -1)); break;
      case 'mobile': setMobile(mobile.slice(0, -1)); break;
      case 'email': setEmail(email.slice(0, -1)); break;
      case 'captcha':
        setCaptchaInput(captchaInput.slice(0, -1));
        break;
      default: break;
    }
  };

  const handleClear = () => {
    switch (focusedInput) {
      case 'name': setName(""); break;
      case 'dob': setDob(""); break;
      case 'mobile': setMobile(""); break;
      case 'email': setEmail(""); break;
      case 'captcha': setCaptchaInput(""); break;
      default: break;
    }
  };
  // const handleRefreshCaptcha = () => {
  //   setCaptchaInput("");
  //   setCaptchaText(generateCaptcha());
  // };
  const validateName = (value) => {
    if (!value.trim()) {
      setNameError(t("name_required"));
    } else if (!/^[A-Za-z ]+$/.test(value.trim())) {
      setNameError(t("name_invalid_alphabets"));
    } else {
      setNameError("");
    }
  };


  const validateDob = (value) => {
    if (!value) setDobError(t("dob_required"));
    else setDobError("");
  };
  const validateContact = (mobileVal, emailVal) => {
    if (!mobileVal && !emailVal) {
      setContactError(t("mobile_required"));
    }
    else if (mobileVal && !/^\d{10}$/.test(mobileVal)) {
      setContactError(t("invalid_mobile"));
    }
    else if (
      emailVal &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)
    ) {
      setContactError(t("invalid_email"));
    }
    else {
      setContactError("");
    }
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
  useEffect(() => {
    let interval;

    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [otpSent, timer]);


  //   const canSendOtp =
  //     name &&
  //     nameError === "" &&
  //     dob &&
  //     contactError === "" &&
  // captchaInput &&
  // captchaData.trxId;
  const canSendOtp =
    name.trim().length > 0 &&
    dob &&
    (
      /^\d{10}$/.test(mobile) ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) &&
    captchaInput.trim().length > 0 &&
    captchaData.trxId;

  const handleSendOtp = async () => {

    // 🔥 Manual Validation First

    let isValid = true;

    if (!name.trim()) {
      setNameError("Name is required");
      isValid = false;
    }

    if (!dob) {
      setDobError("Date of Birth is required");
      isValid = false;
    }

    if (!mobile && !email) {
      setContactError("Enter mobile number or email");
      isValid = false;
    }

    if (mobile && !/^\d{10}$/.test(mobile)) {
      setContactError("Mobile number must be exactly 10 digits");
      isValid = false;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setContactError("Invalid email address");
      isValid = false;
    }

    if (!captchaInput.trim()) {
      setCaptchaError("Captcha is required");
      isValid = false;
    }

    if (!captchaData.trxId) {
      setCaptchaError("Captcha not loaded");
      isValid = false;
    }

    if (!isValid) return;  // 🚫 STOP API CALL


    // ✅ If validation passes → call API

    try {
      setLoading(true);

      const formatDob = (date) => {
        const [year, month, day] = date.split("-");
        return `${day}/${month}/${year}`;
      };

      const payload = {
        mobileNumber: mobile || null,
        dob: formatDob(dob),
        email: email || null,
        name: name,
        option: aadhaarType === "aadhaar" ? "UID" : "EID",
        otp: null,
        otpTxnId: null,
        captchaTxnId: captchaData.trxId,
        captcha: captchaInput,
        resendOtp: false
      };

      const result = await validateUIDNumber(payload);

      if (!result.success) {
        alert("Something went wrong");
        return;
      }

      const response = result.data;
      if (response.status != "Success") {
        setPopupMessage(response?.errorDetails?.messageEnglish);
        setShowPopup(true);
        return;
      }

      if (response?.responseData?.otpTxnId) {
        sessionStorage.setItem(
          "otpTxnId",
          response.responseData.otpTxnId
        );

        setOtpSent(true);
        setTimer(30);
        setCanResend(false);

        setTimeout(() => {
          setFocusedInput("otp");
          setShowKeyboard(true);
        }, 300);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    let timeout;

    const idleTime =
      window.APP_CONFIG?.IDLE_TIMEOUT || 60000;

    const resetTimer = () => {
      if (loading) return;

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
  }, [navigate, loading]);




  // const handleSendOtp = async () => {

  //   if (!validateCaptcha()) return;

  //   const formatDob = (date) => {
  //     const [year, month, day] = date.split("-");
  //     return `${day}/${month}/${year}`;
  //   };

  //   const payload = {
  //     mobileNumber: mobile || null,
  //     dob: formatDob(dob),
  //     email: email || null,
  //     name: name,
  //     option: aadhaarType === "aadhaar" ? "UID" : "EID",
  //     otp: null,
  //     otpTxnId: null,
  //     captchaTxnId: captchaData.trxId,
  //     captcha: captchaInput,
  //     resendOtp: false
  //   };

  //   const result = await validateUIDNumber(payload);

  //   if (!result.success) {
  //     alert("Something went wrong");
  //     return;
  //   }

  //   const response = result.data;

  //   // ❌ Invalid Captcha
  //   if (response.status === 400) {
  //     setCaptchaError(response.errorDetails?.messageEnglish);
  //     loadNewCaptcha();
  //     return;
  //   }

  //   // ✅ OTP Sent
  //   if (response.status === "Success" || response.responseData?.otpSent) {
  //     setOtpSent(true);
  //     sessionStorage.setItem("otpTxnId", response.responseData.otpTxnId);
  //   }
  // };
  const handleResendOtp = async () => {

    if (!captchaInput || !captchaData.trxId) {
      setCaptchaError("Captcha required");
      return;
    }

    const formatDob = (date) => {
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    };

    const payload = {
      mobileNumber: mobile || "9999999999",
      dob: formatDob(dob || "2001-01-01"),
      email: email || null,
      name: name || "Test User",
      option: aadhaarType === "aadhaar" ? "UID" : "EID",
      otp: null,
      otpTxnId: sessionStorage.getItem("otpTxnId"), // if backend sends it
      captchaTxnId: captchaData.trxId,
      captcha: captchaInput,
      resendOtp: true   // 🔥 IMPORTANT
    };

    console.log("Resend Payload:", payload);

    const result = await validateUIDNumber(payload);

    console.log("Resend Response:", result);

    if (!result.success) {
      alert("Resend failed");
      return;
    }
    if (response?.responseData?.otpTxnId) {
      sessionStorage.setItem(
        "otpTxnId",
        response.responseData.otpTxnId
      );
    }
    // Reset timer again
    setTimer(30);
    setCanResend(false);

    // Optional: reload captcha if backend requires fresh captcha
    //loadNewCaptcha();
    setCaptchaInput("");
  };

  const isMobileFilled = mobile.trim().length > 0;
  const isEmailFilled = email.trim().length > 0;

  const handleVerifyOtp = async () => {

    if (otp.length !== 6) {
      setOtpError("Enter valid 6 digit OTP");
      return;
    }

    try {
      setLoading(true);

      const formatDob = (date) => {
        const [year, month, day] = date.split("-");
        return `${day}/${month}/${year}`;
      };

      const payload = {
        mobileNumber: mobile || null,
        dob: formatDob(dob),
        email: email || null,
        name: name,
        option: aadhaarType === "aadhaar" ? "UID" : "EID",
        otp: otp,  // 🔥 ENTERED OTP
        otpTxnId: sessionStorage.getItem("otpTxnId"), // 🔥 STORED TXN ID
        captchaTxnId: captchaData.trxId,
        captcha: captchaInput,
        resendOtp: false
      };

      const result = await validateUIDNumber(payload);

      if (!result.success) {
        setOtpError("OTP verification failed");
        return;
      }

      const response = result.data;

      if (response.status === "Success") {
        //navigate("/retrieve-success");
        setPopupMessage(response?.responseData?.message + " - " + response.responseData.uidNumber + ". Please check your registered mobile number/email.");
        setShowPopup(true);
        sessionStorage.removeItem("otpTxnId");
        return;

      } else {
        setPopupMessage(response?.errorDetails?.messageEnglish);
        setShowPopup(true);
        return;
      }

    } catch (error) {
      console.error("OTP Verify Error:", error);
      setOtpError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="full-screen-center-retrive">
        {showPopup && (
          <Popup
            message={popupMessage}
            onClose={() => setShowPopup(false)}
          />
        )}
        <div className="aadhaar-wrapper">
          <div className="">
            <div className="uidai-header-retreive position-relative">
              <div className="uidai-header-left d-flex align-items-center">
                <span>{t("retrieve_aadhaar")}</span>
              </div>
              <button
                className="kiosk-back-circle-retrive header-back-btn"
                onClick={() => navigate("/kiosk-home2")}
                aria-label="Go back"
              >
                ⬅
              </button>


            </div>

            <div className="row justify-content-center eaadhaar-page">
              <div className="col-12">
                <div className="card shadow-sm p-4 position-relative">

                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="selectRetriveAadhaar mb-0">
                      {t("select_id_type")}
                    </h5>
                    <button
                      className="help-btn-retrive"
                      onClick={() => setShowFaqModal(true)}
                    >
                      <span className="help-icon-retrive">?</span>
                    </button>
                  </div>

                  {/* Radio Buttons */}
                  <div className="mb-4 d-flex gap-4">
                    <label className="radioBtnRetrieve d-flex align-items-center gap-2">
                      <input
                        type="radio"
                        name="aadhaarType"
                        value="aadhaar"
                        checked={aadhaarType === "aadhaar"}
                        onChange={(e) => setAadhaarType(e.target.value)}
                      />
                      <span>{t("aadhaar_number")}</span>
                    </label>

                    <label className="radioBtnRetrieve d-flex align-items-center gap-2">
                      <input
                        type="radio"
                        name="aadhaarType"
                        value="enrolment_sid"
                        checked={aadhaarType === "enrolment_sid"}
                        onChange={(e) => setAadhaarType(e.target.value)}
                      />
                      <span>{t("enrolment_id")}</span>
                    </label>
                  </div>

                  {/* Name */}
                  <div className="mb-4">
                    <label className="form-label text-muted labelText">{t("name")}</label>
                    <input
                      type="text"
                      className="simple-input"
                      value={name}
                      maxLength={60}
                      onFocus={() => {
                        setFocusedInput("name");
                        setKeyboardType("full");
                        setShowKeyboard(true);
                      }}
                      onChange={(e) => {
                        const val = e.target.value.slice(0, 60);
                        setName(val);
                        validateName(val);
                      }}
                    />

                    {nameError && <small className="text-danger">{nameError}</small>}
                  </div>

                  {/* DOB */}
                  <div className="mb-4">
                    <label className="form-label text-muted labelText">{t("dob")}</label>
                    <input
                      type="date"
                      className="simple-input"
                      value={dob}
                      onChange={(e) => {
                        setDob(e.target.value);
                        validateDob(e.target.value);
                      }}
                    />
                    {dobError && <small className="text-danger">{dobError}</small>}
                  </div>

                  {/* Mobile / Email */}
                  <div className="row mb-4 align-items-end">
                    <div className="col-md-5">
                      <label className="form-label text-muted labelText">{t("verify_email_mobile")}</label>
                      <div className="position-relative">
                        <input
                          type="text"
                          className="simple-input pe-5"
                          value={mobile}
                          maxLength={10}
                          disabled={isEmailFilled}
                          onFocus={() => {
                            setFocusedInput("mobile");
                            setKeyboardType("full");
                            setShowKeyboard(true);
                          }}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                            setMobile(val);
                            validateContact(val, email);
                          }}
                        />

                        {isEmailFilled && (
                          <span
                            className="lock-icon"
                            title="Disabled because Email is entered"
                          >
                            🔒
                          </span>
                        )}
                      </div>



                    </div>

                    <div className="col-md-2 text-center fw-semibold">OR</div>

                    <div className="col-md-5">
                      <label className="form-label text-muted labelText">{t("verify_email_mobile")}</label>
                      <div className="position-relative">
                        <input
                          type="email"
                          className="simple-input pe-5"
                          value={email}
                          maxLength={50}
                          disabled={isMobileFilled}
                          onFocus={() => {
                            setFocusedInput("email");
                            setKeyboardType("full");
                            setShowKeyboard(true);
                          }}
                          onChange={(e) => {
                            const val = e.target.value.slice(0, 50);
                            setEmail(val);
                            validateContact(mobile, val);
                          }}
                        />

                        {isMobileFilled && (
                          <span
                            className="lock-icon"
                            title="Disabled because Mobile number is entered"
                          >
                            🔒
                          </span>
                        )}
                      </div>



                      {contactError && <small className="text-danger">{contactError}</small>}
                    </div>
                  </div>

                  {/* CAPTCHA */}
                  <div className="row align-items-center captcha-row">
                    <div className="col-12 col-md-6 col-lg-6">
                      <div className="mb-3">
                        <label className="form-label text-muted labelText">{t("enter_captcha")}</label>
                        <input
                          type="text"
                          className="simple-input"
                          // placeholder="Enter captcha"
                          value={captchaInput}
                          onFocus={() => {
                            setFocusedInput("captcha");
                            setKeyboardType("full");
                            setShowKeyboard(true);
                          }}
                          onChange={(e) => {
                            setCaptchaInput(e.target.value);
                            if (captchaError) validateCaptcha();
                          }}
                        />
                        {captchaError && <small className="text-danger">{captchaError}</small>}
                      </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-6">
                      <div className="captcha-wrapper">
                        <div className="captcha-display" style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          background: "#f4f4f4",
                          padding: "5px",
                          borderRadius: "4px"
                        }}>
                          <div style={{
                            background: "#fff",
                            padding: "2px",
                            border: "1px solid #ddd",
                            minWidth: "100px",
                            height: "35px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                          }}>
                            {captchaData.img ? (
                              <img
                                src={captchaData.img}
                                alt="Captcha"
                                style={{ height: "100%", width: "auto" }}
                              />
                            ) : (
                              <span style={{ fontSize: "10px" }}>Loading...</span>
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

                  {/* SEND OTP */}
                  <button
                    className="btn btn-primary px-4 mt-5"
                    disabled={loading}
                    onClick={handleSendOtp}
                  >
                    {t("send_otp")}
                  </button>



                  {/* OTP */}
                  {otpSent && (
                    <>
                      <div className="mt-4">
                        <label className="form-label text-muted labelText">{t("enter_otp")}</label>
                        <input
                          type="text"
                          className="simple-input"
                          // placeholder="Enter 6 digit OTP"
                          value={otp}
                          maxLength={6}
                          onFocus={() => {
                            setFocusedInput("otp");
                            setKeyboardType("numeric");   // 🔥 ONLY HERE numeric
                            setShowKeyboard(true);
                          }}
                          onChange={(e) =>
                            setOtp(e.target.value.replace(/\D/g, ""))
                          }
                        />
                        {otpError && <small className="text-danger">{otpError}</small>}
                      </div>
                      <div className="mt-3 text-center">

                        {!canResend ? (
                          <p className="text-muted">
                            Resend OTP in <strong>{timer}s</strong>
                          </p>
                        ) : (
                          <button
                            className="btn btn-link p-0"
                            onClick={handleResendOtp}
                          >
                            {t("resend_otp")}
                          </button>
                        )}

                      </div>


                      <button
                        className="btn btn-success mt-3"
                        disabled={otp.length !== 6 || loading}

                        onClick={handleVerifyOtp}
                      >
                        {t("verify_continue")}
                      </button>

                    </>
                  )}

                </div>
              </div>
            </div>
          </div>

          {showFaqModal && (
            <div className="faq-modal-backdrop">
              <div className="faq-modal">

                <div className="faq-modal-header-retrive">
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
          {showKeyboard && (
            <div ref={keyboardRef}>
              <VirtualKeyboard
                visible={showKeyboard}
                onKeyPress={handleKeyPress}
                keyboardType={keyboardType}
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
        {loading && (
          <div className="loader-overlay">
            <div className="loader"></div>
            <p>{t("please_wait")}</p>
          </div>
        )}


      </div>




    </>
  )
}

export default RetrieveAadhaar;

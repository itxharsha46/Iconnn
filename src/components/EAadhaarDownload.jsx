import React, { useState, useEffect } from 'react';
import FAQComponent from './FAQComponent';
import VirtualKeyboard from './VirtualKeyboard';
import "../style/EAadhaarDownload.css";
import AudioIcon from "../assets/AudioIcon.svg";
import RefreshIcon from "../assets/RefreshIcon.svg";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCaptcha } from "../APIs/captchaAPI";
import { verifyUid } from "../APIs/verifyUidAPI";
import Popup from "../components/Popup";
import { validateUIDNumber } from '../APIs/validateaadhaarAPI';
import { downloadAadhaar } from '../APIs/downloadaadhaarAPI';
import { useTranslation } from "react-i18next";

function EAadhaarDownload() {
  const navigate = useNavigate();
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
const [keyboardType, setKeyboardType] = useState("default");
  const [selectedId, setSelectedId] = useState("aadhaar");
  const [aadhaar, setAadhaar] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [enrolment, setEnrolment] = useState("");
  const [enrolDate, setEnrolDate] = useState("");
  const [enrolTime, setEnrolTime] = useState("");
  const [otpTimer, setOtpTimer] = useState(60);
  const [virtualId, setVirtualId] = useState("");
  const [sid, setSid] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [masked, setMasked] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [aadhaarError, setAadhaarError] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [enrolmentError, setEnrolmentError] = useState("");
  const [virtualIdError, setVirtualIdError] = useState("");
  const [sidError, setSidError] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const aadhaarRef = useRef(null);
  const enrolmentRef = useRef(null);
  const virtualRef = useRef(null);
  const sidRef = useRef(null);
  const captchaRef = useRef(null);
  const otpRef = useRef(null);

  const DUMMY_OTP = "123456";

  //*********real*********//
  // const [captchaData, setCaptchaData] = useState({ img: '', audio: '', trxId: '' });

  // dummy
  const [captchaData, setCaptchaData] = useState({
    img: "",
    audio: "",
    trxId: "dummy-trx-123" //  dummy transaction ID for testing
  });
  const [otpData, setOTPData] = useState({
    otptrxId: "" //  dummy transaction ID for testing
  });

  // real
  //  const loadNewCaptcha = async () => {
  //   const result = await fetchCaptcha();

  //   if (result.success) {
  //     setCaptchaData({
  //       img: `data:image/jpeg;base64,${result.base64}`,
  //       audio: result.audioBase64
  //         ? `data:audio/wav;base64,${result.audioBase64}`
  //         : "",
  //       trxId: result.transactionId
  //     });
  //   } else {
  //     // setCaptchaError("Captcha service is temporarily unavailable");
  //     setCaptchaData({ img: "", audio: "", trxId: "" });
  //   }
  // };
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


  // dummy

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
      // 🔥 fallback for dummy mode
      setCaptchaData({
        img: "",
        audio: "",
        trxId: "dummy-trx-123"
      });
    }
  };




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



  // Validation checks
  const isAadhaarValid =
    (selectedId === "aadhaar" &&
      aadhaar.length === 12 &&
      aadhaarError === "")



  const isFormValid =
    isAadhaarValid ||
    (selectedId === "virtual" && virtualId.length === 16) ||
    (selectedId === "sid" && sid.length === 28) ||
    (selectedId === "enrolment" &&
      enrolment.length === 14 &&
      enrolDate &&
      enrolTime);


  const canSendOtp =
    captchaInput.length >= 4 &&
    captchaData.trxId &&
    (
      (selectedId === "aadhaar" &&
        aadhaar.length === 12 &&
        aadhaarError === "") ||

      (selectedId === "enrolment" &&
        enrolment.length === 14 &&
        enrolDate &&
        enrolTime &&
        enrolmentError === "") ||

      (selectedId === "virtual" &&
        virtualId.length === 16 &&
        virtualIdError === "") ||

      (selectedId === "sid" &&
        sid.length === 28 &&
        sidError === "")
    );


  // useEffect(() => {
  //   // loadNewCaptcha(); // 

  //   const hideKeyboard = (e) => {
  //     if (
  //       !e.target.closest(".floating-input") &&
  //       !e.target.closest(".vk-chromeos")
  //     ) {
  //       setShowKeyboard(false);
  //       setFocusedInput(null);
  //     }
  //   };

  //   document.addEventListener("mousedown", hideKeyboard);
  //   return () => document.removeEventListener("mousedown", hideKeyboard);
  // }, []);

  useEffect(() => {
    loadNewCaptcha();
    const hideKeyboard = (e) => {
      if (
        !e.target.closest(".floating-input") &&
        !e.target.closest(".vk-chromeos")
      ) {
        setShowKeyboard(false);
        setFocusedInput(null);
      }
    };

    document.addEventListener("mousedown", hideKeyboard);
    return () => document.removeEventListener("mousedown", hideKeyboard);
  }, []);


  // OTP Timer
  useEffect(() => {
    if (!otpSent) return;

    if (otpTimer === 0) return;

    const timerId = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [otpSent, otpTimer]);




  const refMap = {
    aadhaar: aadhaarRef,
    enrolment: enrolmentRef,
    virtualId: virtualRef,
    sid: sidRef,
    captcha: captchaRef,
    otp: otpRef
  };

  const handleKeyPress = (key) => {
    if (!focusedInput) return;

    switch (focusedInput) {
      case "aadhaar":
        if (aadhaar.length < 12) setAadhaar(prev => prev + key);
        break;
      case "enrolment":
        if (enrolment.length < 14) setEnrolment(prev => prev + key);
        break;
      case "virtualId":
        if (virtualId.length < 16) setVirtualId(prev => prev + key);
        break;
      case "sid":
        if (sid.length < 28) setSid(prev => prev + key);
        break;
      case "captcha":
        setCaptchaInput(prev => prev + key);
        break;
      case "otp":
        if (otp.length < 6) setOtp(prev => prev + key);
        break;
    }

    // 🔥 THIS IS THE MAGIC LINE
    refMap[focusedInput]?.current?.focus();
  };


  const handleBackspace = () => {
    if (!focusedInput) return;
    switch (focusedInput) {
      case 'aadhaar':
        setAadhaar(aadhaar.slice(0, -1));
        break;
      case 'enrolment':
        setEnrolment(enrolment.slice(0, -1));
        break;
      case 'virtualId':
        setVirtualId(virtualId.slice(0, -1));
        break;
      case 'sid':
        setSid(sid.slice(0, -1));
        break;
      case 'captcha':
        setCaptchaInput(captchaInput.slice(0, -1));
        break;
      case 'otp':
        setOtp(otp.slice(0, -1));
        break;
      default:
        break;
    }
  };

  const handleClear = () => {
    if (!focusedInput) return;
    switch (focusedInput) {
      case 'aadhaar': setAadhaar(""); break;
      case 'enrolment': setEnrolment(""); break;
      case 'virtualId': setVirtualId(""); break;
      case 'sid': setSid(""); break;
      case 'captcha': setCaptchaInput(""); break;
      case 'otp': setOtp(""); break;
      default: break;
    }
  };

  const faqs = [
    { question: "What is e-Aadhaar?", answer: "e-Aadhaar is a password protected electronic copy of Aadhaar, digitally signed by UIDAI." },
    { question: "Is e-Aadhaar equally valid like physical copy of Aadhaar?", answer: { text: "As per Aadhaar Act, e-Aadhaar is equally valid like Physical Copy of Aadhaar for all purposes. For validity of e-Aadhaar, please visit UIDAI circular:", link: "https://uidai.gov.in/images/uidai_om_on_e_aadhaar_validity.pdf" } },
    { question: "What is Masked Aadhaar?", answer: "Masked Aadhaar implies replacing of first 8 digits of Aadhaar number with “xxxx-xxxx” while only last 4 digits of the Aadhaar Number are visible." },
    { question: "How do I validate the digital signature?", answer: { text: "To successfully validate the digital signature on e-Aadhaar and see the 'green tick' in the PDF, we recommend that you download and open it in the latest version of Adobe Acrobat Reader on Microsoft Windows or MacOS.<br/>If the signature still shows a warning or question mark, you may need to manually add the signing certificate to your trusted identities.<br/>Instructions on how to do this can be found on the Adobe Help website: ", link: "https://helpx.adobe.com/acrobat/using/trusted-identities.html" } },
    { question: "What Is the Password of e-Aadhaar?", answer: "Password of eAadhaar is a combination of the first 4 letters of name in CAPITAL and the year of birth (YYYY).<br/>For Example:<br/>Example 1</br>Name: SURESH KUMAR<br/>Year of Birth: 1990<br/>Password: SURE1990" },
    { question: "What supporting software needed to open e-Aadhaar?", answer: "Resident needs 'Adobe Reader' to view e-Aadhaar. You have 'Adobe Reader' installed in your System. To install Adobe Reader in the System visit<br/>https://get.adobe.com/reader/" },
    { question: "How can an Aadhaar Number holder download e-Aadhaar?", answer: "An Aadhaar Number holder can download e-Aadhaar by following three ways: <br/>By Using Enrolment Number:<br/>By Using Aadhaar No:<br/>By using VID:<br/>OTP for downloading eAadhaar will be received on registered mobile number." },
  ];
  const handleRefreshCaptcha = () => {
    setCaptchaInput("");
    setCaptchaText(generateCaptcha());
  };

  const validateAadhaar = async () => {
    if (selectedId === "aadhaar") {
      if (!aadhaar) {
       setAadhaarError(t("aadhaar_required"));
        return false;
      }
      if (!/^\d{12}$/.test(aadhaar)) {
       setAadhaarError(t("aadhaar_12_digits"));
        return false;
      }
    }
    //  
    return true;
  };


 const handleVerifyOtp = async () => {
	try {
		setLoading(true);
		const res = await downloadAadhaar({
			uid: aadhaar,
			mask: masked,
			otp : otp,
			otpTxnId: otpData.otptrxId
		});
		if (res.success) {
			console.log("downloadAadhaar " +res.data);
			if (res.data.status != "Success") {
			  setPopupMessage(res.data.errorDetails.messageEnglish);
			  setShowPopup(true);
			  return false;
			}
		}
		setOtpError("");
		navigate("/download-success", {
		state: {
		  aadhaarPdfBase64: res.data.data.aadhaarPdf
		}
		});
	} catch (err) {
    console.error(err);
    setPopupMessage("Server error during download.");
    setShowPopup(true);
	} finally {
		setLoading(false);  
	}
};

  const downloadPdfFromBase64 = (base64Data, fileName = "document.pdf") => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();

    window.URL.revokeObjectURL(url);
  };
  const downloadDummyPdf = () => {
    const pdfContent = `
    e-Aadhaar (Dummy Copy)

    Name: TEST USER
    Aadhaar No: XXXX-XXXX-1234
    DOB: 01-01-1995

    This is a dummy Aadhaar PDF for testing purposes only.
  `;

    const blob = new Blob([pdfContent], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "eAadhaar_dummy.pdf";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const validateAadhaarLive = (value) => {
    if (value.length === 0) {
      setAadhaarError("Aadhaar is required");
    } else if (!/^\d+$/.test(value)) {
      setAadhaarError("Only digits are allowed");
    } else if (value.length !== 12) {
      setAadhaarError("Aadhaar must be 12 digits");
    } else {
      setAadhaarError("");

    }
  };

  const validateEnrolmentLive = (value) => {
    if (value.length === 0) {
      setEnrolmentError("Enrolment ID is required");
    } else if (!/^\d+$/.test(value)) {
      setEnrolmentError("Only digits are allowed");
    } else if (value.length < 14) {
      setEnrolmentError("Enrolment ID must be 14 digits");
    } else {
      setEnrolmentError("");
    }
  };
  const validateVirtualIdLive = (value) => {
    if (value.length === 0) {
      setVirtualIdError("Virtual ID is required");
    } else if (!/^\d+$/.test(value)) {
      setVirtualIdError("Only digits are allowed");
    } else if (value.length < 16) {
      setVirtualIdError("Virtual ID must be 16 digits");
    } else {
      setVirtualIdError("");
    }
  };
  const validateSidLive = (value) => {
    if (value.length === 0) {
      setSidError("SID is required");
    } else if (!/^S\d*$/.test(value)) {
      setSidError("SID must start with 'S' followed by digits");
    } else if (value.length < 28) {
      setSidError("SID must be S + 27 digits");
    } else if (!/^S\d{27}$/.test(value)) {
      setSidError("Invalid SID format");
    } else {
      setSidError("");
    }
  };

  useEffect(() => {
    setAadhaarError("");
    setEnrolmentError("");
    setVirtualIdError("");
    setSidError("");
    setCaptchaError("");
  }, [selectedId]);

  const handleVerifyUid = async () => {
    const res = await validateUIDNumber({
      uid: aadhaar,
      captcha: captchaInput,
      captchaTxnId: captchaData.trxId
    });

    if (res.success) {
      console.log(res);
      console.log("handleVerifyUid validateUIDNumber => " + res.data.status)
      if (res.data.status === "Failure") {
        setPopupMessage(res.data.message);
        setShowPopup(true);
        return;
      }
      else {
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
          }


          console.log("OTP Generated:", res.data);
        } else {
          setPopupMessage("Something went wrong. Please try again.");
          setShowPopup(true);
        }
      }
    } else {
      setPopupMessage("Something went wrong. Please try again.");
      setShowPopup(true);
    }
  };

  const handleResendOtp = async () => {
    try {
         setLoading(true);
      const result = await verifyUid({
        uid: aadhaar,
        captcha: captchaInput,
        captchaTxnId: captchaData.trxId,
        resendOtp: true
      });

      if (result.success && result.data.status === "Success") {
        console.log("OTP Resent:", result.data);

        // 🔁 Reset timer
        setOtpTimer(60);

        // 🔄 Clear old OTP
        setOtp("");

        // 🔄 Reload captcha after resend
        await loadNewCaptcha();
        setCaptchaInput("");

      } else {
        setPopupMessage(
          result.data?.message || "Failed to resend OTP"
        );
        setShowPopup(true);
      }
    } catch (err) {
      console.error("Resend OTP Error:", err);
      setPopupMessage("Server error while resending OTP.");
      setShowPopup(true);
    }finally{
      setLoading(false);
    }
  };



  return (
    <div className="full-screen-center">
      {showPopup && (
        <Popup
          message={popupMessage}
          onClose={() => setShowPopup(false)}
        />
      )}



     <div className="aadhaar-wrapper">
        <div className="">
<div className="uidai-header position-relative">
  

  <div className="uidai-header-left d-flex align-items-center">
    <span>{t("download_eaadhaar")}</span>
  </div>

  {/* RIGHT SIDE - Back Button */}
  <button
    className="kiosk-back-circle header-back-btn"
    onClick={() => navigate("/kiosk-home2")}
    aria-label="Go back"
  >
    ⬅
  </button>

</div>


<div className="eaadhaar-page aadhaar-container">
              <div className=" shadow-sm p-4 position-relative">
                <div className="d-flex justify-content-between align-items-center mb-3">
                 <h5 className="selectAadhar mb-0">
  {t("select_id_type")}
</h5>
                  <button
                    className="help-btn"
                    onClick={() => setShowFaqModal(true)}
                  >
                    <span className="help-icon">?</span>
                  </button>
                </div>
                {/* Radio Buttons */}
                <div className="mb-3">
                  <label className="me-3 radioBtn">
                    <input
                      type="radio" disabled={otpSent}
                      checked={selectedId === "aadhaar"}
                      onChange={() => setSelectedId("aadhaar")}
                    />
                   {t("aadhaar_number")}
                  </label>

                  <label className="me-3 radioBtn">
                    <input
                      type="radio" disabled={otpSent}
                      checked={selectedId === "enrolment"}
                      onChange={() => setSelectedId("enrolment")}
                    />
                {t("enrolment_id")}
                  </label>

                  <label className="me-3 radioBtn">
                    <input
                      type="radio" disabled={otpSent}
                      checked={selectedId === "virtual"}
                      onChange={() => setSelectedId("virtual")}
                    />
                  {t("virtual_id")}
                  </label>

                  <label className="radioBtn">
                    <input
                      type="radio" disabled={otpSent}
                      checked={selectedId === "sid"}
                      onChange={() => setSelectedId("sid")}
                    />
                {t("sid")}
                  </label>
                </div>

                {/* Dynamic Inputs */}
                {selectedId === "aadhaar" && (
                  <div className="mb-4">
                    <label className="form-label text-muted labelText">{t("enter_aadhaar")}</label>
                    <input
                      type="text"
                      className="simple-input"

                      value={aadhaar}
                      maxLength={12}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setAadhaar(value);
                        validateAadhaarLive(value);
                      }}
                      onFocus={() => {
                        setFocusedInput("aadhaar");
                         setKeyboardType("default"); 
                        setShowKeyboard(true);
                      }}
                      disabled={otpSent}
                      required
                    />


                    {aadhaarError && (
                      <div className="text-danger small mt-1">
                        {aadhaarError}
                      </div>
                    )}
                  </div>
                )}


                {selectedId === "enrolment" && (
                  <>
                    <div className="mb-4">
                      <label className="form-label text-muted labelText">{t("enter_enrolment")}</label>
                      <input
                        type="text"
                        className="simple-input"

                        disabled={otpSent}
                        value={enrolment}
                        maxLength={14}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setEnrolment(value);
                          validateEnrolmentLive(value);
                        }}
                        onFocus={() => {
                          setFocusedInput("enrolment");
                           setKeyboardType("default"); 
                          setShowKeyboard(true);
                        }}

                        required
                      />


                      {enrolmentError && (
                        <div className="text-danger small mt-1">
                          {enrolmentError}
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="form-label text-muted labelText">{t("select_date")}</label>
                      <input
                        type="date"
                        disabled={otpSent}
                        className="simple-input"
                        value={enrolDate}
                        onChange={(e) => setEnrolDate(e.target.value)}
                        onFocus={() => setFocusedInput(null)}
                        required
                      />

                    </div>

                    <div className="mb-4">
                      <label className="form-label text-muted labelText">{t("select_time")}</label>
                      <input
                        type="time"
                        disabled={otpSent}
                        className="simple-input"
                        value={enrolTime}
                        onChange={(e) => setEnrolTime(e.target.value)}
                        onFocus={() => setFocusedInput(null)}
                        required
                      />

                    </div>
                  </>
                )}


                {selectedId === "virtual" && (
                  <div className="mb-4">
                    <label className="form-label text-muted labelText">{t("enter_virtual_id")}</label>
                    <input
                      type="text"
                      disabled={otpSent}
                      className="simple-input"
                      placeholder=" "
                      value={virtualId}
                      maxLength={16}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setVirtualId(value);
                        validateVirtualIdLive(value);
                      }}
                      onFocus={() => {
                        setFocusedInput("virtualId");
                         setKeyboardType("default"); 
                        setShowKeyboard(true);
                      }}

                      required
                    />


                    {virtualIdError && (
                      <div className="text-danger small mt-1">
                        {virtualIdError}
                      </div>
                    )}
                  </div>
                )}
                {selectedId === "sid" && (
                  <div className="mb-4">
                    <label className="form-label text-muted labelText">{t("enter_sid")}</label>
                    <input
                      type="text"
                      disabled={otpSent}
                      className="simple-input"
                      placeholder=" "
                      value={sid}
                      maxLength={28}
                      onChange={(e) => {
                        let val = e.target.value.toUpperCase();

                        // Force first character as S
                        if (val.length === 1) {
                          val = val.replace(/[^S]/g, "S");
                        } else {
                          val = "S" + val.substring(1).replace(/\D/g, "");
                        }

                        setSid(val);
                        validateSidLive(val); // 👈 LIVE VALIDATION
                      }}
                      onFocus={() => {
                        setFocusedInput("sid");
                         setKeyboardType("default"); 
                        setShowKeyboard(true);
                      }}

                      required
                    />


                    {sidError && (
                      <div className="text-danger small mt-1">
                        {sidError}
                      </div>
                    )}
                  </div>
                )}





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
                          // if (captchaError) validateCaptcha();
                        }}
                        onFocus={() => {
                          setFocusedInput("captcha");
                           setKeyboardType("default"); 
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
                          disabled={!captchaData.audio && otpSent}
                          title="Play Audio Captcha"
                        >
                          <img src={AudioIcon} alt="Audio" disabled={otpSent} />
                        </button>

                        {/* Real Refresh Button */}
                        <button
                          type="button"
                          disabled={otpSent}
                          className="captcha-btn"
                          onClick={loadNewCaptcha}
                          title="Refresh"
                        >
                          <img src={RefreshIcon} alt="Refresh" disabled={otpSent} />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>


                <button
                  className="send-otp-btn mt-4"
                  disabled={otpSent}
                  onClick={async () => {
                    const isAadhaarOk = validateAadhaar();
                    if (!isAadhaarOk) return;

                    if (!captchaInput || !captchaData.trxId) {
                  setCaptchaError(t("captcha_required"));
                      return;
                    }

                    try {

                    setLoading(true); 
                      const result = await verifyUid({
                        uid: aadhaar,
                        captcha: captchaInput,
                        captchaTxnId: captchaData.trxId
                      });

                      if (result.success) {
                        console.log("UID Verification Response:", result.data);

                        // ✅ SUCCESS
                        if (result.data.status === "Success") {
                          setOtpSent(true);
                          setOTPData({
                            otptrxId: result.data.txnId
                          });
                          setOtpTimer(60);
                          setCaptchaError("");
                        }
                        // ❌ UIDAI FAILURE (invalid captcha, etc.)
                        else {

                          if (result.data.errorCode === "UAS-VAL-OTP-INF-001") {
                            setPopupMessage(
                              "We couldn't find an Aadhaar number matching the one you entered. Please double-check and try again."
                            );
                          } else {
                            setPopupMessage(
                              result.data.message ||
                              result.data.statusMessage ||
                              "Verification failed"
                            );
                          }
                          setShowPopup(true);

                          // loadNewCaptcha();
                          // setCaptchaInput("");
                        }
                      }
                      // ❌ API FAILURE
                      else {
                        setPopupMessage(result.error || "Verification failed");
                        setShowPopup(true);

                        // loadNewCaptcha();
                        // setCaptchaInput("");
                      }

                    } catch (err) {
                      console.error("Error during UID verification:", err);

                     setPopupMessage(t("server_error"));
                      setShowPopup(true);

                      // loadNewCaptcha();
                      // setCaptchaInput("");
                    }finally{
                          setLoading(false);
                    }
                  }}
                >
                 {t("send_otp")}
                </button>




                {otpSent && (
                  <>
                    <div className='maskedAadhaar'>
                      <label className="radioBtn circle-check">
                        <input type="checkbox" checked={masked} onChange={() => setMasked(!masked)} />
                        <span className="custom-circle"></span>
                        <span className="circle-text">{t("masked_aadhaar")}</span>
                      </label>
                    </div>

                    <div className="d-flex align-items-center mt-3">
                      <div className="floating-field flex-grow-1">
                        <input
                          type="text"
                          className="floating-input"
                          placeholder=" "
                          value={otp}
                          maxLength={6}
                          inputMode="numeric"
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                         onFocus={() => { 
  setFocusedInput("otp"); 
  setKeyboardType("numeric");   
  setShowKeyboard(true); 
}}
                        />
                        <label className='otpText'>{t("enter_otp")}</label>
                        {otpError && <div className="text-danger small mt-1">{otpError}</div>}

                      </div>

                      <div className="ms-3">
                        <button
                          className="resend-otp-btn"
                          disabled={otpTimer > 0}
                          onClick={handleResendOtp}
                        >
                    {otpTimer > 0 ? `Resend in ${otpTimer}s` : t("resend_otp")}
                        </button>

                      </div>
                    </div>

                    <button
                      className="mt-3 send-otp-btn"
                      disabled={otp.length !== 6}
                      onClick={handleVerifyOtp}
                    >
                      <span>{t("verify_download")}</span>
                    </button>

                  </>
                )}
              </div>
            

          </div>
        </div>
        {showFaqModal && (
          <div className="faq-modal-backdrop">
            <div className="faq-modal">

              <div className="faq-modal-header">
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
      {loading && (
<div className="loader-overlay">
    <div className="loader"></div>
<p>{t("please_wait")}</p>
  </div>
)}

    </div>
  );
}

export default EAadhaarDownload;

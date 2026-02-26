import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../style/CheckPVCOrderStatus.css";
import FAQComponent from './FAQComponent';
import { useNavigate } from 'react-router-dom';
import AudioIcon from "../assets/AudioIcon.svg";
import RefreshIcon from "../assets/RefreshIcon.svg";
import { useEffect } from 'react';
import VirtualKeyboard from "./VirtualKeyboard";
import { fetchCaptcha } from "../APIs/captchaAPI";
import { checkstatusDetail } from '../APIs/statusCheckAPI';
import Popup from "../components/Popup";
import { useTranslation } from "react-i18next";


function CheckPVCOrderStatus() {
  const navigate = useNavigate();
const [loading, setLoading] = useState(false);
const [orderData, setOrderData] = useState(null);
const [showResult, setShowResult] = useState(false);
const [showPopup, setShowPopup] = useState(false);
const { t, i18n } = useTranslation();
const [popupMessage, setPopupMessage] = useState("");
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



  const [sid, setSid] = useState('');
  const [sidError, setSidError] = useState('');

  const [captcha, setCaptcha] = useState('');

  const [captchaError, setCaptchaError] = useState('');

  const [otpSent, setOtpSent] = useState(false);

  const [focusedInput, setFocusedInput] = useState(null);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const [captchaData, setCaptchaData] = useState({
    img: "",
    audio: "",
    trxId: ""
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


  /* ===============================
     FAQ DATA
  =============================== */
  const faqs = [
    {
      question: "What are the different forms of Aadhaar and what are their features?",
      answer:
        "The different forms of Aadhaar are Aadhaar Letter, Aadhaar PVC card, eAadhaar and mAadhaar. All forms of Aadhaar are equally valid and acceptable."
    },
    {
      question: "Can I choose to have and use any form of Aadhaar?",
      answer:
        "Yes"
    },
     {
      question: "What is “Order Aadhaar PVC Card” service?",
      answer:
        "“Order Aadhaar PVC Card” is an online service launched by UIDAI which facilitates the Aadhaar holder to get their Aadhaar details printed on PVC card by paying nominal charges."
    },
     {
      question: "What are the security features of “Aadhaar PVC Card”?",
      answer:
        "This card contains security features like:Tamper proof QR Code,Micro text,Ghost image,Issue Date & Print Date,Guilloche Pattern,Embossed Aadhaar Logo."
    },
     {
      question: "What are the charges to be paid for “Aadhaar PVC Card”?",
      answer:
        "Charges to be paid are Rs.75/- (Inclusive of GST & speed post charges)."
    },
     {
      question: "How one can raise the request for “Aadhaar PVC Card”?",
      answer:
        "''Aadhaar PVC Card' request can be raised by visiting the UIDAI Official Website (https://www.uidai.gov.in or https://myaadhaar.uidai.gov.in) or mAadhaar application"
    },
     {
      question: "How to raise request using Registered Mobile Number?",
      answer:
        "Please Visit https://uidai.gov.in or https://myaadhaar.uidai.gov.in/genricPVC.Click on “Order Aadhaar PVC Card” Service.Click on Login, Enter your 12-digit Aadhaar Number (UID).Enter the security code.Click on “Login with OTP” button.Enter OTP received on registered mobile number.Click on 'Order Aadhaar PVC Card' tile.On next screen, select option 'Order Aadhaar PVC Card for Self', preview of the Aadhaar details will appear for verification by Aadhaar number holder before placing the order for Aadhaar PVC Card.Click on the check box against “Terms and Conditions”. (Note: Click on hyper link to see details).Click on “Submit” Button to complete OTP verification.Click on “Make payment”. You will be re-directed to Payment Gateway page with payment options as Credit/Debit Card, Net banking and UPI.After successful payment, receipt will get generated having digital signature which can be downloaded by Aadhaar number holder in PDF format. Aadhaar number holder will also get the Service Request Number via SMS.Aadhaar number holder can track the status of SRN till dispatch of Aadhaar Card on Check Aadhaar Card Status.SMS containing AWB number will also be sent once dispatched from DoP. Aadhaar number holder can further track delivery status by visiting DoP website."
    },
     {
      question: "How to raise request using Non-Registered/Alternate Mobile Number?",
      answer:
        "Please Visit https://uidai.gov.in or https://myaadhaar.uidai.gov.in/genricPVC Click on “Order Aadhaar Card' Service or mAadhaar application Enter your 12 digit Aadhaar Number (UID) or or 28 digits Enrolment ID. Enter the security code Click on check box “If you do not have a registered mobile number, please check in the box”. Please enter Non-Registered / Alternate Mobile Number. Preview will not be available for residents ordering using non-registered mobile number. Rest of the steps for ordering remains the same."
    },
     {
      question: "How to raise request using Non-Registered/Alternate Mobile Number?",
      answer:
        "Please Visit https://uidai.gov.in or https://myaadhaar.uidai.gov.in/genricPVC Click on “Order Aadhaar Card' Service or mAadhaar application Enter your 12 digit Aadhaar Number (UID) or or 28 digits Enrolment ID. Enter the security code Click on check box “If you do not have a registered mobile number, please check in the box”. Please enter Non-Registered / Alternate Mobile Number. Preview will not be available for residents ordering using non-registered mobile number. Rest of the steps for ordering remains the same."
    },
     {
      question: "Which modes are available to make the payment?",
      answer:
        "Presently, following online payment modes are available for making payment:-Credit Card,Debit Card,Net Banking,UPI,PayTM."
    },
     {
      question: "What is SRN?",
      answer:
        "SRN is 14 digits Service Request Number which is generated after raising request for Aadhaar update. It will be generated once you start submitting the request. Till the completion of the transaction 'resume' option shall be available."
    },
     {
      question: "What is AWB number?",
      answer:
        "Airway Bill Number is the tracking number that is generated by DoP i.e. India Speed Post for the assignment/product that they deliver"
    },
     {
      question: "What if residents want to get the Aadhaar PVC Card printed with the details that they want?",
      answer:
        "If residents want some changes in the details of printed Aadhaar letter or PVC Card, then they first have to update their Aadhaar by visiting Permanent Enrolment Center or SSUP portal (depending on update) and then raise the request because this facility can be used to get the hard copy of Aadhaar PVC Card/Letter"
    },
      {
      question: "How many days will it take to receive “Aadhaar PVC Card” after creating successful request?",
      answer:
        "After receiving order for Aadhaar PVC Card from the Aadhaar number holder, UIDAI hands over printed Aadhaar Card to DoP within 5 working days (excluding the date of request). Aadhaar PVC Card is delivered via SPEED POST Service of India Post in line with existing delivery norms to the address registered in aadhaar database. An Aadhaar Number holder may track delivery status using DoP Tracking Services on https://www.indiapost.gov.in/_layouts/15/dop.portal.track."
    }
  ];

const validateSid = (value) => {
  if (!/^S\d{13}$/.test(value)) {
   setSidError(t("srn_invalid"));
  } else {
    setSidError("");
  }
};

const isSidValid = /^S\d{13}$/.test(sid);





const isCaptchaValid =
  captcha.length > 0 &&
  captchaError === "" &&
  captchaData.trxId !== "";

  const canSubmit = isSidValid && isCaptchaValid;

  /* ===============================
     VIRTUAL KEYBOARD
  =============================== */
const handleKeyPress = (key) => {

  // ===== SRN FIELD =====
  if (focusedInput === "sid") {
    let val = sid;

    // If empty, initialize with S
    if (!val) {
      val = "S";
    }

    // Allow only digits after S
    if (/^\d$/.test(key) && val.length < 14) {
      val += key;
    }

    setSid(val);
    validateSid(val);
  }

  // ===== CAPTCHA FIELD =====
  if (focusedInput === "captcha") {
    setCaptcha(captcha + key);
  }
};




const handleBackspace = () => {

  if (focusedInput === "sid") {
    if (sid.length <= 1) {
      // Keep mandatory S
      setSid("S");
      return;
    }

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
    setSid("S");   // Keep S mandatory
    setSidError("");
  }

  if (focusedInput === "captcha") {
    setCaptcha("");
    setCaptchaError("");
  }
};



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
  };


  const playAudio = () => {
    if (!captchaData.audio) return;
    const audio = new Audio(captchaData.audio);
    audio.play();
  };
  const handleSubmit = async () => {
    let valid = true;

    // SRN validation
    if (!sid) {
    setSidError(t("srn_required"));  
      valid = false;
    } else {
      validateSid(sid);
      if (sidError) valid = false;
    }

    // Captcha validation
    if (!captcha) {
  setCaptchaError(t("captcha_required"));
      valid = false;
    } else if (!captchaData.trxId) {
     setCaptchaError(t("captcha_not_loaded"));
      valid = false;
    } else {
      setCaptchaError("");
    }

    if (!valid) return;

    try {
      setLoading(true);   // ✅ START LOADER

      // 🔹 Call your PVC Order Status API here
      // const response = await fetch("/api/UIDAI/pvc-order-status", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify({
      //     srn: sid,
      //     captcha: captcha,
      //     transactionId: captchaData.trxId
      //   })
      // });
      const result = await checkstatusDetail({
        idType : "SRN",              
        captchaValue: captcha,
        captchaTxnId: captchaData.trxId,
        productInfo:"PAIDPVC",
        residentId: sid,
        captchaLogic : "V3"
      });
      
      if (result.success && result.data.Status === "Success") {
        console.log("OTP Resent:", result.data);        
        setOrderData(result.data?.ResponseData.OrderDetails[0]);   // store API response
        setShowResult(true);
        // await loadNewCaptcha();
        // setCaptchaInput("");

      } else {
        setPopupMessage(
          result.data?.errorDetails.messageEnglish || "Failed to resend OTP"
        );
        setShowPopup(true);
      }

      // const data = await response.json();

      // if (data.success) {
      //   setOrderData(data.data);   // store API response
      //   setShowResult(true);       // show result screen
      // } else {
      //   alert(data.message || "Invalid details");
      // }

      // console.log("API Response:", data);

      // alert("Form Submitted Successfully");

    } catch (error) {
      console.error("API Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);   // ✅ STOP LOADER
    }
  };



  /* ===============================
     JSX
  =============================== */
return (
  <div className="full-screen-center-retrive">
    {showPopup && (
        <Popup
          message={popupMessage}
          onClose={() => setShowPopup(false)}
        />
      )}
  <div className="aadhaar-wrapper">
      <div>

        {/* HEADER */}
         <div className="uidai-header-retreive position-relative">
           <div className="uidai-header-left d-flex align-items-center">    
              <span className="ms-3">
{t("check_pvc_order_status_title")}
            </span>
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

            {!showResult ? (

              /* ================= FORM UI ================= */
              <div className="card shadow-sm p-4 position-relative">

                <div className="d-flex justify-content-end align-items-center mb-3">
                  <button
                    className="help-btn"
                    onClick={() => setShowFaqModal(true)}
                  >
                    <span className="help-icon-aadhar-order">?</span>
                  </button>
                </div>

                {/* SRN */}
                <div className="mb-4">
                  <label className="form-label text-muted labelText">
              {t("enter_srn_label")}
                  </label>

                 <input
  type="text"
  className={`simple-input ${sidError ? "is-invalid" : ""}`}
  value={sid}
  maxLength={14}
  onChange={(e) => {
    let val = e.target.value.toUpperCase();

    // Ensure it starts with S
    if (!val.startsWith("S")) {
      val = "S";
    }

    // Keep only digits after S
    val = "S" + val.substring(1).replace(/\D/g, "");

    // Limit to 14 characters total
    val = val.slice(0, 14);

    setSid(val);
    validateSid(val);
  }}
  onFocus={() => {
    setFocusedInput("sid");
    setShowKeyboard(true);
  }}
/>

                  {sidError && (
                    <div className="text-danger small">{sidError}</div>
                  )}
                </div>

                {/* CAPTCHA ROW */}
                <div className="row align-items-center captcha-row">

                  {/* LEFT: Captcha Input */}
                  <div className="col-12 col-md-6 col-lg-6">
                    <div className="mb-3">
                      <label className="form-label text-muted labelText">
                  {t("enter_captcha")}
                      </label>

                      <input
                        type="text"
                        id="captcha"
                        className="simple-input"
                        value={captcha}
                        onChange={(e) => {
                          setCaptcha(e.target.value);
                        }}
                        onFocus={() => {
                          setFocusedInput("captcha");
                          setShowKeyboard(true);
                        }}
                        required
                      />

                      {captchaError && (
                        <div className="text-danger small">
                          {captchaError}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: Captcha Display (UNCHANGED UI) */}
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

                        {/* Image */}
                        <div
                          style={{
                            background: "#fff",
                            padding: "2px",
                            border: "1px solid #ddd",
                            minWidth: "100px",
                            height: "35px",
                            display: "flex",
                            justifyContent: "center"
                          }}
                        >
                          {captchaData.img ? (
                            <img
                              src={captchaData.img}
                              alt="Captcha"
                              style={{
                                display: "block",
                                height: "100%",
                                width: "auto"
                              }}
                            />
                          ) : (
                            <span
                              style={{
                                fontSize: "10px",
                                color: "#666"
                              }}
                            >
                               {t("loading")}
                           
                            </span>
                          )}
                        </div>

                        {/* Audio Button */}
                        <button
                          type="button"
                          className="captcha-btn"
                          onClick={playAudio}
                          disabled={!captchaData.audio}
                     title={t("play_audio_captcha")}
                        >
                          <img src={AudioIcon} alt="Audio" />
                        </button>

                        {/* Refresh Button */}
                        <button
                          type="button"
                          className="captcha-btn"
                          onClick={() => {
                            setCaptcha("");
                            setCaptchaError("");
                            loadNewCaptcha();
                          }}
                    title={t("refresh_captcha")}
                        >
                          <img src={RefreshIcon} alt="Refresh" />
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

            ) : (

              /* ================= RESULT UI ================= */
              <div className="card shadow-sm p-4 position-relative">

                <div className="order-status-card">

                  <div className="status-row">
                 <span>{t("sid")}</span>
                    <strong>{orderData?.Srn}</strong>
                  </div>

                  <div className="status-row">
                  <span>{t("order_date")}</span>
                    <strong>{orderData?.OrderDate?.slice(0,10)}</strong>
                  </div>

                  <div className="status-row">
                   <span>{t("current_status")}</span>
                    <strong>{orderData?.StatusMessageLocal}</strong>
                  </div>

                  <div className="status-row">
                   <span>{t("awb_number")}</span>
                    <strong>{orderData?.Awb || "-"}</strong>
                  </div>

                  <div className="status-row">
             <span>{t("dispatch_date")}</span>
                    <strong>{orderData?.DispatchDate || "-"}</strong>
                  </div>

                </div>

                <button
                  className="btn submit-btn mt-4"
                  onClick={() => {
                    setShowResult(false);
                    setOrderData(null);
                    setSid("");
                    setCaptcha("");
                    loadNewCaptcha();
                  }}
                >
       {t("back")}
                </button>

              </div>

            )}

          </div>
        </div>

        {/* FAQ MODAL */}
        {showFaqModal && (
          <div className="faq-modal-backdrop">
            <div className="faq-modal">
              <div className="faq-modal-header-order">
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

    {/* LOADER */}
    {loading && (
      <div className="loader-overlay">
        <div className="spinner-border text-primary" role="status">
         <span className="visually-hidden">{t("loading")}</span>
        </div>
      </div>
    )}

  </div>
);


}

export default CheckPVCOrderStatus;

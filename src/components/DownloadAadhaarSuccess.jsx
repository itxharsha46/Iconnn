import React, { useState , useEffect} from "react";
import { Link, useNavigate ,useLocation } from "react-router-dom";
import "../style/DownloadSuccess.css";
import VirtualKeyboard from './VirtualKeyboard';
import { useRef } from "react";
import Popup from "../components/Popup";
import { printAadhaar } from "../APIs/printaadhaarAPI";
import mascot from "../assets/Img/mascot.png"
import Printgif from "../assets/print.mp4";
import { useTranslation, Trans } from "react-i18next";


function DownloadAadhaarSuccess() {
const { t } = useTranslation();
  const location = useLocation();
  const aadhaarPdfBase64 = location?.state?.aadhaarPdfBase64;
const [showPassword, setShowPassword] = useState(false);

  const [pdfPassword, setPdfPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);
  const pdfPasswordRef = useRef(null);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
const [userDetails, setUserDetails] = useState({
  name: "",
  dob: ""
});
const navigate = useNavigate(); 
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

const nameRef = useRef(null);
const dobRef = useRef(null);


  
  const handlePrint = async () => {
    if (!pdfPassword) {
      setPopupMessage(t("enter_pdf_password_error"));
      setShowPopup(true);
      return;
    }
    if (pdfPassword.length<7) {
      setPopupMessage(t("invalid_pdf_password"));
      setShowPopup(true);
      return;
    }

    if (!aadhaarPdfBase64) {
   setPopupMessage(t("pdf_not_available"));
      setShowPopup(true);
      return;
    }

    setLoading(true);

    try {
      const res = await printAadhaar({
          base64Pdf: aadhaarPdfBase64,
          password: pdfPassword
        });
      
        console.log(JSON.stringify(res));
        if(res.message == "PDF printed successfully"){
          setPdfPassword(""); // clear password
          setPopupMessage(t("printing_wait"));//no ok button printing GIF
          setShowPopup(true);
          setTimeout(() => {
           setPopupMessage(t("collect_aadhaar")); //Ok button  on click go to home
          }, 30000); // 10 seconds
      }
      else if (res.message == "A4 Printer not available"){
        setPdfPassword(""); // clear password
     setPopupMessage(t("printer_not_available"));
        setShowPopup(true);
      }
      else{
        setPdfPassword(""); // clear password
      setPopupMessage(t("invalid_pdf_or_password"));
        setShowPopup(true);
      }

    } catch (err) {
      setPdfPassword("");
     setPopupMessage(t("pdf_failed"));
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };
  const handleDetailsPrint = async () => {
  setLoading(true);

  try {
    await new Promise(resolve => setTimeout(resolve, 3000));

    const isSuccess = true; // 🔥 change to false to test failure

    if (isSuccess) {
      setPopupMessage(
        "Your Aadhaar card has been printed successfully. Please collect your Aadhaar card."
      );

      setShowDetailsPopup(false); // close modal
      setUserDetails({ name: "", dob: "" });

    } else {
      setPopupMessage("Something went wrong. Please try again.");
    }

    setShowPopup(true);

  } catch (error) {
    setPopupMessage("Something went wrong. Please try again.");
    setShowPopup(true);
  } finally {
    setLoading(false);
  }
};

 const refMap = {
  pdfPassword: pdfPasswordRef,
  name: nameRef,
  dob: dobRef
};


const handleKeyPress = (key) => {
  if (!focusedInput) return;

  switch (focusedInput) {
    case "pdfPassword":
      if (pdfPassword.length < 12)
        setPdfPassword(prev => (prev + key).toUpperCase());
      break;

    case "name":
      setUserDetails(prev => ({
        ...prev,
        name: (prev.name + key).toUpperCase()
      }));
      break;

    case "dob":
      setUserDetails(prev => ({
        ...prev,
        dob: prev.dob + key
      }));
      break;
  }

  refMap[focusedInput]?.current?.focus();
};

const handleBackspace = () => {
  if (!focusedInput) return;

  switch (focusedInput) {
    case "pdfPassword":
      setPdfPassword(prev => prev.slice(0, -1));
      break;

    case "name":
      setUserDetails(prev => ({
        ...prev,
        name: prev.name.slice(0, -1)
      }));
      break;

    case "dob":
      setUserDetails(prev => ({
        ...prev,
        dob: prev.dob.slice(0, -1)
      }));
      break;
  }
};


  const handleClear = () => {
    if (!focusedInput) return;
    switch (focusedInput) {
      case 'pdfPassword': setPdfPassword(""); break;
      default: break;
    }
  };

   useEffect(() => {
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



  return (
    <div className="full-screen-center">
       <div className="container pb-4">
{showPopup && (
  <Popup
    message={
     popupMessage === t("printing_wait")? (
        <div className="text-center">
            <video
            src={Printgif}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: "120px", marginBottom: "15px" }}
          />
          <div>{popupMessage}</div>
        </div>
      ) : (
        popupMessage
      )
    }
     showOkButton={
      popupMessage === t("collect_aadhaar")
    }

   showCloseIcon={
 popupMessage === t("enter_pdf_password_error") ||
popupMessage === t("pdf_not_available")
}


     onClose={() => {
    setShowPopup(false);

    if (popupMessage === "Please collect your Aadhaar card.") {
      navigate("/kiosk-home2");
    }
  }}
  />
)}

    <div className="">
  <div className="uidai-header-left d-flex align-items-center">
    <div
      className={`kiosk-back-circle ${loading ? "disabled-back" : ""}`}
      onClick={() => {
        if (!loading) navigate("/kiosk-home2");
      }}
      aria-label="Go back"
      style={{
        pointerEvents: loading ? "none" : "auto",
        opacity: loading ? 0.5 : 1,
        cursor: loading ? "not-allowed" : "pointer"
      }}
    >
      ⬅
    </div>
  </div>
</div>
      {/* Success Icon */}
      

      {/* Title */}
      
        <div className="row" style={{ height: "15%"}}>
          <div className="col-md-1">
          <div className="success-icon">
            <div className="check-circle" style={{ height: "50px",width: "50px"}}>✓</div>
            </div>
          </div>
          <div className="col-md-8">
            <h4 className="success-title" style={{ marginLeft: "30px",marginTop : "10px"}}>{t("eaadhaar_fetched")}
            </h4>
          </div>
      </div>
  
     
       <div className="info-card container-fluid">
          <div className="row align-items-start">

    {/* Column 1 */}
    <div className="col-md-3 info-col">
      <p className="fw-bold">
       {t("password_info_title")}
      </p>
    </div>

    {/* Column 2 */}
    <div className="col-md-3 info-col">
      <p>
     {t("password_info_desc1")}
      </p>

      <p>
     {t("password_info_desc2")}
      </p>
    </div>

    {/* Column 3 */}
    <div className="col-md-3 info-col">
  <p className="fw-bold">{t("example1")}</p>
    <p>
    <Trans
      i18nKey="example1_text"
      components={{
        1: <strong />,
        3: <strong />,
        5: <strong />
      }}
    />
  </p>
     <p className="fw-bold mt-3">{t("example2")}</p>
    <p>
    <Trans
      i18nKey="example2_text"
      components={{
        1: <strong />,
        3: <strong />,
        5: <strong />
      }}
    />
  </p>
    </div>

    {/* Column 4 (Input + Button) */}
  <div className="col-md-3 d-flex flex-column justify-content-center align-items-start">
      <form autoComplete="off" className="w-100">
     <div className="position-relative w-100 mb-3">
          <input
            type={showPassword ? "text" : "password"}
            id="pdfPassword"
            className="form-control col-md-4 floating-input"
         placeholder={t("enter_pdf_password")}
              autoComplete="new-password"
             value={pdfPassword}
            onChange={(e) => setPdfPassword(e.target.value.toUpperCase())}
            onFocus={() => {
              setFocusedInput("pdfPassword");
              setShowKeyboard(true);
            }}
            maxLength={8}
            // style={{ marginTop: "16px",width: "277px",height : "47px" }}
          />
            <span
    onClick={() => setShowPassword(prev => !prev)}
    style={{
      position: "absolute",
      right: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      fontSize: "18px"
    }}
  >
    {showPassword ? "🙈" : "👁️"}
  </span>

</div>
</form>

          <button
            className="dashboard-btn yellow service-title"
             onClick={handlePrint}
             disabled={loading}
            style={{ marginTop: "15px",width: "150px",marginLeft : "20px" }}
          >
            {loading ? t("processing") : `🖨️ ${t("print")}`}
          </button>
        </div>
        

  </div>
        
      </div>  




      {showDetailsPopup && (
  <div className="faq-modal-backdrop">
    <div className="faq-modal">

<div className="faq-modal-header d-flex justify-content-between align-items-center px-3 py-2">

  {/* LEFT SIDE → Mascot */}
  <div className="d-flex align-items-center">
    <img
      src={mascot}   // adjust path if needed
      alt="Mascot"
      style={{ height: "45px" }}
    />
  </div>

  {/* RIGHT SIDE → Close Button */}
  <button
    className="close-btn"
    onClick={() => setShowDetailsPopup(false)}
  >
    ✕
  </button>

</div>



<div className="faq-modal-body py-4 d-flex flex-column align-items-center">

  {/* Name */}
  <div className="w-75 mb-4">
    <label className="form-label">{t("name")}</label>
   <input
  ref={nameRef}
  type="text"
  className="form-control floating-input"
  value={userDetails.name}
  onFocus={() => {
    setFocusedInput("name");
    setShowKeyboard(true);
  }}
  onChange={(e) =>
    setUserDetails({
      ...userDetails,
      name: e.target.value.toUpperCase()
    })
  }
/>

  </div>

  {/* DOB */}
  <div className="w-75 mb-4">
    <label className="form-label">{t("dob")}</label>
    <input
      type="date"
      className="form-control"
      value={userDetails.dob}
      onChange={(e) =>
        setUserDetails({
          ...userDetails,
          dob: e.target.value
        })
      }
    />
  </div>

  {/* Print */}
  <div className="w-75 text-center">
    <button
      className="dashboard-btn yellow w-100"
     onClick={handleDetailsPrint}

    >
      🖨️{t("print")}
    </button>
  </div>

</div>




    </div>
  </div>
)}
 
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
    {/* <button onClick={testPrintingFlow}>
  Test Printing Popup
</button> */}

    </div>
    
  );
}

export default DownloadAadhaarSuccess;
import React from 'react'
import "../style/MainBody.css";
import phoneImage from "../assets/Img/phone_banner.png";
import qrCode from "../assets/Img/qrCodeAadhar.png";
import fingerPrint from "../assets/Img/fingerPrint.jpg";
import GooglePlay from "../assets/googleplay.svg";
import { useNavigate } from 'react-router-dom';
import Files from "../assets/files.svg";
import FileText from "../assets/file-text.svg";
import FileEarMarkPerson from "../assets/file-earmark-person.svg";
import AppStore from "../assets/app_store.svg";


function MainBody() {
  const navigate = useNavigate();
const openPdf = (fileName) => {
  window.open(`/pdfs/${fileName}`, "_blank");
};


  const handleLoginClick = () => {
    navigate('/login-page');
  };


  return (
    <>
   <section className="main-body">
  <div className="container back-color">
    <div className="row align-items-start">

      
      <div className="col-lg-4 col-md-12 mt-5">
        <img
          src={phoneImage}
          alt="App Screen"
          className="phone-wrapper img-fluid"
        />
      </div>

     
<div className="col-lg-4 col-md-12 text-start mt-5">
  <div className="download-column">
    <div className="download-text">
      <h2>
        Inviting early<br /> adopters to test the <br />Aadhaar app
      </h2>
      <h2 className="mt-4">Download Now!</h2>

      <div className="download-row">
        <img src={qrCode} alt="QR Code" className="qr-img" />

        <div className="store-buttons">
          <img src={GooglePlay} alt="Google Play" className="google_play" />
          <img src={AppStore} alt="App Store" className="app_store" />
        </div>
      </div>

      <p className="feedback mt-4">
        Share feedback at <br />
        feedback.app@uidai.net.in
      </p>
    </div>
  </div>
</div>


    
    <div className="col-lg-4 col-md-12 mt-5 d-flex justify-content-center">
  <div className="login-card">
    <h2 className="login-section__main-heading">Welcome to myAadhaar</h2>

    <img
      src={fingerPrint}
      alt="Fingerprint"
      className="fingerprint img-fluid-finger"
    />

  <button className="login-btn" onClick={handleLoginClick}>
      Login
    </button>

    <p className="login-info">
      Login with Aadhaar and OTP
    </p>
  </div>
</div>


    </div>
  </div>
  <div className="row justify-content-center text-center mt-3">
          {[
            "English", "हिंदी", "বাংলা", "ಕನ್ನಡ", "ગુજરાતી",
            "മലയാളം", "मराठी", "ଓଡ଼ିଆ", "ਪੰਜਾਬੀ",
            "தமிழ்", "తెలుగు", "اردو"
          ].map((lang, index) => (
            <div
              key={index}
              className="col-auto language-item"
            >
              <b>{lang}</b>
            </div>
          ))}
        </div>
</section>

  

      {/* WHITE INFO BAR */}
<div className="container-fluid info-strip">
  <div className="row justify-content-center align-items-center text-center">

    {/* Aadhaar Charges */}
    <div
      className="col-lg-auto col-md-12 info-item"
      onClick={() => openPdf("Aadhar.pdf")}
    >
      <img src={FileEarMarkPerson} className="mr-1 mb-1" />
      Aadhaar Enrolment & Update Charges
    </div>

    <div className="col-auto divider d-none"></div>

    {/* Enrolment Forms */}<div
  className="col-lg-auto col-md-12 info-item"
  onClick={() =>
    window.open(
      "https://uidai.gov.in/en/my-aadhaar/downloads/enrolment-and-update-forms.html",
      "_blank"
    )
  }
>
  <img src={FileText} className="mr-1 mb-1" />
  Enrolment & Update Forms
</div>

    <div className="col-auto divider d-none"></div>

    {/* Supporting Documents */}
    <div
      className="col-lg-auto col-md-12 info-item"
      onClick={() => openPdf("ListSupport.pdf")}
    >
      <img src={Files} className="mr-1 mb-1" />
      List of Supporting Documents for Aadhaar Enrolment & Update
    </div>

  </div>
</div>




      </>
  );
}

export default MainBody
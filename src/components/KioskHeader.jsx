import React from 'react'
import "../style/Header.css"
import govSvg from "../assets/gov.svg";
import aadhar from "../assets/aadhar.svg";
import MyDashboard from "../assets/dashboard_icon.svg";
import LanguageSelector from "../assets/LanguageSelectorIcon.svg";
import arrowDownWhite from "../assets/arrowDownWhite.svg";

function KioskHeader() {
  return (
       <>
        
      <>
         
          
      
         
          <div className="container-fluid blue-header">
            <div className="row  header__bar-content-wrapper py-1 ">
      
       <div className="col-12 col-sm-3 col-md-2 col-lg-2 d-flex justify-content-start align-items-center gap-1">
         <div
            className="d-flex align-items-center gap-1 mr-3"
            onClick={() => setOpen(!open)}
            style={{ cursor: "pointer" }}
          >
            <img src={LanguageSelector} className="header-mydash-logo" />
            <span className="language-text">{t("language")}</span>
            <img
              src={arrowDownWhite}
              className={`arrow-icon ${open ? "rotate" : ""}`}
            />
          </div>
      
         {open && (
                      <div className="dropdown-menu show mt-2">
                        <button className="dropdown-item" onClick={() => changeLanguage("en")}>English</button>
                        <button className="dropdown-item" onClick={() => changeLanguage("hi")}>हिन्दी</button>
                        <button className="dropdown-item" onClick={() => changeLanguage("bn")}>বাংলা</button>
                        <button className="dropdown-item" onClick={() => changeLanguage("kn")}>ಕನ್ನಡ</button>
                        <button className="dropdown-item" onClick={() => changeLanguage("gu")}>ગુજરાતી</button>
                        <button className="dropdown-item" onClick={() => changeLanguage("ml")}>മലയാളം</button>
                        <button className="dropdown-item" onClick={() => changeLanguage("mr")}>मराठी</button>
                        <button className="dropdown-item" onClick={() => changeLanguage("or")}>ଓଡ଼ଆ</button>
                        <button className="dropdown-item" onClick={() => changeLanguage("pa")}>ਪੰਜਾਬੀ</button>
                        <button className="dropdown-item" onClick={() => changeLanguage("ta")}>தமிழ்</button>
                        <button className="dropdown-item" onClick={() => changeLanguage("te")}>తెలుగు</button>
                        <button className="dropdown-item" onClick={() => changeLanguage("ur")}>اردو</button>
                      </div>
                    )}
        </div>
      </div>
      
      
        <div className="col-12 col-sm-6 col-md-8 col-lg-8 text-center"></div>
          <div className="col-12 col-sm-3 col-md-2 col-lg-2 d-flex justify-content-end align-items-center">
        <div className="position-relative language-dropdown mr-3">
      login
      </div>
      
      
      
      
            </div>
          </div>
          <div className="header-divider"></div>
        </>
     
        
         
       </>
   )
}

export default KioskHeader
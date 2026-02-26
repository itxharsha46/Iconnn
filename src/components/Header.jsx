
import React from 'react'
import "../style/Header.css"
import govSvg from "../assets/gov.svg";
import aadhar from "../assets/aadhar.svg";
import MyDashboard from "../assets/dashboard_icon.svg";
import { useTranslation } from "react-i18next";


import { useState } from 'react';


import LanguageSelector from "../assets/LanguageSelectorIcon.svg";
import arrowDownWhite from "../assets/arrowDownWhite.svg";

function Header() {
   const [open, setOpen] = React.useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang); // optional but recommended
    setOpen(false);
  };
return (
  <>
   
    <div className="container-fluid top-header px-0">
  <div className="row py-2 mx-0">
   

        <div className="col-12 col-sm-3 col-md-2 col-lg-2 gov-emblem">
          <img src={govSvg} alt="Gov of India"  />
       
        </div>

      
        <div className="col-12 col-sm-6 col-md-8 col-lg-8 text-center">
          <span className="gov-title">
      Unique Identification Authority of India
          </span>
        </div>

        
        <div className="col-12 col-sm-3 col-md-2 col-lg-2 text-end aadhaar-logo">
         <img
    src={aadhar}
    alt="Aadhaar"
    
  />
        </div>

      
    </div>
    </div>

   
    
    <div className="header-divider"></div>
  </>
);

}

export default Header

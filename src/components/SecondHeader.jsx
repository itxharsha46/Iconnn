import React from 'react'
import "../style/SecondHeader.css"
import secondGovtLogo from "../assets/govtLogoSecond.svg";
import aadhar from "../assets/aadhar.svg";

function SecondHeader() {
  return (
      <>
       
        <div className="container-fluid top-header blue-bottom-line">
          <div className="row py-2">
    
            <div className="col-12 col-sm-3 col-md-2 col-lg-2 gov-emblem">
              <img src={secondGovtLogo} alt="Gov of India"  />
           
            </div>
    
          
            <div className="col-12 col-sm-6 col-md-8 col-lg-8 text-center">
           
            </div>
    
            
            <div className="col-12 col-sm-3 col-md-2 col-lg-2 text-end aadhaar-logo">
             <img
        src={aadhar}
        alt="Aadhaar"
        
      />
            </div>
    
          </div>
        </div>
    
       
        
      </>
  )
}

export default SecondHeader
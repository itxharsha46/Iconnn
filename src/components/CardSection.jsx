import React from 'react'
import { Link } from 'react-router-dom';
// import "../style/CardSection.css";
import DownloadAadhar  from "../assets/download_aadhar.svg";
import RetrieveAadhar from "../assets/retrive_aadhar.svg";
import VerifyEmail from "../assets/verify_email.svg";
import DocumentUpdate from "../assets/document_update.svg";
import VIDGenerator from "../assets/vid_generator.svg";
import LockUnlock from "../assets/lock_unlock.svg";
import BankSeeding from "../assets/bank_seeding.svg";
import OrderAadhar from "../assets/order_aadhar.svg";
import PVCCard from "../assets/aadhar_pvc.svg";
import EnrollmentUpdate from "../assets/enrollmentUpdate.svg";
import DeactiveStatus from "../assets/deactivate_status.svg";
import DeathFamily from "../assets/death_family.svg";
import LocateEnrollment from "../assets/locate_enrollment.svg";
import BookAppointment from "../assets/book_appointment.svg";
import AadharValidity from "../assets/aadharValidity.svg";
import CardArrow from "../assets/arrowRight.svg";


function CardSection() {
  return (
    <div>
        <div className="container my-5">

  <h5 className="text-center  mb-4 services__section">
    Services that require mobile number to be registered with Aadhaar
  </h5>

  <div className="row g-4">

 
    <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
      <Link to="/e-aadhaar-download" className="text-decoration-none">
     <div className="service-card h-100">
  <div className="card-inner">
    <img src={DownloadAadhar} alt="Download Aadhaar" />
    <h6 className='cardHead mt-3'>Download Aadhaar</h6>
    <p className='cardSub'>
      Click here to download digitally signed and password protected
      electronic copy of the Aadhaar.
    </p>
  </div>

  <div className="card-arrow"> <img src={CardArrow} alt="Card Arrow" /></div>
</div>
</Link>
    </div>

  
    <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
      <Link to="/retrieve-aadhaar" className="text-decoration-none">
      <div className="service-card h-100">
        <div className="card-inner">
        <img src={RetrieveAadhar} alt="Retrieve Aadhar" className="retrieve_aadhar" />
        <h6 className='cardHead mt-3'> Retrieve Aadhaar number / EID / SID</h6>
        <p className='cardSub'>
          Click here to find Aadhaar number, Enrollment ID or Service ID.
        </p>
        </div>
      
       <div className="card-arrow"><img src={CardArrow} alt="Card Arrow" /></div>
       </div>
       </Link>
    </div>

    <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
          <Link to="/verify-mobile-email" className="text-decoration-none">
      <div className="service-card h-100">
         <div className="card-inner">
        <img src={VerifyEmail} alt="Verify Email" className="verify_email" />
        <h6 className='cardHead mt-3'>Verify Email / Mobile</h6>
        <p className='cardSub'>
         Click here to verify mobile and email registered with the Aadhaar.
        </p>
        </div>
      
       <div className="card-arrow"> <img src={CardArrow} alt="Card Arrow" /></div>
       </div>
       </Link>
    </div>
    <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
       <Link to="/login-page" className="text-decoration-none">
      <div className="service-card h-100">
            <div className="card-inner">
         <img src={DeathFamily} alt="Report Death" className="report_death" />
        <h6 className='cardHead mt-3'>Report death of a family member</h6>
        <p className='cardSub'>
          Click here to report death of a Family Member for his/her Aadhaar deactivation.
        </p>
        </div>
      
       <div className="card-arrow"><img src={CardArrow} alt="Card Arrow" /></div>
       </div>
       </Link>
    </div>

    <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
          <Link to="/document-update" className="text-decoration-none">
      <div className="service-card h-100">
          <div className="card-inner">
         <img src={DocumentUpdate} alt="Document Update" className="document_update" />
        <h6 className='cardHead mt-3'>Document update</h6>
        <p className='cardSub'>
         Click Here to upload your Proof of Identity (PoI) and Proof of Address (PoA) Documents.<br/>
<span className="text-danger">This service is free of cost till 14/06/2026.</span>
        </p>
      </div>
     
       <div className="card-arrow"> <img src={CardArrow} alt="Card Arrow" /></div>
        </div>
       </Link>
    </div>

    <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
        <Link to="/vid-generator" className="text-decoration-none">
      <div className="service-card h-100">
          <div className="card-inner">
       <img src={VIDGenerator} alt="VID Generator" className="vid_generator" />
        <h6 className='cardHead mt-3'>VID generator</h6>
        <p className='cardSub'>
          Click here to generate 16 Digit Virtual ID(VID) linked to your Aadhaar.
        </p>
      </div>
     
       <div className="card-arrow"><img src={CardArrow} alt="Card Arrow" /></div>
        </div>
       </Link>
    </div>
    <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
      <Link to="/lock-unlock-adhaar" className="text-decoration-none">
      <div className="service-card h-100">
         <div className="card-inner">
          <img src={LockUnlock} alt="Lock_Unlock Aadhar" className="lock_unlock Aadhar" />
        <h6 className='cardHead mt-3'>Lock / Unlock Aadhaar</h6>
        <p className='cardSub'>
          Click here to temporarily lock/unlock your Aadhaar. Please use this service carefully.
        </p>
      </div>
     
      <div className="card-arrow"><img src={CardArrow} alt="Card Arrow" /></div>
       </div>
      </Link>
    </div>
    <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
       <Link to="/login-page" className="text-decoration-none">
      <div className="service-card h-100">
         <div className="card-inner">
       <img src={BankSeeding} alt="Bank Seeding" className="bank_seeding" />
        <h6 className='cardHead mt-3'>Bank seeding status</h6>
        <p className='cardSub'>
          Click here to find your Bank Seeding Status.
        </p>
        </div>
     
      <div className="card-arrow"><img src={CardArrow} alt="Card Arrow" /></div>
       </div>
      </Link>
    </div>



  </div>
</div>

       <div className="container my-5">

  <h5 className="text-center services__section mb-4">
    Services that require mobile number to be registered with Aadhaar
  </h5>

  <div className="row g-4">

 
    <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
       <Link to="/order-aadhaar-pvc" className="text-decoration-none">
      <div className="service-card h-100">
         <div className="card-inner">
       <img src={OrderAadhar} alt="Order Aadhar" className="order_aadhar" />
        <h6 className='cardHead mt-3'>Order Aadhaar PVC card</h6>
        <p className='cardSub'>
          Click here to order a secure, wallet-sized Aadhaar PVC card.
        </p>
        </div>
     
        <div className="card-arrow"><img src={CardArrow} alt="Card Arrow" /></div>
         </div>
      </Link>
    </div> 

  
    <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
       <Link to="/Check-pvc-order-status" className="text-decoration-none">
      <div className="service-card h-100">
         <div className="card-inner">
        <img src={PVCCard} alt="PVC Card Order Status" className="pvc_card" />
        <h6 className='cardHead mt-3'>Check Aadhaar PVC card order status</h6>
        <p className='cardSub'>
          Click here to check the status of the already ordered PVC card.
        </p>
      </div>
      
      <div className="card-arrow"><img src={CardArrow} alt="Card Arrow" /></div>
      </div>
      </Link>
    </div>
    <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
      <div className="service-card h-100">
          <div className="card-inner">
      <img src={EnrollmentUpdate} alt="Enrollment Update" className="enrollment_update" />
        <h6 className='cardHead mt-3'>Check enrolment or update status</h6>
        <p className='cardSub'>
          Click here to check the status of the Enrolment or Update request.
        </p>
      </div>
      
        
         <div className="card-arrow"><img src={CardArrow} alt="Card Arrow" /></div>
         </div>
    </div>
    <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
      <div className="service-card h-100">
        <div className="card-inner">
        <img src={DeactiveStatus} alt="Deactivate Status" className="deactivate_status" />
        <h6 className='cardHead mt-3'>Check deceased Aadhaar deactivation status</h6>
        <p className='cardSub'>
          Click here to check the status of the Deceased Aadhaar Deactivation request.
        </p>
      </div>
      
       <div className="card-arrow"><img src={CardArrow} alt="Card Arrow" /></div>
       </div>
    </div>
    <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
      <div className="service-card h-100">
         <div className="card-inner">
         <img src={LocateEnrollment} alt="Locate Enrollment" className="locate_enrollment" />
        <h6 className='cardHead mt-3'>Locate enrolment center</h6>
        <p className='cardSub'>
          Click here to search and locate nearby Aadhaar Seva Kendras.
        </p>
      </div>
     
       <div className="card-arrow"><img src={CardArrow} alt="Card Arrow" /></div>
        </div>
    </div>
    <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
      <div className="service-card h-100">
         <div className="card-inner">
           <img src={BookAppointment} alt="Book Appointment" className="book_appointment" />
        <h6 className='cardHead mt-3'>Book an appointment</h6>
        <p className='cardSub'>
          Click here to book an Appointment for Enrolment or Update.
        </p>
      </div>
      
      <div className="card-arrow"><img src={CardArrow} alt="Card Arrow" /></div>
      </div>
    </div>
    <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
      <div className="service-card h-100">
         <div className="card-inner">
         <img src={AadharValidity} alt="Aadhar Validity" className="aadhar Validity" />
        <h6 className='cardHead mt-3'>Check Aadhaar validity</h6>
        <p className='cardSub'>
         Click here to validate the status of the Aadhaar.
        </p>
        </div>
      </div>
        <div className="card-arrow"><img src={CardArrow} alt="Card Arrow" /></div>
    </div>
   


  </div>
</div>
</div>
  )
}

export default CardSection
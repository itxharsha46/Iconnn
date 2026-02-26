import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import DownloadAadhar from "../assets/download_aadhar.svg";
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
import ServiceCard from "../components/ServiceCard";
import { IoLogInOutline } from "react-icons/io5";
import Banner1 from "../assets/Img/b1.png";
import Banner2 from "../assets/Img/b2.png";
import Banner3 from "../assets/Img/b3.png";

import React from "react";
import "../style/KioskHome.css";
import AadhaarSets from "../assets/Img/handAadhaar.png";

function KioskHome() {
  const navigate = useNavigate();
   

  const banners = [Banner1, Banner2, Banner3];
  const [currentBanner, setCurrentBanner] = useState(0);

    useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000); // 4 seconds

    return () => clearInterval(interval);
  }, []);


  const services = [
    { title: "Download Aadhaar", img: DownloadAadhar, path: "/e-aadhaar-download" },
    { title: "Retrieve Aadhaar number / EID / SID", img: RetrieveAadhar, path: "/retrieve-aadhaar" },
    { title: "Verify Email / Mobile", img: VerifyEmail, path: "/verify-mobile-email" },
    { title: "Report death of a family member", img: DeathFamily, path: "/login-page" },
    { title: "Document update", img: DocumentUpdate, path: "/document-update" },
    { title: "VID generator", img: VIDGenerator, path: "/vid-generator" },
    { title: "Lock / Unlock Aadhaar", img: LockUnlock, path: "/lock-unlock-adhaar" },
    { title: "Bank seeding status", img: BankSeeding, path: "/login-page" },
    { title: "Order Aadhaar PVC card", img: OrderAadhar, path: "/order-aadhaar-pvc" },
    { title: "Check Aadhaar PVC card order status", img: PVCCard, path: "/Check-pvc-order-status" },
    { title: "Check deceased Aadhaar deactivation status", img: DeactiveStatus, path: "/aadhaar-Deactive-status" },
    // {
    //   title: "Locate enrolment center",
    //   img: LocateEnrollment,
    //   path: "https://bhuvan-app3.nrsc.gov.in/aadhaar/",
    //   external: true
    // },
    { title: "Check Aadhaar validity", img: AadharValidity, path: "/aadhaar-validity" },
    { title: "Book an appointment", img: BookAppointment, path: "/bank-appointment" },
    { title: "Check enrolment or update status", img: EnrollmentUpdate, path: "/Check_enrolment_update_status" }
  ];

  

  return (
    <div className="kiosk-container">

      {/* HEADER */}
    <div className="kiosk-header">
  <div className="kiosk-tagline advanced-tagline">
    <h2>
      <span className="typing-text">Fast, secure </span>
      <span className="highlight">Aadhaar services</span>
      <span className="typing-text"> at your fingertips</span>
    </h2>
    <h1 className="main-tag bounce">My Aadhaar Kiosk</h1>
  </div>

  {/* Language Dropdown */}
 <div className="language-dropdown">
  <button className="language-btn">
    English ▾
  </button>

  <div className="language-menu">
    <button>हिन्दी</button>
    <button>Regional</button>
  </div>
</div>

</div>


      {/* HERO – CAROUSEL */}
<div className="kiosk-hero">
  <div
    className="hero-carousel"
    style={{
      backgroundImage: `url(${banners[currentBanner]})`
    }}
  />
</div>


      {/* SERVICES – ALL CARDS */}
      <div className="kiosk-services">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            title={service.title}
            // imgSrc={service.img}
            onClick={() =>
              service.external
                ? window.open(service.path, "_blank")
                : navigate(service.path)
            }
          />
        ))}
      </div>
{/* <div className="horizontal-line"></div> */}



      {/* INFO SECTION */}
     {/* <footer className="kiosk-info kiosk-footer">

        <div className="info-left">
          <ul className="info-list">
            <li>Over 1,000 Aadhaar updates are processed every minute nationwide.</li>
            <li>More than 50 crore Aadhaar updates have been successfully completed so far.</li>
            <li>Aadhaar is integrated with over 200 government and private services.</li>
          </ul>
        </div>

        <div className="info-right">
          <div className="card-circle">
            <img src={AadhaarSets} alt="Aadhaar Card" />
          </div>
        </div>
      </footer> */}

    </div>
  );
}

export default KioskHome;

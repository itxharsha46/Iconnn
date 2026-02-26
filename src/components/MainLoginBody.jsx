import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/MainLoginBody.css";
import AddressUpdate from "../assets/addressUpdate.svg";
import DownloadAadhaar from "../assets/download_aadhar.svg";
import OrderAadhar from "../assets/order_aadhar.svg";
import DocumentUpdate from "../assets/document_update.svg";
import BankSeeding from "../assets/bank_seeding.svg";
import BiometricLockUnlock from "../assets/biometricLockUnlock.svg";
import VIDGenerator from "../assets/vid_generator.svg";
import DeathFamily from "../assets/death_family.svg";
import offlineKYC from "../assets/offlineEkyc.svg";
import CardArrow from "../assets/arrowRight.svg";
import  UpdateHistory from "../assets/update-history.svg";
import PaymentHistory from "../assets/payment-history.svg";
import AuthHistory from "../assets/auth-history.svg";

function MainLoginBody() {
  const services = [
    {
      title: "Address update",
      desc: "Click here to update the Address of your Aadhaar. For any other update, kindly visit nearest Aadhaar Seva Kendra.",
      icon: AddressUpdate,
    },
    {
      title: "Download Aadhaar",
      desc: "Click here to download digitally signed and password protected electronic copy of the Aadhaar.",
      icon:DownloadAadhaar ,
    },
    {
      title: "Order Aadhaar PVC card",
      desc: "Click here to order a secure, wallet-sized Aadhaar PVC card.",
      icon: OrderAadhar,
    },
    {
      title: "Document update",
      desc: "Click Here to upload your Proof of Identity (PoI) and Proof of Address (PoA) Documents.This service is free of cost till 14/06/2026.",
      icon: DocumentUpdate,
    },
    {
      title: "Bank seeding status",
      desc: "Click here to find your Bank Seeding Status.",
      icon: BankSeeding,
    },
    {
      title: "Lock / Unlock biometrics",
      desc: "Click here to temporarily lock/unlock your biometrics information.",
      icon: BiometricLockUnlock,
    },
    {
      title: "Generate virtual ID",
      desc: "Virtual ID(VID) can be used in-lieu of the Aadhaar number. Click here to download 16 digits random VID.",
      icon: VIDGenerator,
    },
    {
      title: "Report death of family member",
      desc: "Click here to report death of a Family Member for his/her Aadhaar deactivation.",
      icon: DeathFamily,
    },
    {
      title: "Offline eKYC",
      desc: "Click here to access secure and shareable eKYC document, used for offline identification verification.",
      icon: offlineKYC,
    },
  ];

  return (
    <div className="container p-4 main-dashboard">
      <div className="row">
        {/* LEFT SECTION */}
        <div className="col-lg-8 col-md-12 col-sm-12">
          <h4 className="section-title">Services</h4>
          <p className="section-subtitle">
            Following bouquet of online Aadhaar services are available for
            access. Click on the tab to navigate to the service-specific page.
          </p>

          <div className="row g-4">
            {services.map((item) => (
              <div className="col-md-4" key={item.title}>
                <div className="service-card  h-100" role="button">
                 <div className="service-icon">
  <img src={item.icon} alt={item.title} />
</div>

                  <h6 className="cardHead">{item.title}</h6>
                  <p className="service-card__description">{item.desc}</p>
                  <div className="card-arrow"> <img src={CardArrow} alt="Card Arrow" /></div>
                </div>
              </div>
            ))}
               
          </div>
        </div>



{/* RIGHT SECTION */}
<div className="col-lg-4 col-md-12 col-sm-12">
  {/* My online requests card (on top) */}
  <div className="side-card mb-4">
    <div className="side-header">
      My online requests
      <span className="badge bg-primary ms-2">Upgraded</span>
    </div>
    <div className="side-content">
      Your list is presently empty
    </div>
  </div>

  {/* My transaction history card (below) */}
  <div className="side-card">
    <div className="side-header">
      My transaction history
      <span className="badge bg-primary ms-2">Upgraded</span>
    </div>

  <div className="transaction-grid">

      <div className="transaction-item text-center">
        <img src={UpdateHistory} alt="Payment" className="mb-2" />
        Payment history
      </div>
      <div className="transaction-item text-center">
        <img src={PaymentHistory} alt="Auth" className="mb-2" />
        Authentication history
      </div>
      <div className="transaction-item text-center">
        <img src={AuthHistory} alt="Update" className="mb-2" />
        Aadhaar update history
      </div>
    </div>
  </div>
</div>



      </div>
    </div>
  );
}

export default MainLoginBody;

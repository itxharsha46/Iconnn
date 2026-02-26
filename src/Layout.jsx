import LockUnlockForm from "./components/LockUnlockForm";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";

// --- Styles ---
import "./Layout.css";

// --- Import Watermark Image ---
import mascot from "./assets/Img/aadhaar_mascot.png";

// --- Components Imports ---
import Header from "./components/Header";
import MainBody from "./components/MainBody";
import CardSection from "./components/CardSection";
import EAadhaarDownload from "./components/EAadhaarDownload";
import OrderAadhaarPVC from "./components/OrderAadhaarPVC";
import RetrieveAadhaar from "./components/RetrieveAadhaar";
import VerifyEmailMobile from "./components/VerifyEmailMobile";
import CheckPVCOrderStatus from "./components/CheckPVCOrderStatus";
import DocumentUpdate from "./components/DocumentUpdate";
import ReportDeathFamily from "./components/ReportDeathFamily";
import VIDGenerator from "./components/VIDGenerator";
import LockUnlockAadhaar from "./components/LockUnlockAadhaar";
import BankSeedingStatus from "./components/BankSeedingStatus";
import LoginPage from "./components/LoginPage";
import DownloadSuccess from "./components/DownloadAadhaarSuccess";
import VerifySuccess from "./components/verifySuccess";
import MainLoginBody from "./components/MainLoginBody";
import RetriveAadhaarSuccess from "./components/RetrieveSuccess";
import Kioskhome2 from "./components/Kioskhome2";
import AadhaarValidity from "./components/AadhaarValidity";
import BankAppointment from "./components/BankAppointment";
import AadhaarDeactiveStatus from "./components/AadhaarDeactiveStatus";
import VIDGeneratorSuccess from "./components/VIDSuccess";
import Check_enrolment_update_status from "./components/Check_enrolment_update_status";
import TokenGeneration from "./components/TokenGeneration";
import AadhaarValidSuccess from "./components/AadhaarValidSuccess";
import LockUnlockSuccess from "./components/LockUnlockSuccess";
import WelcomeAppointment from "./components/WelcomeAppointment";
import CentreAppointment from "./components/CentreAppointment";
import Grievancefeedback from "./components/Grievancefeedback";
import GrievanceSuccess from "./components/GrievanceSuccess";
import CheckGrievanceFeedbackStatus from "./components/CheckGrievanceFeedbackStatus";
import InitialPage from "./components/InitialPage";


function Layout() {
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = "hidden"; 
    return () => {
      document.body.style.overflow = "hidden";
    };
  }, []);


  const isHomePage = location.pathname === "/kiosk-home2" || location.pathname === "/";

  const hideHeaderRoutes = ["/", "/initial-page", "/kiosk-home2"];
const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="app-layout">
      

      <img 
        src={mascot} 
        alt="" 
        className={`global-watermark ${isHomePage ? 'watermark-hidden' : ''}`} 
      />

   {!shouldHideHeader && <Header />}

      <div className="page-content">
        <Routes>
          <Route path="/" element={<InitialPage />} />
      
          <Route path="/lock-unlock-next-step" element={<LockUnlockForm />} />
          

          <Route path="/kiosk-home2" element={<Kioskhome2 />} />


          <Route
            path="/home"
            element={
              <>
                <MainBody />
                <CardSection />
              </>
            }
          />

          <Route path="/e-aadhaar-download" element={<EAadhaarDownload />} />
          <Route path="/Check-pvc-order-status" element={<CheckPVCOrderStatus />} />
          <Route path="/order-aadhaar-pvc" element={<OrderAadhaarPVC />} />
          <Route path="/retrieve-aadhaar" element={<RetrieveAadhaar />} />
          <Route path="/verify-mobile-email" element={<VerifyEmailMobile />} />
          <Route path="/report-death-family" element={<ReportDeathFamily />} />
          <Route path="/document-update" element={<DocumentUpdate />} />
          <Route path="/vid-generator" element={<VIDGenerator />} />
          <Route path="/lock-unlock-adhaar" element={<LockUnlockAadhaar />} />
          <Route path="/bank-seeding-status" element={<BankSeedingStatus />} />
          <Route path="/login-page" element={<LoginPage />} />
          <Route path="/retrieve-success" element={<RetriveAadhaarSuccess />} />
          <Route path="/verify-success" element={<VerifySuccess />} />
          <Route path="/download-success" element={<DownloadSuccess />} />
          <Route path="/main-login-body" element={<MainLoginBody />} />
          <Route path="/aadhaar-validity" element={<AadhaarValidity />} />
          <Route path="/bank-appointment" element={<BankAppointment />} />
          <Route path="/aadhaar-Deactive-status" element={<AadhaarDeactiveStatus />} />
          <Route path="/vid-success" element={<VIDGeneratorSuccess />} />
          <Route path="/token-generation" element={<TokenGeneration />} />
                  <Route path="/aadhaar-valid-success" element={<AadhaarValidSuccess />} />
                    <Route path="/lock-unlock-success" element={<LockUnlockSuccess />} />
            <Route path="/welcome-appointment" element={<WelcomeAppointment />} />
              <Route path="/centre-appointment" element={<CentreAppointment  />} />
                <Route path="/grievance-feedback" element={<Grievancefeedback  />} />
                  <Route path="/grievance-success" element={<GrievanceSuccess  />} />
                  <Route path="/grievance-feedback-status" element={<CheckGrievanceFeedbackStatus  />} />
                              <Route path="/initial-page" element={<InitialPage  />} />

          <Route
            path="/Check_enrolment_update_status"
            element={<Check_enrolment_update_status />}
          />
        </Routes>
      </div>

      {location.pathname === "/login-page" && (
        <footer className="login-footer">
          Copyright © 2024 Unique Identification Authority of India. All Rights Reserved
        </footer>
      )}
    </div>
  );
}

export default Layout;
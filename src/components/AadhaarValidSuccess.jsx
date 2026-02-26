import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/AadhaarValidSuccess.css";
import { useTranslation } from "react-i18next";

function AadhaarValidSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const uidResponse = location.state?.uidResponse;

  return (
    <div className="success-container">

      <div className="success-card">

        {/* ICON */}
        <div className="success-icon-val">
          ✓
        </div>

        {/* TITLE */}
    <h2 className="aadhaar-number">
  {uidResponse.statusMessageLocal || uidResponse.statusMessage}
</h2>
        <p className="verification-text">
  {t("aadhaar_verification_completed")}
</p>

        {/* DETAILS */}
        <div className="details-box">

          <div className="row-item">
      <span>{t("age_band")}</span>
            <span>{uidResponse.ageBand}</span>
          </div>

          <div className="row-item">
         <span>{t("gender")}</span>
            <span>{uidResponse.gender}</span>
          </div>

          <div className="row-item">
            <span>{t("state")}</span>
            <span>{uidResponse.address}</span>
          </div>

          <div className="row-item">
        <span>{t("mobile")}</span>
            <span>{uidResponse.maskedMobileNumber}</span>
          </div>

          <p className="info-text">
      {t("aadhaar_document_update_required")}
          </p>

        </div>

        {/* BUTTON */}
        <button
          className="dashboard-btn-val"
          onClick={() => navigate("/")}
        >
     {t("go_home")}
        </button>

      </div>

    </div>
  );
}

export default AadhaarValidSuccess;

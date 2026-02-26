import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/Grievancefeedback.css";
import { useTranslation } from "react-i18next";

function GrievanceSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const srnNumber =
    location.state?.srn || "S2045342493000";

  return (
    <div className="full-screen-center">
      <div className="container text-center">

        {/* Success Icon */}
        <div className="mb-4">
          <div className="success-circle-greviance">✔</div>
        </div>

        {/* Success Message */}
      <h5 className="mb-4 text-primary">
  {t("grievanceSuccessMessage", { srn: srnNumber })}
</h5>

        {/* Rating Card */}
        <div className="card shadow-sm p-4 rating-card">
        <h6 className="mb-3">
  {t("shareExperience")}
</h6>

          <div className="rating-icons mb-3">
            <span>😞</span>
            <span>😐</span>
            <span>🙂</span>
            <span>😊</span>
            <span>😁</span>
          </div>

          <textarea
            className="form-control"
        placeholder={t("feedbackPlaceholder")}
            rows="4"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-between mt-4">
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate("/")}
          >
          {t("back")}
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/")}
          >
     {t("next")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GrievanceSuccess;
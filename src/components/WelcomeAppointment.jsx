import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../style/WelcomeAppointment.css";

const WelcomeAppointment = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="welcome-container">

      <h2 className="welcome-title">
        {t("appointment.welcomeTitle")}
      </h2>

      {/* Centre Appointment Card */}
      <div
        className="appointment-card"
        onClick={() => navigate("/centre-appointment")}
      >
        <div className="card-icon">🏢📅</div>
        <h3>{t("appointment.centreAppointment")}</h3>
        <p>
          {t("appointment.centreDescription")}
        </p>
      </div>

      {/* Manage Appointment Section */}
      <div className="manage-section">
        <h3>{t("appointment.manageAppointments")}</h3>
        <p>
          {t("appointment.manageDescription")}
        </p>

        <div className="no-appointment">
          {t("appointment.noAppointments")}
        </div>
      </div>

    </div>
  );
};

export default WelcomeAppointment;
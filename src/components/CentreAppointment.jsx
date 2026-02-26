import React from "react";
import "../style/CentreAppointment.css";
import { useTranslation } from "react-i18next";

const CentreAppointment = () => {
  const { t } = useTranslation();
  return (
    <div className="centre-container">

      {/* SELECT DETAILS CARD */}
      <div className="centre-card">

    <h3>{t("selectDetails")}</h3>

        <select className="centre-input">
       <option>{t("residentIndian")}</option>
        </select>
    <select className="centre-input">
          <option>{t("selectAgeGroup")}</option>
          <option>{t("age0to5")}</option>
          <option>{t("age5to18")}</option>
          <option>{t("age18plus")}</option>
        </select>

        <select className="centre-input">
          <option>{t("selectServiceType")}</option>
          <option>{t("enrollment")}</option>
          <option>{t("update")}</option>
        </select>

        <button className="centre-proceed-btn">
       {t("proceedForCentreSelection")}
        </button>

      </div>

      {/* SEARCH SECTION */}
      <div className="centre-card">

        <h3>{t("searchAadhaarSevaKendra")}</h3>

        <div className="search-box">
          <input
            type="text"
               placeholder={t("pincodeSearch")}
            className="centre-input"
          />
        </div>

        <button className="centre-search-btn">
    {t("searchByPincode")}
        </button>

        <div className="divider">
           <span>{t("or")}</span>
        </div>

             <h4>{t("searchNearbyCentres")}</h4>

        <input
          type="text"
       placeholder={t("enterRange")}
          className="centre-input"
        />

      </div>

    </div>
  );
};

export default CentreAppointment;

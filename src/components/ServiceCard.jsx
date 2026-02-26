import React from "react";
import "../style/KioskHome.css";

function ServiceCard({ title, imgSrc, onClick }) {
  return (
    <div className="service-card split-card" onClick={onClick}>
      {/* <div className="card-left">
        <img src={imgSrc} alt={title} />
      </div> */}

      <div className="card-right">
        <span>{title}</span>
      </div>
    </div>
  );
}

export default ServiceCard;

import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/InitialPage.css";
import MascotVideo from "../assets/InitialVideo.mp4";

function InitialPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/kiosk-home2");
  };

  return (
    <div className="initial-container" onClick={handleClick}>

      <video
        className="background-video"
        src={MascotVideo}
        autoPlay
        loop
        muted
        playsInline
      />

    </div>
  );
}

export default InitialPage;
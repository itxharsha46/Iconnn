
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FingerprintIcon from "../assets/Img/thumbSuccess.jpg"


function RetrieveSuccess() {
  const navigate = useNavigate();
const { t } = useTranslation();
useEffect(() => {
  let timeout;

  const idleTime =
    window.APP_CONFIG?.IDLE_TIMEOUT || 60000;

  const resetTimer = () => {
    // if (loading) return;

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      navigate("/kiosk-home2");
    }, idleTime);
  };

  const events = [
    "mousemove",
    "mousedown",
    "click",
    "scroll",
    "keypress",
    "touchstart"
  ];

  events.forEach(event =>
    window.addEventListener(event, resetTimer)
  );

  resetTimer();

  return () => {
    clearTimeout(timeout);
    events.forEach(event =>
      window.removeEventListener(event, resetTimer)
    );
  };
}, []);

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: '100vh', background: '#ffffff', textAlign: 'center' }}
    >
      <img
        src={FingerprintIcon}
        alt="Success"
        style={{ width: '120px', height: '120px', marginBottom: '30px' }}
      />
<h4 style={{ color: '#1a73e8', fontWeight: '500', marginBottom: '15px' }}>
  {t("aadhaar_sent_message", { aadhaar: "XXXXXXXX0885" })}
</h4>

   <p style={{ color: '#555', fontSize: '16px', marginBottom: '30px' }}>
  {t("check_mobile_message")}
</p>

      <Link
        to="/kiosk-home2"
        className="btn btn-primary"
        style={{ padding: '10px 30px', fontSize: '16px' }}
      >
       {t("go_home")}
      </Link>
    </div>
  );
}

export default RetrieveSuccess;

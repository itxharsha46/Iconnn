// src/APIs/captchaAPI.jsx

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const fetchCaptcha = async () => {
  const transactionUid = uuidv4();

  try {
    const response = await axios.post(
      'http://localhost:86/api/UIDAI/captcha',
      {
        langCode: "en",
        captchaLength: "6",
      captchaType:"2"
      },
      {
        headers: {
          Accept: 'application/json',
          'x-request-id': transactionUid,
          'Content-Type': 'application/json'
        }
      }
    );

    // console.log("RAW API RESPONSE:", response.data);

    return {
      success: true,
      base64: response.data?.imageBase64,
      audioBase64: response.data?.audioBase64,
      transactionId: response.data?.transactionId
    };

  } catch (error) {
    console.error("Captcha API failed", {
      status: error.response?.status,
      data: error.response?.data
    });

    return {
      success: false,
      error: "Captcha service unavailable"
    };
  }
};

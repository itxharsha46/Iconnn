import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const getdeceasedaadhaarstatusbysid = async ({ sid, captchaValue, captchaTxnId}) => {

  try {
    const response = await axios.post(
      "http://localhost:86/api/UIDAI/getdeceasedaadhaarstatusbysid",
       {
        sid :sid,
        captchaValue:captchaValue,
        captchaTxnId:captchaTxnId
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Verify UID Error:", error.response?.data);
    return { success: false, error: "Verify UID Failed" };
  }
};



import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const checkenrolmentStatus = async ({ srn, eid, captchaValue, captchaTxnId }) => {
  const xRequestId = uuidv4();

  try {
    const response = await axios.post(
      "http://localhost:57245/api/UIDAI/aadhaarrequeststatus",
       {
        srn:srn,
        eid:eid,
        captchaValue:captchaValue,
        captchaTxnId: captchaTxnId
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Verify UID Error:", error.response?.data);
    return { success: false, error: "Verify UID Failed" };
  }
};



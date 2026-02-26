import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const validateUIDNumber = async ({ uid, captcha, captchaTxnId }) => {
  const xRequestId = uuidv4();

  try {
    const response = await axios.post(
      "http://localhost:86/api/UIDAI/VerifyUid",
       {
        uid:uid,
        captcha:captcha,
        captchaTxnId:captchaTxnId,
        transactionId: xRequestId
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Verify UID Error:", error.response?.data);
    return { success: false, error: "Verify UID Failed" };
  }
};



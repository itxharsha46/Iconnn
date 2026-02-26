import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const verifyEmailMobile = async ({ aadhaar, captchaInput, captchaTrxId,emailId,mobileNumber ,verificationCode}) => {
  const xRequestId = uuidv4();

  try {
    const response = await axios.post(
      "http://localhost:86/api/UIDAI/verifyemailandmobile",
       {
        uidNumber:aadhaar,
        captcha:captchaInput,
        captchaTxnId:captchaTrxId,
        email:emailId,
        mobileNumber:mobileNumber,
        verificationCode :verificationCode
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Verify UID Error:", error.response?.data);
    return { success: false, error: "Verify UID Failed" };
  }
};



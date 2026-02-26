import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const checkstatusDetail = async ({ idType, captchaValue, captchaTxnId,productInfo,residentId,captchaLogic}) => {
  const xRequestId = uuidv4();

  try {
    const response = await axios.post(
      "http://localhost:86/api/UIDAI/statusDetail",
       {
        idType :idType,
        captchaValue:captchaValue,
        captchaTxnId:captchaTxnId,
        productInfo : productInfo,
        residentId:residentId,        
        captchaLogic:captchaLogic
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Verify UID Error:", error.response?.data);
    return { success: false, error: "Verify UID Failed" };
  }
};



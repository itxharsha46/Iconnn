import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const lockUnockAadhaarNumber = async ({ vidNumber, lockOrUnlock,otp, otpTxnId,name,pincode }) => {
  const xRequestId = uuidv4();

  try {
    const response = await axios.post(
      "http://localhost:86/api/UIDAI/aadhaarlockunlock",
       {
        vidNumber:vidNumber,
        lockOrUnlock:lockOrUnlock,
        otp:otp,
        otpTxnId: otpTxnId,
        name: name,
        pincode :pincode
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Verify UID Error:", error.response?.data);
    return { success: false, error: "Verify UID Failed" };
  }
};



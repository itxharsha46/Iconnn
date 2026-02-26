import axios from "axios";

export const downloadAadhaar = async ({ uid, mask, otp,otpTxnId }) => {

  try {
    const response = await axios.post(
      "http://localhost:86/api/UIDAI/downloadAadhaar",
       {
        uid:uid,
        mask:mask,
        otp:otp,
        otpTxnId: otpTxnId
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Verify UID Error:", error.response?.data);
    return { success: false, error: "Verify UID Failed" };
  }
};



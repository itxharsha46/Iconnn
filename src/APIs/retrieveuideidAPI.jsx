// import axios from "axios";
// export const validateUIDNumber = async ({ uid, captcha, captchaTxnId }) => {
//   try {
//     const response = await axios.post(
//       "http://localhost:86/api/UIDAI/RetrieveUIDId",
//        {
//         mobileNumber:uid,
//         dob:captcha,
//         email:captchaTxnId,
//         name:uid,
//         option:captcha,
//         otp:captchaTxnId,
//         otpTxnId:uid,
//         captchaTxnId:captcha,
//         captcha:captchaTxnId,
//         resendOtp: xRequestId
//       }
//     );

//     return { success: true, data: response.data };
//   } catch (error) {
//     console.error("Verify UID Error:", error.response?.data);
//     return { success: false, error: "Verify UID Failed" };
//   }
// };

import axios from "axios";

export const validateUIDNumber = async (payload) => {
  try {
    const response = await axios.post(
      "http://localhost:86/api/UIDAI/retrieveuideid",
      payload
    );

    return { success: true, data: response.data };

  } catch (error) {
    console.error("Retrieve UID Error:", error.response?.data);
    return { 
      success: false, 
      data: error.response?.data 
    };
  }
};

/***************Dummy for testing****************** */

// export const validateUIDNumber = async (payload) => {
//   console.log("Mock API called with:", payload);

//   // simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   return {
//     success: true,
//     data: {
//       status: "Success",
//       responseData: {
//         otpSent: true,
//         otpTxnId: "MOCK_TXN_12345"
//       }
//     }
//   };
// };



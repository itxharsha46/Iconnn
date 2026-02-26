import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const verifyUid = async ({ uid, captcha, captchaTxnId }) => {
  const xRequestId = uuidv4();

  try {
    const response = await axios.post(
      "http://localhost:86/api/UIDAI/generateotp",
       {
        uidNumber:uid,
        captchaValue:captcha,
        captchaTxnId:captchaTxnId,
        transactionId: xRequestId
      }
      // ,
      // {
      //   headers: {
      //     Accept: "application/json",
      //     "Accept-Language": "en_IN",
      //     appid: "MYAADHAAR",
      //     "x-request-id": xRequestId,
      //     "Content-Type": "application/json"
      //   }
      // }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Verify UID Error:", error.response?.data);
    return { success: false, error: "Verify UID Failed" };
  }
};




// import axios from "axios";
// import { v4 as uuidv4 } from "uuid";

// const USE_DUMMY_UIDAI = true; // 🔥 toggle this later

// export const verifyUid = async ({ uid, captcha, captchaTxnId }) => {
//   const xRequestId = uuidv4();


// if (USE_DUMMY_UIDAI) {
//   const normalizedCaptcha = String(captcha).trim();

//   console.log("DUMMY verifyUid payload:", {
//     uidNumber: uid,
//     captchaTxnId,
//     captchaValue: normalizedCaptcha,
//     transactionId: xRequestId
//   });

//   console.log("RAW captcha:", captcha);
//   console.log("NORMALIZED captcha:", normalizedCaptcha);

//   // simulate network delay
//   await new Promise(res => setTimeout(res, 700));

//   // ❌ FAILURE (invalid captcha)
//   if (normalizedCaptcha !== "1234") {
//     return {
//       success: true,
//       data: {
//         txnId: null,
//         status: "Failure",
//         message:
//           "You have entered an invalid Captcha value! Please try again with the correct Captcha value.",
//         errorCode: "UAS-VAL-CAP-INF-001"
//       }
//     };
//   }


//   return {
//     success: true,
//     data: {
//       txnId: "MYAADHAAR:f3246a03-cff8-4cde-bde0-7ce9c3f49600",
//       status: "Success",
//       message: "OTP generation done successfully",
//       errorCode: null
//     }
//   };
// }



//   try {
//     const response = await axios.post(
//       "http://localhost:86/api/UIDAI/generateotp",
//       {
//         uidNumber: uid,
//         captchaTxnId,
//         captchaValue: captcha,
//         transactionId: xRequestId
//       },
//       {
//         headers: {
//           Accept: "application/json",
//           "Accept-Language": "en_IN",
//           appid: "MYAADHAAR",
//           "x-request-id": xRequestId,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     return { success: true, data: response.data };
//   } catch (error) {
//     console.error("Verify UID Error:", error.response?.data || error.message);
//     return {
//       success: false,
//       error: "Verify UID Failed"
//     };
//   }
// };


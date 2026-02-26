import axios from "axios";

export const printAadhaar = async ({ base64Pdf, password }) => {

  try {
    const response = await axios.post(
      "http://localhost:86/api/UIDAI/printAddhaar",
       {
        Base64Pdf:base64Pdf,
        key:password
      }
    );
    if(response.data.status == "SUCCESS"){
      const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
        <soap12:Envelope 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:xsd="http://www.w3.org/2001/XMLSchema"
          xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
          <soap12:Body>
            <PrintPdfByFileName xmlns="http://tempuri.org/">
              <pdfFileName>${response.data.message}</pdfFileName>
            </PrintPdfByFileName>
          </soap12:Body>
        </soap12:Envelope>`;
        try {
    const response = await fetch("http://localhost:83/printerservice.asmx", {
      method: "POST",
      headers: {
        "Content-Type": "application/soap+xml; charset=utf-8"
      },
      body: soapEnvelope
    });
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const status = xmlDoc.getElementsByTagName("Status")[0]?.textContent;
    const message = xmlDoc.getElementsByTagName("Message")[0]?.textContent;
    return { status, message };

  } catch (error) {
    console.error("SOAP Error:", error);
    return { status: "ERROR", message: "Service call failed" };
  }
    }
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Verify UID Error:", error.response?.data);
    return { success: false, error: "Verify UID Failed" };
  }
};



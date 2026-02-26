import axios from "axios";

export const printTokenReceipt = async ({ name, mobilenumber, reason }) => {
  const soapBody = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <PrintReceipt xmlns="http://tempuri.org/">
        <Name>`+name+`</Name>
        <mobilenumber>`+mobilenumber+`</mobilenumber>
        <reason>`+reason+`</reason>
      </PrintReceipt>
    </soap:Body>
  </soap:Envelope>`;
  try {
    const response = await fetch("http://localhost:83/printerservice.asmx", {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": "http://tempuri.org/PrintReceipt"
      },
      body: soapBody
    });

    const xmlText = await response.text();
    const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");

  const status =
    xmlDoc.getElementsByTagName("Status")[0]?.textContent;

  const message =
    xmlDoc.getElementsByTagName("Message")[0]?.textContent;

  console.log("Status:", status);
  console.log("Message:", message);

    return { success: true, data: message };
  } catch (error) {
    console.error("Verify UID Error:", error.response?.data);
    return { success: false, error: "Verify UID Failed" };
  }
};



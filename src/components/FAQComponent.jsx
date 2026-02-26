import React, { useState } from "react";
import FAQIcon from "../assets/faq-icon.svg";
import ArrowDownIcon from "../assets/ArrowDownBlack.svg?react";

import "../style/FAQComponent.css";

function FAQComponent({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-wrapper">
      {/* Title */}
      <div className="faq-title">
        {/* <img src={FAQIcon} alt="FAQ" /> */}
        {/* <span>Frequently Asked Questions</span> */}
      </div>

 

      {/* FAQ Items */}
      {faqs.map((faq, index) => (
        <div
          className={`faq-box ${openIndex === index ? "active" : ""}`}
          key={index}
        >
          <div
            className="faq-question-row"
            onClick={() => toggleFAQ(index)}
          >
            <span className="faq-question-text">
              {faq.question}
            </span>

            <span
              className={`faq-chevron ${
                openIndex === index ? "rotate" : ""
              }`}
            >
              <ArrowDownIcon className="faq-chevron-svg" />
            </span>
          </div>

          {openIndex === index && (
            <div className="faq-answer">
              {typeof faq.answer === "string"
                ? faq.answer.split("<br/>").map((line, i) => {
                    const urlPattern = /^(https?:\/\/[^\s]+)$/;
                    if (urlPattern.test(line.trim())) {
                      return (
                        <p key={i}>
                          <a
                            href={line.trim()}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {line.trim()}
                          </a>
                        </p>
                      );
                    }

                    const boldKeywords = [
                      "Example",
                      "Name",
                      "Year",
                      "Password",
                    ];
                    const shouldBold = boldKeywords.some((k) =>
                      line.startsWith(k)
                    );

                    return (
                      <p key={i}>
                        {shouldBold ? <b>{line}</b> : line}
                      </p>
                    );
                  })
                : (
                  <>
                    {faq.answer.text.split("<br/>").map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                    <p>
                      <a
                        href={faq.answer.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {faq.answer.link}
                      </a>
                    </p>
                  </>
                )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default FAQComponent;

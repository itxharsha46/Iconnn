import React, { useState } from "react";
import "../style/VirtualKeyboard.css";

const NUMBERS = ["1","2","3","4","5","6","7","8","9","0"];
const ALPHABETS = [
  "q","w","e","r","t","y","u","i","o","p",
  "a","s","d","f","g","h","j","k","l",
  "z","x","c","v","b","n","m"
];
const SPECIALS = ["@","#","$","%","&","*","!","?","+","-","=","/"];

function VirtualKeyboard({ visible, onKeyPress, onBackspace, onClear, onClose,keyboardType = "full" }) {
  const [isUpperCase, setIsUpperCase] = useState(false);
  const numericLayout = [
  ["1","2","3"],
  ["4","5","6"],
  ["7","8","9"],
  ["0"]
];

  const alpha = [
    ["q","w","e","r","t","y","u","i","o","p"],
    ["a","s","d","f","g","h","j","k","l"],
    ["z","x","c","v","b","n","m"]
  ];

return (
<div
  className={`vk-chromeos ${visible ? "show" : ""} ${
    keyboardType === "numeric" ? "otp-mode" : ""
  }`}
>

    {/* ✅ NUMERIC ONLY MODE (For OTP) */}
    {keyboardType === "numeric" ? (
      <>
        {numericLayout.map((row, i) => (
          <div className="vk-row" key={i}>
            {row.map(k => (
              <button key={k} onClick={() => onKeyPress(k)}>
                {k}
              </button>
            ))}
          </div>
        ))}

        <div className="vk-row actions">
          <button className="wide backspace" onClick={onBackspace}>
            ⌫
          </button>
          <button className="wide clear" onClick={onClear}>
            Clear
          </button>
          <button className="wide close" onClick={onClose}>
            ✕
          </button>
        </div>
      </>
    ) : (
      <>
        {/* 🔹 YOUR EXISTING FULL KEYBOARD */}

        <div className="vk-row numbers">
          {["1","2","3","4","5","6","7","8","9","0"].map(k => (
            <button key={k} onClick={() => onKeyPress(k)}>{k}</button>
          ))}
        </div>

        {alpha.map((row, i) => (
          <div className="vk-row" key={i}>
            {row.map(k => {
              const key = isUpperCase ? k.toUpperCase() : k;
              return (
                <button key={k} onClick={() => onKeyPress(key)}>
                  {key}
                </button>
              );
            })}
            {i === 0 && (
              <button className="wide backspace" onClick={onBackspace}>
                ⌫
              </button>
            )}
            {i === 1 && (
              <button className="wide enter" onClick={() => onKeyPress("\n")}>
                ↵
              </button>
            )}
          </div>
        ))}

        <div className="vk-row actions">
          <button className="wide" onClick={() => setIsUpperCase(!isUpperCase)}>⇧</button>
          <button className="space" onClick={() => onKeyPress(" ")}>
            Space
          </button>
          <button onClick={() => onKeyPress(",")}>,</button>
          <button onClick={() => onKeyPress(".")}>.</button>
          <button className="clear" onClick={onClose}>✕</button>
        </div>
      </>
    )}

  </div>
);
}


export default VirtualKeyboard;

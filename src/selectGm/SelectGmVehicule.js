import React, { useEffect, useState } from "react";
import "./SelectGm.css";

function SelectGmVehicule({ active, options, onSelect, ...props }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [show, setShow] = useState(false);
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShow(false);
    onSelect(option);
  };
   return (
    <div
      tabIndex={1}
      className="sl-container"
      onBlur={() => setShow(false)}
      onClick={() => setShow(!show)}
    >
      <span
        className={`sl-value ${active === "invalid" ? "Annuler" : "Accepter"}`}
      >
        {selectedOption ? selectedOption.label : props.placeholder}
      </span>

      <div className="sl-caret"></div>
      <ul className={`sl-options ${show ? "show" : ""}`}>
        {options?.map((option, i) => (
          <li
            key={i}
            className={option === selectedOption ? "selected" : ""}
            onClick={() => handleOptionClick(option)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SelectGmVehicule;

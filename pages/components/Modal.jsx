import React, { useState } from "react";

const Modal = ({ onClose, apiKey }) => {
  const [key, setKey] = useState(null);

  const handleChange = (e) => {
    setKey(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem("apiKey", key);
    process.env.API_KEY = key;
    onClose(key);
  };

  return (
    <div id="modal" style={{display: "black", background: "blue"}}>
      <h2>Enter your API key</h2>
      <input
        type="text"
        placeholder="API Key"
        value={key}
        onChange={handleChange}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Modal;
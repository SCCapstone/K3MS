import React, { useState, useEffect } from "react";
import './confirm-alert.css';

const ConfirmAlert = ({ mssg, onConfirm, onCancel }) => {
  const [show, setShow] = useState(true);

  if (!show) return null;
  return (
    <div className="confirmAlertContainer">
      <div className="confirmAlert">
        <h1>Confirm</h1>
        <p>{ mssg }</p>
        <div className="confirmAlertButtons">
          <button className="confirmAlertButton" onClick={ onConfirm }>Yes</button>
          <button className="confirmAlertButton" onClick={ onCancel }>No</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmAlert;
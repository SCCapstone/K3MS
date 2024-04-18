import React, { useState, useEffect } from "react";
import './confirm-alert.css';

const ConfirmAlert = ({ mssg, setMssg, onConfirm, onCancel }) => {

  if (mssg === '') {
    return null;
  }

  const onClickConfirm = () => {
    setMssg('');
    onConfirm();
  }
  const onClickCancel = () => {
    setMssg('');
    onCancel();
  }

  return (
    <div className="confirmAlertContainer">
      <div className="confirmAlert">
        <h1>Confirm</h1>
        <p>{ mssg }</p>
        <div className="confirmAlertButtons">
          <button className="confirmAlertButton" onClick={ onClickConfirm }>Yes</button>
          <button className="confirmAlertButton" onClick={ onClickCancel }>No</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmAlert;
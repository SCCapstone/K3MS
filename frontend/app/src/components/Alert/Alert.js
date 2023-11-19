import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import './alert.css';

const Alert = () => {
  const location = useLocation();

  const [mssg, setMssg] = useState(location.state?.mssg || '')
  const [status, setStatus] = useState(location.state?.status || '')

  const onClick = () => {
    setMssg('');
    window.history.replaceState({}, document.title)
  };

  return (
    <>
    { mssg && 
      <div className={ `alert ${status}`  }>
        <span className="closebtn" onClick={ onClick }>&times;</span>
        { mssg }
      </div>
    }
    </>
  );
}

export default Alert;
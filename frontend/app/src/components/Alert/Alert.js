import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './alert.css';

const Alert = () => {
  const location = useLocation();

  const [mssg, setMssg] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    setMssg(location.state?.mssg)
    setStatus(location.state?.status)

    window.history.replaceState({}, document.title)

    setTimeout(() => {
      setMssg('');
    }, 3000); // 3000 ms = 3s
  }, [location.state]);

  const onClick = () => {
    setMssg('');
    window.history.replaceState({}, document.title)
  };

  return (
    <>
    <div className={ `alert ${status}` } style={ mssg ? {} : {display: "none"} }>
      <span className="closebtn" onClick={ onClick }>&times;</span>
      { mssg }
    </div>
    </>
  );
}

export default Alert;
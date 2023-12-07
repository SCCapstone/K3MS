import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './alert.css';

const Alert = () => {
  const location = useLocation();

  const [mssg, setMssg] = useState(location.state?.mssg || '')
  const [status] = useState(location.state?.status || '')

  useEffect(() => {
    window.history.replaceState({}, document.title)
    setTimeout(() => {
      setMssg('');
    }, 3000); // 3000 ms = 3s
  }, []);

  const onClick = () => {
    setMssg('');
    window.history.replaceState({}, document.title)
  };

  return (
    <>
    { mssg &&
      <div className={ `alert ${status}` }>
        <span className="closebtn" onClick={ onClick }>&times;</span>
        { mssg }
      </div>
    }
    </>
  );
}

export default Alert;
import React, { useState, useEffect } from 'react';
import { EVAL_UPLOAD_URL } from '../../config';
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from "react-router-dom";
import Alert from '../../components/Alert/Alert'
import './evalupload.css';

function EvalUpload() {
  const navigate = useNavigate()
  
  const [file, setFile] = useState()

  function handleChange(event) {
    setFile(event.target.files[0])
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);

    try {
      const response = await fetch(EVAL_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      if(!response.ok) {
        throw new Error('HTTP error! Status: ${response.status}');
      }

      const responseData = await response.json();
      console.log(responseData);

    } catch (error) {
      console.error('Fetch error: ', error.message);
    }

    navigate('/research-info', { state: { mssg: 'Evallication Uploaded', status: 'ok' }})

  }

  return (
    <div className="evalupload-container">
      <h1 className="evaluploadPageHeader">Upload Student Evaluations Form</h1>
      <section className="EvalUpload">
        <form onSubmit={handleSubmit} className="evalupload-form">
          <h2 className="evalupload-form-heading">Upload CSV File</h2>
          <input type="file" onChange={handleChange} className="evalupload-form-input" />
          <button type="submit" className="evalupload-form-button">Upload</button>
        </form>
      </section>
    </div>
  );


}

export default EvalUpload;

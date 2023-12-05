import React, { useState, useEffect } from 'react';
import { EVAL_UPLOAD_URL } from '../../config';
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from "react-router-dom";
import Alert from '../../components/Alert/Alert'
import './evalupload.css';

function EvalUpload() {

  const { user, userDispatch } = useAuthContext()
  
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { mssg: 'Must be Logged In', status: 'error'}})
    }
  }, [user, navigate]);

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
        credentials: 'include',
        body: formData,
      });

      if(!response.ok) {
        throw new Error('HTTP error! Status: ${response.status}');
      }

      const responseData = await response.json();
      navigate('/student-evals', { state: { mssg: 'Evaluation Uploaded', status: 'ok' }})

    } catch (error) {
      console.error('Fetch error: ', error.message);
    }
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

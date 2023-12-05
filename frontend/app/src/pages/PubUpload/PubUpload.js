import React, { useState, useEffect } from 'react';
import { PUB_UPLOAD_URL } from '../../config';
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from "react-router-dom";
import Alert from '../../components/Alert/Alert'
import './pubupload.css';

function PubUpload() {
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
      const response = await fetch(PUB_UPLOAD_URL, {
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

    navigate('/research-info', { state: { mssg: 'Publication Uploaded', status: 'ok' }})

  }

  return (
    <div className="pubupload-container">
      <h1 className="pubuploadPageHeader">Upload Publication Form</h1>
      <section className="PubUpload">
        <form onSubmit={handleSubmit} className="pubupload-form">
          <h2 className="pubupload-form-heading">Upload CSV File</h2>
          <input type="file" onChange={handleChange} className="pubupload-form-input" />
          <button type="submit" className="pubupload-form-button">Upload</button>
        </form>
      </section>
    </div>
  );


}

export default PubUpload;

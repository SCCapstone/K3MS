import React, { useState, useEffect } from 'react';
import { EVAL_UPLOAD_URL } from '../../config';
import { useAuthContext } from '../../hooks/useAuthContext'
import { useStudentEvalsContext } from '../../hooks/useStudentEvalsContext';
import { useCourseAnalyticsContext } from '../../hooks/useCourseAnalyticsContext';
import { useDashboardContext } from '../../hooks/useDashboardContext';
import { useTeamAssessmentsContext } from '../../hooks/useTeamAssessmentsContext';
import { useNavigate } from "react-router-dom";
import './evalupload.css';

function EvalUpload() {

  const { user } = useAuthContext()
  const { studentEvalsDispatch } = useStudentEvalsContext()
  const { courseAnalyticsDispatch } = useCourseAnalyticsContext()
  const { dashboardDispatch } = useDashboardContext()
  const { teamAssessmentsDispatch } = useTeamAssessmentsContext()

  
  const navigate = useNavigate()

  const [error, setError] = useState(null);

  // Don't allow non-logged in users or non-chairs to access this page
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { mssg: 'Must be Logged In', status: 'error'}})
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.position !== 'chair') {
      let redirect = user ? '/dashboard' : '/login'
      navigate(redirect, { 
        state: { 
          mssg: 'You do not have access to this page - this incident will be reported', 
          status: 'error'
        }
      })
    }
  }, [user, navigate]);

  const [file, setFile] = useState()

  function handleChange(event) {
    setFile(event.target.files[0])
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setError('No file selected')
      return
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);

    try {
      const response = await fetch(EVAL_UPLOAD_URL, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const json = await response.json();

      if(!response.ok) {
        if (json.error) {
          setError(`Error uploading file - ${json.error}`)
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (response.ok) {
        setError(null)

        // Clear all eval-related data
        studentEvalsDispatch({type: 'CLEAR_DATA'})
        courseAnalyticsDispatch({type: 'CLEAR_DATA'})
        dashboardDispatch({type: 'CLEAR_DATA'})
        teamAssessmentsDispatch({type: 'CLEAR_DATA'})

        navigate('/student-evals', { state: { mssg: 'Evaluation Uploaded', status: 'ok' }})
      }
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
        {error && <div className="errorField">{ error }</div>}
      </section>
    </div>
  );


}

export default EvalUpload;

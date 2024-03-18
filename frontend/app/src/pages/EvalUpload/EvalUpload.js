import React, { useState, useEffect } from 'react';
import { EVAL_UPLOAD_URL, EVAL_OVERWRITE_URL } from '../../config';
import { useAuthContext } from '../../hooks/useAuthContext'
import { useStudentEvalsContext } from '../../hooks/useStudentEvalsContext';
import { useCourseAnalyticsContext } from '../../hooks/useCourseAnalyticsContext';
import { useDashboardContext } from '../../hooks/useDashboardContext';
import { useTeamAssessmentsContext } from '../../hooks/useTeamAssessmentsContext';
import { useNavigate } from "react-router-dom";
import './evalupload.css';

function EvalUpload() {
  
  const navigate = useNavigate()

  const { user } = useAuthContext()
  const { studentEvalsDispatch } = useStudentEvalsContext()
  const { courseAnalyticsDispatch } = useCourseAnalyticsContext()
  const { dashboardDispatch } = useDashboardContext()
  const { teamAssessmentsDispatch } = useTeamAssessmentsContext()

  const [file, setFile] = useState()
  const [error, setError] = useState(null);
  const [evalProcessing, setEvalProcessing] = useState(false)
  const [skippedRows, setSkippedRows] = useState(null)
  const [overwriteError, setOverwriteError] = useState(null)


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


  function handleChange(event) {
    setFile(event.target.files[0])
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (evalProcessing) {
      setError('Evaluation is currently being processed')
      return
    }
    if (skippedRows) {
      setError('Please confirm or ignore skipped rows')
      return
    }

    if (!file) {
      setError('No file selected')
      return
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);

    try {
      setEvalProcessing(true)
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
        setEvalProcessing(false)

        // Clear all eval-related data
        studentEvalsDispatch({type: 'CLEAR_DATA'})
        courseAnalyticsDispatch({type: 'CLEAR_DATA'})
        dashboardDispatch({type: 'CLEAR_DATA'})
        teamAssessmentsDispatch({type: 'CLEAR_DATA'})

        if (json.skipped_rows && json.skipped_rows.length > 0) {
          console.log(json.skipped_rows)
          setSkippedRows(json.skipped_rows.map(row => ({...row, checked: false, enabled: row.reason === 'This entry already exists in the database'})))
        }
        else {
          navigate('/student-evals', { state: { mssg: 'Evaluation Uploaded', status: 'ok' }})
        }
      }
    } catch (error) {
      console.error('Fetch error: ', error.message);
    }
  }

  const toggleCheckbox = (index) => {
    let newSkippedRows = [...skippedRows]
    newSkippedRows[index].checked = !newSkippedRows[index].checked
    setSkippedRows(newSkippedRows)
    setOverwriteError(null)
  }
  const selectAllCheckboxes = (e) => {
    setSkippedRows((prevState) => (
      prevState.map(row => ({...row, checked: row.enabled ? e.target.checked : false})
    )))
    setOverwriteError(null)
  }
  const overwriteNone = () => {
    // send request with empty list
    setSkippedRows(null)
    setError(null)
    setOverwriteError(null)
    const sendRequest = async () => {
      const response = await fetch(EVAL_OVERWRITE_URL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rows: [] })
      });
      if (!response.ok) {
        const json = await response.json()
        setOverwriteError(json?.error)
      }
      else {
        navigate('/student-evals', { state: { mssg: 'Evaluation Uploaded - No Data Overwritten', status: 'ok' }})
      }
    }
    sendRequest()
  }
  const confirmOverwrite = () => {
    // show button to confirm overwrite
    if (skippedRows.filter(row => row.checked).length === 0) {
      setOverwriteError('No rows selected to overwrite')
      return
    }
    const response = window.confirm("Are you sure you want to overwrite the selected rows?");
    if (response) {
      // send request with list of rows to overwrite
      const sendRequest = async () => {
        const postResponse = await fetch(EVAL_OVERWRITE_URL, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ rows: skippedRows.filter(row => row.checked) })
        })
        if (!postResponse.ok) {
          const json = await postResponse.json()
          setOverwriteError(json?.error)
        }
        else {
          setSkippedRows(null)
          setOverwriteError(null)
          navigate('/student-evals', { state: { mssg: 'Evaluation Uploaded - Data Overwritten', status: 'ok' }})
        }
      }
      sendRequest()
    }
  }

  return (
    <div>
      <div className="evalupload-container">
        <h1 className="evaluploadPageHeader">Upload Student Evaluations Form</h1>
        <section className="EvalUpload">
          <form onSubmit={handleSubmit} className="evalupload-form">
            <h2 className="evalupload-form-heading">Upload CSV File</h2>
            <input type="file" onChange={handleChange} className="evalupload-form-input" />
            <button type="submit" className="evalupload-form-button">Upload</button>
          </form>
          {error && <div className="errorField">{ error }</div>}
          {evalProcessing && <div>Processing...</div>}
        </section>
      </div>
      { skippedRows && 
        <div className="evalupload-skippedrows">
            <h2>Skipped {skippedRows.length} rows</h2>
            <p>Select rows to overwrite current data or ignore these rows</p>
            <div classname='evalupload-SkippedRowsTable'>
              <table>
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>Course</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Section</th>
                    <th>Reason</th>
                    <th>Overwrite?</th>
                  </tr>
                </thead>
                <tbody>
                  {skippedRows.map((row, index) => {
                    return (
                      <tr key={index}>
                        <td>{row?.row_index}</td>
                        <td>{row?.course}</td>
                        <td>{row?.email}</td>
                        <td>{row?.first_name} {row?.last_name}</td>
                        <td>{row?.semester} {row?.year} {row?.section}</td>
                        <td>{row.reason}</td>
                        <td>
                          { row.enabled ?
                            <input
                              type="checkbox"
                              checked={row.checked}
                              onChange={ () => toggleCheckbox(index) }
                            />
                          : <input
                              type="checkbox"
                              checked={row.checked}
                              onChange={ () => toggleCheckbox(index) }
                              disabled
                          />
                          }
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div>
              <div>
                <label>Select All</label>
                <input type='checkbox' onChange={ (e) => selectAllCheckboxes(e) } />
              </div>
              { overwriteError && <div className="errorField">{ overwriteError }</div> }
              <button onClick={ overwriteNone }>Overwrite None</button>
              <button onClick={ confirmOverwrite }>Overwrite Selected</button>
            </div>
        </div>
      }
    </div>
  );


}

export default EvalUpload;

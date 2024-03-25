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
  const [skippedRowsOverwrite, setSkippedRowsOverwrite] = useState(null)
  const [skippedRowsOther, setSkippedRowsOther] = useState(null)
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
    if (skippedRowsOverwrite) {
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
      setError(null)
      setEvalProcessing(true)
      const response = await fetch(EVAL_UPLOAD_URL, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const json = await response.json();

      if(!response.ok) {
        setEvalProcessing(false)
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
          // setSkippedRowsOverwrite(json.skipped_rows.map(row => ({...row, checked: false, enabled: row.reason === 'This entry already exists in the database'})))
          setSkippedRowsOverwrite(json.skipped_rows.filter(row => row.reason === 'This entry already exists in the database'))
          setSkippedRowsOther(json.skipped_rows.filter(row => row.reason !== 'This entry already exists in the database'))
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
    let newskippedRowsOverwrite = [...skippedRowsOverwrite]
    newskippedRowsOverwrite[index].checked = !newskippedRowsOverwrite[index].checked
    setSkippedRowsOverwrite(newskippedRowsOverwrite)
    setOverwriteError(null)
  }
  const selectAllCheckboxes = (e) => {
    setSkippedRowsOverwrite((prevState) => (
      // prevState.map(row => ({...row, checked: row.enabled ? e.target.checked : false})
      prevState.map(row => ({...row, checked: e.target.checked})
    )))
    setOverwriteError(null)
  }
  const overwriteNone = () => {
    // send request with empty list
    setSkippedRowsOverwrite(null)
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
    if (skippedRowsOverwrite.filter(row => row.checked).length === 0) {
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
          body: JSON.stringify({ rows: skippedRowsOverwrite.filter(row => row.checked) })
        })
        if (!postResponse.ok) {
          const json = await postResponse.json()
          setOverwriteError(json?.error)
        }
        else {
          setSkippedRowsOverwrite(null)
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
      { (skippedRowsOverwrite || skippedRowsOther) && 
        <div className="evalupload_skippedRowsAll">
          <h1>Some Rows Were Skipped</h1>
          { (skippedRowsOverwrite?.length) > 0 &&
            <div className="evalupload_skippedRows">
                <h2>{skippedRowsOverwrite.length} Rows Already Exist</h2>
                <p><b>Select rows to overwrite current data or ignore these rows</b></p>
                <div className='evalupload_skippedRowsButtonsSelect'>
                  <label>Select All</label>
                  <input type='checkbox' onChange={ (e) => selectAllCheckboxes(e) } />
                </div>
                <div className='evalupload_skippedRowsTable'>
                  <table>
                    <thead>
                      <tr>
                        <th>Row</th>
                        <th>Course</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Section</th>
                        <th>Overwrite?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {skippedRowsOverwrite.map((row, index) => {
                        return (
                          <tr key={index}>
                            <td>{row.row_index + 1}</td>
                            <td>{row.course}</td>
                            <td>{row.email}</td>
                            <td>{row.first_name} {row.last_name}</td>
                            <td>{row.semester} {row.year} {row.section}</td>
                            <td>
                              <input
                                type="checkbox"
                                checked={ row.checked }
                                onChange={ () => toggleCheckbox(index) }
                              />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                { overwriteError && <div className="errorField">{ overwriteError }</div> }
                <div className='evalupload_skippedRowsButtons'>
                  <button onClick={ overwriteNone }>Ignore All</button>
                  <button onClick={ confirmOverwrite }>Overwrite Selected</button>
                </div>
            </div>
          }
          { (skippedRowsOther?.length > 0) &&
            <div className="evalupload_skippedRows">
                <h2>{skippedRowsOther.length} Rows Were Skipped For Various Reasons</h2>
                <p><b>Create users or fill in missing fields to resolve </b></p>
                <div className='evalupload_skippedRowsTable'>
                  <table>
                    <thead>
                      <tr>
                        <th>Row</th>
                        <th>Course</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Section</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {skippedRowsOther.map((row, index) => {
                        return (
                          <tr key={index}>
                            <td>{row.row_index + 1}</td>
                            <td>{row.course ? row.course : 'Unkown'}</td>
                            <td>{row.email ? row.email : 'Unkown'}</td>
                            <td>{(row.first_name && row.last_name) ? `${row.first_name} ${row.last_name}` : 'Unkown'}</td>
                            <td>{(row.semester && row.year && row.section) ? `${row.semester} ${row.year} ${row.section}` : 'Unkown'}</td>
                            <td>{row.reason}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className='evalupload_skippedRowsButtons evalupload_otherButton'>
                  <button onClick={ () => { 
                    if (skippedRowsOverwrite?.length > 0) {
                      setOverwriteError('Please confirm or ignore skipped rows')
                    }
                    else{
                      navigate('/student-evals', { state: { mssg: 'Evaluation Uploaded', status: 'ok' }})
                    }
                  }}>Ok</button>
                </div>
            </div>
          }
        </div>
      }
    </div>
  );


}

export default EvalUpload;

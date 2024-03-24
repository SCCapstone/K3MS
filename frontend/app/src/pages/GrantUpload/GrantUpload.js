import React, { useState, useEffect } from 'react';
import { GRANT_UPLOAD_URL, GRANTS_URL } from '../../config';
import { useAuthContext } from '../../hooks/useAuthContext'
import { useResearchInfoContext } from '../../hooks/useResearchInfoContext';
import { useNavigate } from "react-router-dom";
import Alert from '../../components/Alert/Alert'
import './grantupload.css';

const GrantUpload = () => {
  const navigate = useNavigate()

  const { user, userDispatch } = useAuthContext()
  const { grants, researchInfoDispatch } = useResearchInfoContext()


  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { mssg: 'Must be Logged In', status: 'error'}})
    }
  }, [user, navigate]);

  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [year, setYear] = useState('')


  const grantupload = async (e) => {
    e.preventDefault()

    const response = await fetch(GRANT_UPLOAD_URL, {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        title: title,
        amount: amount,
        year: year
      })
    })

    const json = await response.json()
    if (!response.ok) {
      setError(json.error)
      if (json.empty_fields)
        setEmptyFields(json.empty_fields)
    }

    if (response.ok) {
      setError(null)
      setEmptyFields([])
      setTitle('')
      setAmount('')
      setYear('')

      // Fetch grants if not already fetched
      if (!grants) {
        const fetchGrants = async () => {
          const response = await fetch(GRANTS_URL, {
            method: 'GET',
            credentials: 'include'
          })
    
          const data = await response.json()
          console.log(data)
          if (response.ok) {
            researchInfoDispatch({type: 'SET_GRANTS', payload: data})
          }
        }
        fetchGrants()
      }
      else {
        // Update grants
        researchInfoDispatch({ type: 'UPDATE_GRANTS', payload: json })
      }

      // Navigate to grants page
      navigate('/research-info?page=grants', { state: { mssg: 'Grant Uploaded', status: 'ok' }})
    }
  };

  return (
    <>
      <Alert />
      <h1 className="grantuploadPageHeader">Upload Grant Form</h1>
      <section className="grantuploadCard">
        <h1>Grant Information</h1>
        <form className="grantupload" onSubmit={ grantupload }>
            <input 
              type="text" 
              onChange={(e) => setTitle(e.target.value)} 
              value={ title } 
              placeholder="Title"
              className={ emptyFields.includes('text') ? 'errorField' : '' }
            />
            <input 
              type="number" 
              onChange={(e) => setAmount(e.target.value)} 
              value={ amount } 
              placeholder="Amount"
              className={ emptyFields.includes('number') ? 'errorField' : '' }
            />
            <input 
              type="number" 
              onChange={(e) => setYear(e.target.value)} 
              value={ year } 
              placeholder="Year"
              className={ emptyFields.includes('text') ? 'errorField' : '' }
            />
            <button>Add</button>
            {error && <div className="errorField">{ error }</div>}
        </form>
      </section>
    </>
  );
}

export default GrantUpload;

import React, { useState, useEffect } from 'react';
import { EXPEN_UPLOAD_URL, EXPEN_URL } from '../../config';
import { useAuthContext } from '../../hooks/useAuthContext'
import { useResearchInfoContext } from '../../hooks/useResearchInfoContext';
import { useNavigate } from "react-router-dom";
import Alert from '../../components/Alert/Alert'
import './expenupload.css';

const ExpenUpload = () => {
  const navigate = useNavigate()

  const { user, userDispatch } = useAuthContext()
  const { expens, researchInfoDispatch } = useResearchInfoContext()


  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { mssg: 'Must be Logged In', status: 'error'}})
    }
  }, [user, navigate]);

  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const [amount, setAmount] = useState('')
  const [year, setYear] = useState('')
  const [reporting_department, setDepartment] = useState('')
  const [pi_name, setPI] = useState('')


  const expenupload = async (e) => {
    e.preventDefault()

    const response = await fetch(EXPEN_UPLOAD_URL, {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        amount: amount,
        year: year,
        reporting_department: reporting_department,
        pi_name: pi_name,
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
      setAmount('')
      setYear('')

      // Fetch expens if not already fetched
      if (!expens) {
        const fetchExpens = async () => {
          const response = await fetch(EXPEN_URL, {
            method: 'GET',
            credentials: 'include'
          })
    
          const data = await response.json()
          console.log(data)
          if (response.ok) {
            researchInfoDispatch({type: 'SET_EXPENS', payload: data})
          }
        }
        fetchExpens()
      }
      else {
        // Update expens
        researchInfoDispatch({ type: 'UPDATE_EXPENS', payload: json })
      }

      // Navigate to expens page
      navigate('/research-info?page=expenditures', { state: { mssg: 'Expenditure Uploaded', status: 'ok' }})
    }
  };

  return (
    <>
      <Alert />
      <h1 className="expenuploadPageHeader">Upload Expenditure Form</h1>
      <section className="expenuploadCard">
        <h1>Expenditure Information</h1>
        <form className="expenupload" onSubmit={ expenupload }>
            <input 
              type="number" 
              onChange={(e) => setYear(e.target.value)} 
              value={ year } 
              placeholder="Year"
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
              type="text" 
              onChange={(e) => setDepartment(e.target.value)} 
              value={ reporting_department } 
              placeholder="Reporting Department"
              className={ emptyFields.includes('text') ? 'errorField' : '' }
            />
            <input 
              type="text" 
              onChange={(e) => setPI(e.target.value)} 
              value={ pi_name } 
              placeholder="PI Name"
              className={ emptyFields.includes('text') ? 'errorField' : '' }
            />
            <button>Add</button>
            {error && <div className="errorField">{ error }</div>}
        </form>
      </section>
    </>
  );
}

export default ExpenUpload;

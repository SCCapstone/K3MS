import React, { useState, useEffect } from 'react';
import { GRANT_UPLOAD_URL } from '../../config';
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from "react-router-dom";
import Alert from '../../components/Alert/Alert'
import './grantupload.css';

const GrantUpload = () => {
  const navigate = useNavigate()

  const { user, userDispatch } = useAuthContext()

//   const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [year, setYear] = useState('')


//   useEffect(() => {
//     if (user) {
//       navigate('/dashboard', { state: { mssg: 'Already Logged In', status: 'error'}})
//     }
//   },[user]);

  const grantupload = async (e) => {

    // const navigate = useNavigate()
    // const { user } = useAuthContext()
    e.preventDefault()

    // GrantUpload at GRANT_UPLOAD_URL to get auth cookie from backend
    const response = await fetch(GRANT_UPLOAD_URL, {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: email,
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
    //   setEmail('')
    //   setPassword('')
      setEmail('')
      setTitle('')
      setAmount('')
      setAmount('')

      // update the auth context and set local storage
    //   userDispatch({type: 'LOGIN', payload: json[0]})

      // Navigate to grants page
      navigate('/research-info', { state: { mssg: 'Grant Uploaded', status: 'ok' }})
    //   navigate('/dashboard', { state: { mssg: 'Logged In', status: 'ok' }})
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
              onChange={(e) => setEmail(e.target.value)} 
              value={ email } 
              placeholder="Email"
              className={ emptyFields.includes('text') ? 'errorField' : '' }
            />
            <input 
              type="text" 
              onChange={(e) => setTitle(e.target.value)} 
              value={ title } 
              placeholder="Title"
              className={ emptyFields.includes('text') ? 'errorField' : '' }
            />
            <input 
              type="text" 
              onChange={(e) => setAmount(e.target.value)} 
              value={ amount } 
              placeholder="Amount"
              className={ emptyFields.includes('text') ? 'errorField' : '' }
            />
            <input 
              type="text" 
              onChange={(e) => setYear(e.target.value)} 
              value={ year } 
              placeholder="Year"
              className={ emptyFields.includes('text') ? 'errorField' : '' }
            />
            <button>Upload</button>
            {error && <div className="errorField">{ error }</div>}
        </form>
      </section>
    </>
  );
}

export default GrantUpload;

import React, { useState, useEffect } from 'react';
import { RESET_PASSWORD_URL } from '../../config';
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate, useLocation } from "react-router-dom";
import './reset-password.css';

const ResetPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const query = new URLSearchParams(location.search)
  const email = query.get('email')
  const hash = query.get('hash')

  const { user } = useAuthContext()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { state: { mssg: 'Already Logged In', status: 'error'}})
    }
  },[user]);

  useEffect(() => {
    if (!navigator.cookieEnabled) {
      setError('Cookies are disabled. Please enable cookies to use this application.')
    }
  })

  const resetPasswordPost = async (e) => {
    e.preventDefault()

    // Email and hash must be defined
    if (!email || !hash) {
      setError('Invalid URL Parameters')
      return
    }

    if (!password || !confirmPassword) {
      setError('Please fill out all fields')
      setEmptyFields(!password ? ['password'] : ['confirmPassword'])
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setEmptyFields([])
      return
    }

    const response = await fetch(RESET_PASSWORD_URL, {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: email,
        password: password,
        hash: hash
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
      setPassword('')
      setConfirmPassword('')

      // Navigate to dashboard
      navigate('/login', { state: { mssg: 'Password Reset', status: 'ok' }})
    }
  };

  return (
    <>
      <h1 className="setPasswordHeader">USC Dashboard</h1>
      <section className="setPasswordCard">
        <h1>Reset Password for {email}</h1>
        <form className="setPassword" onSubmit={ resetPasswordPost }>
            <input 
              type="password" 
              onChange={(e) => setPassword(e.target.value)} 
              value={ password } 
              placeholder="Password"
              className={ emptyFields.includes('password') ? 'errorField' : '' }
            />
            <input 
              type="password" 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              value={ confirmPassword } 
              placeholder="Confirm Password"
              className={ emptyFields.includes('confirmPassword') ? 'errorField' : '' }
            />
            <button>Reset Password</button>
            {error && <div className="errorField">{ error }</div>}
        </form>
      </section>
    </>
  );
}

export default ResetPassword;

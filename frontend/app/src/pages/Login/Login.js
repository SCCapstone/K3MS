import React, { useState, useEffect } from 'react';
import { LOGIN_URL, RESET_PASSWORD_EMAIL_URL } from '../../config';
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from "react-router-dom";
import Alert from '../../components/Alert/Alert'
import './login.css';

const Login = () => {
  const navigate = useNavigate()

  const { user, userDispatch } = useAuthContext()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { state: { mssg: 'Already Logged In', status: 'error'}})
    }
  },[user]);

  const login = async (e) => {
    e.preventDefault()

    // Login at LOGIN_URL to get auth cookie from backend
    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: email,
        password: password
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
      setEmail('')
      setPassword('')

      // update the auth context and set local storage
      userDispatch({type: 'LOGIN', payload: json[0]})

      // Navigate to dashboard
      navigate('/dashboard', { state: { mssg: 'Logged In', status: 'ok' }})
    }
  };

  const resetPassword = async () => {
    // Prompt backend to send reset password email
    const response = await fetch(RESET_PASSWORD_EMAIL_URL, {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: email
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
      setEmail('')
      setPassword('')

      navigate('/login', { state: { mssg: 'Reset Password Email Sent', status: 'ok' }})
    }
  }

  return (
    <>
      <Alert />
      <button className="returnToSplashPage" onClick={() => navigate('/')}>Splash Page</button>
      <h1 className="loginPageHeader">USC Dashboard</h1>
      <section className="loginCard">
        <h1>Log In</h1>
        <form className="login" onSubmit={ login }>
            <input 
              type="email" 
              onChange={(e) => setEmail(e.target.value)} 
              value={ email } 
              placeholder="Email"
              className={ emptyFields.includes('email') ? 'errorField' : '' }
            />
            <input 
              type="password" 
              onChange={(e) => setPassword(e.target.value)} 
              value={ password } 
              placeholder="Password"
              className={ emptyFields.includes('password') ? 'errorField' : '' }
            />
            <button>Log in</button>
            {error && <div className="errorField">{ error }</div>}
        </form>
        <p onClick={ resetPassword } >Forget Password?</p>
      </section>
    </>
  );
}

export default Login;

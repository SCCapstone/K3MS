import React, { useState, useEffect } from 'react';
import { LOGIN_URL } from '../config';
import { useAuthContext } from '../hooks/useAuthContext'

function Dashboard() {
  const { user, userDispatch } = useAuthContext()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log('handleSubmit')
    // Login at LOGIN_URL to get auth cookie from backend
    const login = async () => {
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
        setEmptyFields(json.empty_fields)
        console.log(error)
        console.log(emptyFields)
      }

      if (response.ok) {
        const user = json[0]

        // save user to local storage
        localStorage.setItem('user', JSON.stringify(json))

        // update the auth context
        userDispatch({type: 'LOGIN', payload: user})
      }
    }
    login()
  };

  return (
    <section className="loginCard">
      <h1>Log In</h1>
      <form className="login" onSubmit={ handleSubmit }>
          <div className="row">
            <input 
              type="email" 
              onChange={(e) => setEmail(e.target.value)} 
              value={ email } 
              placeholder="Email"
            />
            <input 
              type="password" 
              onChange={(e) => setPassword(e.target.value)} 
              value={ password } 
              placeholder="Password"
            />
          </div>

          <button>Log in</button>
          {error && <div className="error">{ error }</div>}
      </form>
    </section>
  );
}

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { DASHBOARD_URL, LOGOUT_URL } from '../../config';
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from "react-router-dom";
import Alert from '../../components/Alert/Alert'

const Dashboard = () => {
  const navigate = useNavigate()

  const { user, userDispatch } = useAuthContext()

  const [text, setText] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { mssg: 'Must be Logged In', status: 'error'}})
    }
  }, [user]);

  useEffect(() => {
    // Test login DASHBOARD_URL
    const fetchHome = async () => {
      const response = await fetch(DASHBOARD_URL, {
        method: 'GET',
        credentials: 'include'
      })
      const json = await response.json()
      if (response.ok) {
        setText(json.text)
      }
      else if (response.status === 401) {
        setText(json.error)
      }
    }
    fetchHome()
  }, [user]);

  const logout = async (e) => {
    e.preventDefault()

    const response = await fetch(LOGOUT_URL, {
      credentials: 'include'
    })

    console.log(response)

    if (response.ok) {
      // update the auth context and remove from local storage
      userDispatch({type: 'LOGOUT'})

      // Navigate to login
      navigate('/login', { state: { mssg: 'Logged Out', status: 'ok' }})
    }
  }

  return (
    <div>
      <Alert />
      <h1>Dashboard</h1>
      <p>{text}</p>
      <button onClick={ (e) => logout(e) }>Log out</button>
    </div>
  );
}

export default Dashboard;

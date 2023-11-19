import React, { useState, useEffect } from 'react';
import { HOME_URL } from '../config';
import { useAuthContext } from '../hooks/useAuthContext'

function Dashboard() {
  const [text, setText] = useState('');
  const { user, userDispatch } = useAuthContext()

  useEffect(() => {
    // Get data from backend at HOME_URL
    const fetchHome = async () => {
      const response = await fetch(HOME_URL, {
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

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{text}</p>
    </div>
  );
}

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { DASHBOARD_URL } from '../../config';
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from "react-router-dom";
// import './dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate()

  const { user } = useAuthContext()

  const [text, setText] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { mssg: 'Must be Logged In', status: 'error'}})
    }
  }, [user, navigate]);

  useEffect(() => {
    // Test login DASHBOARD_URL
    const fetchHome = async () => {
      const response = await fetch(DASHBOARD_URL, {
        method: 'GET',
        credentials: 'include'
      })
      const json = await response.json()
      if (response.ok) {
        setText(json.user)
      }
      else if (response.status === 401) {
        setText(json.error)
      }
    }
    fetchHome()
  }, [user]);

  return (
    <div>
      <h1 className='pageHeader'>Dashboard</h1>

      <p>{text}</p>
    </div>
  );
}

export default Dashboard;

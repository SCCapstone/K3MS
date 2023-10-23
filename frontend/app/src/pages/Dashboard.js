import React, { useState, useEffect } from 'react';
import { HOME_URL } from '../config';

function Dashboard() {
  const [text, setText] = useState('');

  useEffect(() => {
    // Get data from backend at HOME_URL
    const fetchHome = async () => {
      const response = await fetch(HOME_URL)
      const json = await response.json()
      if (response.ok) {
        setText(json.text)
      }
    }
    fetchHome()
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{text}</p>
    </div>
  );
}

export default Dashboard;

import React from 'react';
import Navbar from '../Navbar/Navbar';
import Alert from '../../components/Alert/Alert'
import './mainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div>
      <Alert />
      <Navbar />
      <div className='mainLayout'>
        { children }
      </div>
    </div>
  );
}

export default MainLayout;
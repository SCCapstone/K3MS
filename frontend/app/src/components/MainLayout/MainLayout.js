import React from 'react';
import { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import Alert from '../../components/Alert/Alert'
import './mainLayout.css';

const MainLayout = ({ children }) => {
  const [navbarVisible, setNavbarVisible] = useState(true)

  return (
    <div>
      <Alert />
      <Navbar navbarVisible={navbarVisible} setNavbarVisible={setNavbarVisible}/>
      <div className={ `mainLayout ${navbarVisible ? '' : 'mainLayoutCollapsed'}` }>
        { children }
      </div>
    </div>
  );
}

export default MainLayout;
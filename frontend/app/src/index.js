import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ResearchInfoContextProvider } from './context/ResearchInfoContext';
import { StudentEvalsContextProvider } from './context/StudentEvalsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ResearchInfoContextProvider>
        <StudentEvalsContextProvider>
          <App />
        </StudentEvalsContextProvider>
      </ResearchInfoContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);


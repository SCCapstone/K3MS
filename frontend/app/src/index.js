import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ResearchInfoContextProvider } from './context/ResearchInfoContext';
import { StudentEvalsContextProvider } from './context/StudentEvalsContext';
import { StudentEvalsDetailsContextProvider } from './context/StudentEvalsDetailsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ResearchInfoContextProvider>
        <StudentEvalsContextProvider>
          <StudentEvalsDetailsContextProvider>
            <App />
          </StudentEvalsDetailsContextProvider>
        </StudentEvalsContextProvider>
      </ResearchInfoContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);


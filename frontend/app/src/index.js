import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ResearchInfoContextProvider } from './context/ResearchInfoContext';
import { StudentEvalsContextProvider } from './context/StudentEvalsContext';
import { StudentEvalsDetailsContextProvider } from './context/StudentEvalsDetailsContext';
import { CourseAnalyticsContextProvider } from './context/CourseAnalyticsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ResearchInfoContextProvider>
        <StudentEvalsContextProvider>
          <StudentEvalsDetailsContextProvider>
            <CourseAnalyticsContextProvider>
              <App />
            </CourseAnalyticsContextProvider>
          </StudentEvalsDetailsContextProvider>
        </StudentEvalsContextProvider>
      </ResearchInfoContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);


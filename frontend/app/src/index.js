import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ResearchInfoContextProvider } from './context/ResearchInfoContext';
import { StudentEvalsContextProvider } from './context/StudentEvalsContext';
import { CourseAnalyticsContextProvider } from './context/CourseAnalyticsContext';
import { TeamAssessmentsContextProvider } from './context/TeamAssessmentsContext';
import { DashboardContextProvider } from './context/DashboardContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DashboardContextProvider>
      <AuthContextProvider>
        <ResearchInfoContextProvider>
          <StudentEvalsContextProvider>
              <CourseAnalyticsContextProvider>
                <TeamAssessmentsContextProvider>
                  <App />
                </TeamAssessmentsContextProvider>
              </CourseAnalyticsContextProvider>
          </StudentEvalsContextProvider>
        </ResearchInfoContextProvider>
      </AuthContextProvider>
    </DashboardContextProvider>
  </React.StrictMode>
);


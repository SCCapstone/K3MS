import './navbar.css';
import { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { LOGOUT_URL } from '../../config';
import { useNavigate } from "react-router-dom";
import USCLogo from '../../assets/navbar-usc-logo.svg';
import { useStudentEvalsContext } from '../../hooks/useStudentEvalsContext';
import { useCourseAnalyticsContext } from '../../hooks/useCourseAnalyticsContext';
import { useDashboardContext } from '../../hooks/useDashboardContext';
import { useTeamAssessmentsContext } from '../../hooks/useTeamAssessmentsContext';
import { useResearchInfoContext } from '../../hooks/useResearchInfoContext';

const Navbar = ({ navbarVisible, setNavbarVisible }) => {
  const navigate = useNavigate()
  const { user, userDispatch } = useAuthContext()
  const { studentEvalsDispatch } = useStudentEvalsContext()
  const { courseAnalyticsDispatch } = useCourseAnalyticsContext()
  const { dashboardDispatch } = useDashboardContext()
  const { teamAssessmentsDispatch } = useTeamAssessmentsContext()
  const { researchInfoDispatch } = useResearchInfoContext()

  const logout = async (e) => {
    e.preventDefault()
    const response = await fetch(LOGOUT_URL, {
      credentials: 'include'
    })

    if (response.ok) {
      // update the auth context and remove from local storage
      userDispatch({type: 'LOGOUT'})

      // Clear state data
      studentEvalsDispatch({type: 'CLEAR_DATA'})
      courseAnalyticsDispatch({type: 'CLEAR_DATA'})
      dashboardDispatch({type: 'CLEAR_DATA'})
      teamAssessmentsDispatch({type: 'CLEAR_DATA'})
      researchInfoDispatch({type: 'CLEAR_DATA'})

      // Navigate to login
      navigate('/login', { state: { mssg: 'Logged Out', status: 'ok' }})
    }
  }

  return (
    <div className="navbarWrapper">
      <div className={`navbar ${navbarVisible ? '' : 'navBarCollapsed'}`}>
        <img id="sclogo" src={ USCLogo } alt="SC Logo"></img>
        <hr></hr>
        <p className="user">{ user ? user.email : '' }</p>
        <div className="buttons">
          <div className='buttonGroup'>
            <p>View Data</p>
            <button onClick={ (e) => navigate('/dashboard') }>Dashboard</button>
            <button onClick={ (e) => navigate('/student-evals') }>Students Evals</button>
            <button onClick={ (e) => navigate('/course-analytics') }>Course Analytics</button>
            { user && (user.position === 'chair' || user.position === 'professor') ?
              <button onClick={ (e) => navigate('/research-info') }>Research Info</button> : ''
            }
            { user && user.position === 'chair' ?
                <button onClick={ (e) => navigate('/teamassessments') }>Team Assessments</button>
              : ''
            }
          </div>
          <div className='buttonGroup'>
            <p>Enter & Upload Data</p>
            <button onClick={ (e) => navigate('/grantupload') }>Add Grant</button>
            <button onClick={ (e) => navigate('/pubupload') }>Add Publication</button>
            <button onClick={ (e) => navigate('/expenupload') }>Add Expenditure</button>
            { user && user.position === 'chair' ? <>
              <button onClick={ (e) => navigate('/evalupload') }>Upload Evaluations</button>
              </> : ''
            }
          </div>
          
          <div className='buttonGroup'>
            <p>Account</p>
            <button onClick={ (e) => navigate('/account-settings') }>Account Settings</button>
            { user && user.position === 'chair' ? <>
                <button onClick={ (e) => navigate('/useradmin') }>User Administration</button>
              </> : ''
            }
            <button onClick={ (e) => logout(e) }>Log out</button>
          </div>
        </div>
        <button 
          className="navbarHide" 
          onClick={() => setNavbarVisible((prev) => !prev)}
        ></button>
      </div>
      { !navbarVisible && 
        <button 
            className="navbarShow" 
            onClick={() => setNavbarVisible((prev) => !prev)}
        ></button>
      }
    </div>
  )
}

export default Navbar;
import './navbar.css';
import { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { LOGOUT_URL } from '../../config';
import { useNavigate } from "react-router-dom";
import USCLogo from '../../assets/navbar-usc-logo.svg';
import profile from '../../assets/profile.jpg';
import { useStudentEvalsContext } from '../../hooks/useStudentEvalsContext';
import { useCourseAnalyticsContext } from '../../hooks/useCourseAnalyticsContext';
import { useDashboardContext } from '../../hooks/useDashboardContext';
import { useTeamAssessmentsContext } from '../../hooks/useTeamAssessmentsContext';
import { useResearchInfoContext } from '../../hooks/useResearchInfoContext';
import { GET_PROFILE_PICTURE_URL } from '../../config';

const Navbar = ({ navbarVisible, setNavbarVisible }) => {
  const navigate = useNavigate()
  const { user, profilePictureUrl, userDispatch } = useAuthContext()
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

  const toggleNavbar = () => {
    window.dispatchEvent(new Event('resize')); 
    setNavbarVisible((prev) => !prev)
  }

  useEffect(() => {
    // fetchProfilePicture()
    const fetchProfilePicture = async () => {
      const response = await fetch(GET_PROFILE_PICTURE_URL, {
        method: 'GET',
        credentials: 'include'
      })
      const blob = await response.blob()
      if (response.ok) {
        const url = URL.createObjectURL(blob)
        userDispatch({type: 'SET_PROFILE_PICTURE_URL', payload: url})
      }
      else {
        console.log('Error fetching profile picture')
      }
    }
    fetchProfilePicture()
  }, [])

  return (
    <div className="navbarWrapper">
      <div className={`navbar ${navbarVisible ? '' : 'navBarCollapsed'}`}>
        <img id="sclogo" src={ USCLogo } alt="SC Logo"></img>
        <hr></hr>
        {/* Add image here for user profile picture */}
        { profilePictureUrl ? 
          <img id="profile_picture" src={ profilePictureUrl } alt="Profile Picture"></img>
          : <img id="profile_picture" src={ profile } alt="Profile Picture"></img>
        }
        <p className="user">{ user ? user.first_name +' '+ user.last_name : '' }</p>
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
          { user && (user.position === 'chair' || user.position === 'professor') ?
            <div className='buttonGroup'>

              <p>Enter & Upload Data</p>
              <button onClick={ (e) => navigate('/grantupload') }>Add Grant</button>
              <button onClick={ (e) => navigate('/pubupload') }>Add Publication</button>
              <button onClick={ (e) => navigate('/expenupload') }>Add Expenditure</button>
              { user && user.position === 'chair' ? <>
                <button onClick={ (e) => navigate('/evalupload') }>Upload Evaluations</button>
                </> : ''
              }
            </div> : ''
          }
          
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
          onClick={toggleNavbar}
        ></button>
      </div>
      { !navbarVisible && 
        <button 
            className="navbarShow" 
            onClick={toggleNavbar}
        ></button>
      }
    </div>
  )
}

export default Navbar;
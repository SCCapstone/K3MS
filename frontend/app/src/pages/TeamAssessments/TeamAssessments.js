import React, { useEffect } from 'react'
import { useState } from 'react'
import { TEAM_ASSESSMENTS_URL } from '../../config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from "react-router-dom";
import { useTeamAssessmentsContext } from '../../hooks/useTeamAssessmentsContext';
import './team_assessments.css'

const TeamAssessments = () => {
  const navigate = useNavigate()

  const { user } = useAuthContext()
  const { team, teamAssessmentsDispatch } = useTeamAssessmentsContext()

  // Don't allow non-logged in users to access this page
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { mssg: 'Must be Logged In', status: 'error'}})
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.position !== 'chair') {
      let redirect = user ? '/dashboard' : '/login'
      navigate(redirect, { 
        state: { 
          mssg: 'You do not have access to this page - this incident will be reported', 
          status: 'error'
        }
      })
    }
  }, [user, navigate]);

  // Fetch team assessments
  useEffect(() => {
    const fetchTeamAssessments = async () => {
      const response = await fetch(TEAM_ASSESSMENTS_URL, {
        method: 'GET',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        teamAssessmentsDispatch({type: 'SET_COURSES', payload: data})
        teamAssessmentsDispatch({type: 'SET_TEAM', payload: data})
      }
      else if (response.status === 401) {
        console.log('error')
      }
    }
    if (!team) {
      fetchTeamAssessments()
    }
  }, [team, teamAssessmentsDispatch])

  const handleAnalyticsButtonClick = (user) => {
    // redirect to course-analytics page passing in user name as a query parameter
    navigate(`/course-analytics?email=${user.email}`)
  }

  return (
    <div className="teamAssessmentsBody">
      <h1 className="pageHeader">My Team Assessments</h1>
      <div className='team'>        
      {team && team.map((user, i) => 
        <div className='teamAssessmentsCard' key={i}>
          <h1>{ user.first_name +' '+user.last_name }</h1>
          <div className='teamAssessmentsCardContent'>
            <p><b>Position:</b> {user.position}</p>
            <p><b>Average Course Rating:</b> {user?.ave_all_course_rating_mean}</p>
            <p><b>Average Instructor Rating:</b> {user?.ave_all_instructor_rating_mean}</p>
            <button
              className="course_analytics"
              onClick={() => handleAnalyticsButtonClick(user)}
            >
              Course Analytics
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default TeamAssessments

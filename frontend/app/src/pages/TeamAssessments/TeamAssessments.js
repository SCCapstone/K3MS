import React, { useEffect } from 'react'
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

  // Function to handle button click and navigate to another page with data
  const handleButtonClick = (user) => {
    // Encode user object into a query parameter
    const userQueryParam = encodeURIComponent(JSON.stringify(user));
    // Navigate to the desired page with data
    navigate(`/student-evals-details?user=${userQueryParam}`);
  }

  return (
    <div className="teamAssessmentsBody">
      <h1 className="pageHeader">My Team Assessments</h1>
      <div className='team'>        {team && team.map((user, i) => {
          return (
            <div className='teamAssessmentsCard' key={i}>
              <h1>{ user.first_name +' '+user.last_name }</h1>
              <div className='teamAssessmentsCardContent'>
                <p>Average Course Rating: { user.ave_all_course_rating_mean }</p>
                <p>Average Instructor Rating: { user.ave_all_instructor_rating_mean }</p>
                {/* Add button here */}
                <button onClick={() => navigate('/course-analytics')}>Course Analytics</button>
                <button onClick={() => navigate('/student-evals')}>Student Evaluations</button>
                <button onClick={() => navigate('/research-info')}>Research Info</button>
                <button onClick={() => handleButtonClick(user.email)}>Details</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TeamAssessments

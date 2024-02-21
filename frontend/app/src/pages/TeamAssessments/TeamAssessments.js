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

  const [isVisible, setIsVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [userCard, setUserCard] = useState('');

  //Handler to ensure only one set of details show at one point
  const handleButtonClick = (user) => {
    setUserCard(user.email);
  }

  return (
    <div className="teamAssessmentsBody">
      <h1 className="pageHeader">My Team Assessments</h1>
      <div className='team'>        {team && team.map((user, i) => {
          
          return (
            <div className='teamAssessmentsCard' key={i}>
              <h1>{ user.first_name +' '+user.last_name }</h1>
              <div className='teamAssessmentsCardContent'>
                <div>
                  <button onClick={() => {
                    setIsVisible(!isVisible)
                    setUserDetails(user)
                    handleButtonClick(user)
                  }}>View Details</button>
                  {isVisible && userCard == user.email ? 
                    <div>
                      <p>Position: { user.position }</p>
                      <p>Average Course Rating: { user.ave_all_course_rating_mean }</p>
                      <p>Average Instructor Rating: { user.ave_all_instructor_rating_mean }</p>
                    </div>
                  : null}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TeamAssessments

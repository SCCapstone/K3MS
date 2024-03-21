import React, { useEffect } from 'react'
import { useState } from 'react'
import { TEAM_ASSESSMENTS_URL } from '../../config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from "react-router-dom";
import { useTeamAssessmentsContext } from '../../hooks/useTeamAssessmentsContext';
import { useCourseAnalyticsContext } from '../../hooks/useCourseAnalyticsContext';
import { COURSE_ANALYTICS_URLS } from '../../config'
import './team_assessments.css'

const TeamAssessments = () => {
  const navigate = useNavigate()

  const { user } = useAuthContext()
  const { team, teamAssessmentsDispatch } = useTeamAssessmentsContext()
  const { allCoursesInDb, courseAnalyticsDispatch } = useCourseAnalyticsContext()
  const [ userQuery, setUserQuery ] = useState('')

  const [ courseQuery, setCourseQuery ] = useState('')
  const [ chosenCourse, setChosenCourse ] = useState('')
  const [ showCourseDropdown, setShowCourseDropdown ] = useState(false)
  const [ year, setYear ] = useState(1000)

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

  // Fetch all courses in db
  useEffect(() => {
    const fetchAllCourses = async () => {
      const response = await fetch(`${COURSE_ANALYTICS_URLS.getAllCourses}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data)
        courseAnalyticsDispatch({type: 'SET_ALL_COURSES', payload: data})
      }
      else if (response.status === 401) {
        console.log('error')
      }
    }
    if (!allCoursesInDb)
      fetchAllCourses()
  }, [allCoursesInDb, courseAnalyticsDispatch])

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

  const updateUserQuery = (e) => {
    e.preventDefault()
    setUserQuery(e.target.value)
  }

  const handleCourseChange = (e) => {
    e.preventDefault()
    setCourseQuery(e.target.value)
  }

  return (
    <div className="teamAssessmentsBody">
      <h1 className="pageHeader">My Team Assessments</h1>
        <div className='teamAssessmentsCard teamOptions'>
          <div className='teamAssessmentsbuttons'>
            <div className='teamAssessmentsDropdownBox'>
              <h3>Filter Users</h3>
              <input type="text" id="course" className="teamAssessmentsDropdown" onChange={ (e) => updateUserQuery(e) } placeholder="Enter Name or Email" />
            </div>
            <div className="teamAssessmentsSearchCourse teamAssessmentsDropdownBox">
              <h3>Has Taught Course</h3>
              <input type="text" id="course" className="teamAssessmentsDropdown" 
                onFocus={ () => setShowCourseDropdown(true)}
                onFocusOut={ () => setShowCourseDropdown(false)}
                onChange={ (e) => {handleCourseChange(e)}} 
                placeholder="Search for a course" 
              />
              { showCourseDropdown &&
                <div class="teamAssessmentSearchCourseDropdownContent">
                  { allCoursesInDb && allCoursesInDb.filter((course) => {
                    if (!courseQuery)
                      return true
                    return course.toLowerCase().includes(courseQuery.toLowerCase())
                    }).map((course, i) => 
                      <div key={i} onClick={ (e) => setChosenCourse(e) }>{course}</div>
                    )
                  }
                </div>
              }
            </div>
            <div className="choosePeriodDropdown teamAssessmentsDropdownBox">
              <h3>In the last</h3>
              <select name="course" id="course" className="teamAssessmentsDropdown" required onChange={ (e) => setYear(e.target.value) }>
                <option value={1}>Last Year</option>
                <option value={5}>Last Five Years</option>
                <option value={10}>Last Ten Years</option>
                <option value={1000}>All Time</option>
              </select>
            </div>
          </div>
        </div>
      <div className='team'>  
      {team && team.filter((member) => {
        if (!userQuery) {
          return true
        }
        return (
          member.first_name.toLowerCase().includes(userQuery.toLowerCase()) || 
          member.last_name.toLowerCase().includes(userQuery.toLowerCase()) ||
          member.email.toLowerCase().includes(userQuery.toLowerCase())
        )
      }).map((member, i) => 
        <div className='teamAssessmentsCard' key={i}>
          <h1>{ member.first_name +' '+member.last_name }</h1>
          <div className='teamAssessmentsCardContent'>
            <p><b>Position:</b> {member.position}</p>
            <p><b>Average Course Rating:</b> {member?.ave_all_course_rating_mean}</p>
            <p><b>Average Instructor Rating:</b> {member?.ave_all_instructor_rating_mean}</p>
            <button
              className="course_analytics_button"
              onClick={() => handleAnalyticsButtonClick(member)}
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

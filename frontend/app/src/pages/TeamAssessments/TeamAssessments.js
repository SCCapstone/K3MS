import React, { useEffect, useRef } from 'react'
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

  // Ensure Dropdown width is set correctly
  const chooseCourseDiv = useRef(null)
  const [chooseCourseWidth, setChooseCourseWidth] = useState(0)
  useEffect(() => {
    const onResize = () => {
      setTimeout(() => {
        setChooseCourseWidth(chooseCourseDiv.current?.offsetWidth-20);
      }, 500)
    }
    window.addEventListener('resize', onResize);
    setChooseCourseWidth(chooseCourseDiv.current?.offsetWidth - 20); // Initial width
    return () => window.removeEventListener('resize', onResize);
  }, []);

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

  return (
    <div className="teamAssessmentsBody">
      <h1 className="pageHeader">My Team Assessments</h1>
        <div className='teamAssessmentsCard teamOptions'>
          <div className='teamAssessmentsFilters'>
            <div className='teamAssessmentsDropdownBox'>
              <h3>Filter Users</h3>
              <input type="text" className="teamAssessmentsDropdown" onChange={ (e) => setUserQuery(e.target.value) } placeholder="Enter Name or Email" />
            </div>
            <div className="teamAssessmentsSearchCourse teamAssessmentsDropdownBox" ref={chooseCourseDiv}>
              <h3>Has Taught Course</h3>
              <input 
                type="text" 
                className="teamAssessmentsDropdown teamAssessmentsSearchCourseDropdown"
                value = { courseQuery }
                onFocus={ () => setShowCourseDropdown(true)}
                onBlur={ () => setShowCourseDropdown(false) }
                onClick={ (e) => setCourseQuery('') }
                onChange={ (e) => setCourseQuery(e.target.value) } 
                placeholder={ "Search for a course" }
              />
              <div 
                className="teamAssessmentSearchCourseDropdownContent" 
                style={ {'width': chooseCourseWidth, 'display': showCourseDropdown ? '' : 'none'} }
              >
                <div 
                  className="teamAssessmentSearchCourseDropdownItem" 
                  onMouseDown={ () => { setChosenCourse(''); setCourseQuery('') } }
                >
                  None
                </div>
                { allCoursesInDb && allCoursesInDb.filter((course) => {
                  if (!courseQuery)
                    return true
                  return course.toLowerCase().includes(courseQuery.toLowerCase())
                  }).map((course, i) => 
                    <div 
                      className="teamAssessmentSearchCourseDropdownItem" 
                      key={i} 
                      onMouseDown={ () => { setChosenCourse(course); setCourseQuery(course) } }
                    >{course}</div>
                  )
                }
              </div>
            </div>
            <div className="choosePeriodDropdown teamAssessmentsDropdownBox">
              <h3>In the last</h3>
              <select name="course" id="course" className="teamAssessmentsDropdown" required onChange={ (e) => setYear(e.target.value) }>
                <option value={1000}>All Time</option>
                <option value={1}>Last Year</option>
                <option value={5}>Last Five Years</option>
                <option value={10}>Last Ten Years</option>
              </select>
            </div>
          </div>
        </div>
      <div className='team'>  
      {team && team.filter((member) => {
        // User Query
        const userQueried = userQuery ? (
          member.first_name.toLowerCase().includes(userQuery.toLowerCase()) || 
          member.last_name.toLowerCase().includes(userQuery.toLowerCase()) ||
          `${member.first_name} ${member.last_name}`.toLowerCase().includes(userQuery.toLowerCase()) ||
          member.email.toLowerCase().includes(userQuery.toLowerCase())
        ) : true
        const courseTaught = chosenCourse ? (
          member.courses.some(course => course.course === chosenCourse)
        ) : true
        const yearFiltered = chosenCourse ? (
          member.courses.some(course => course.course === chosenCourse && course.latest_year >= new Date().getFullYear() - year)
        ) : true
        return userQueried && courseTaught && yearFiltered
      }).map((member, i) => 
        <div className='teamAssessmentsCard' key={i}>
          <div className='teamAssessmentCardContent'>
            <div className='teamAssessmentsCardStats'>
              <h1>{ `${member.first_name} ${member.last_name} - ${member.position}` }</h1>
              { member.ave_all_course_rating_mean && <p><b>Average Course Rating:</b> { member.ave_all_course_rating_mean }</p> }
              { member.ave_all_instructor_rating_mean && <p><b>Average Instructor Rating:</b> { member.ave_all_instructor_rating_mean }</p> }
              { member.course_percentile && <p><b>Ave. Course Rating Percentile:</b> {member.course_percentile}{member.course_percentile % 10 === 1 ? 'st' : member.course_percentile % 10 === 2 ? 'nd' : member.course_percentile % 10 === 3 ? 'rd' : 'th'}</p> }
              { member.instructor_percentile && <p><b>Ave. Instructor Rating Percentile:</b> {member.instructor_percentile}{member.instructor_percentile % 10 === 1 ? 'st' : member.instructor_percentile % 10 === 2 ? 'nd' : member.instructor_percentile % 10 === 3 ? 'rd' : 'th'}</p> }
              { member.courses?.length === 0 && <p>No Courses</p> }
            </div>
            <div className="teamAssessmentsButtons">
              <button onClick={ () => navigate(`/course-analytics?email=${member.email}`) }>
                Course Analytics
              </button>
              <button onClick={ () => navigate(`/student-evals?email=${member.email}`) }>
                Student Evaluations
              </button>
              <button onClick={ () => navigate(`/research-info?email=${member.email}`) }>
                Research Info
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default TeamAssessments

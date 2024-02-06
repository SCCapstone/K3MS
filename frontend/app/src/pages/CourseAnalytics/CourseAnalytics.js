import React, { useEffect, useState } from 'react'
import { COURSE_ANALYTICS_URLS } from '../../config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from "react-router-dom";
import { useCourseAnalyticsContext } from '../../hooks/useCourseAnalyticsContext';

import './course_analytics.css'

const CourseAnalytics = () => {
  const navigate = useNavigate()

  const { user } = useAuthContext()
  const { usersToChoose, courses, anonData, courseAnalyticsDispatch } = useCourseAnalyticsContext()

  const [ oldestFetched, setOldestFetched ] = useState(0)
  const [ chosenPerson, setChosenPerson ] = useState(user)
  const [ chosenPersonName, setChosenPersonName ] = useState(`${user.first_name} ${user.last_name}`)
  const [ chosenCourse, setChosenCourse ] = useState('')
  const [ chosenPeriod, setChosenPeriod ] = useState(1)

  const [ courseMean, setCourseMean ] = useState(0)
  const [ instructorMean, setInstructorMean ] = useState(0)

  // Don't allow non-logged in users to access this page
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { mssg: 'Must be Logged In', status: 'error'}})
    }
  }, [user, navigate]);

  // Fetch student evals for current user or chosen user
  useEffect(() => {
    const fetchCourses = async () => {
      const response = await fetch(`${COURSE_ANALYTICS_URLS.getCourses}/${chosenPerson.email}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        courseAnalyticsDispatch({type: 'SET_COURSES', payload: data})
        setChosenCourse(data[0])
      }
      else if (response.status === 401) {
        console.log('error')
      }
    }
    if (!courses) {
      fetchCourses()
    }
  }, [courses, courseAnalyticsDispatch])

  const setStats = () => {
    if (!anonData || !anonData[chosenCourse.course]) 
      return

    const data = anonData[chosenCourse.course]
    const courseMean = data.ave_course_rating_mean
    const instructorMean = data.ave_instructor_rating_mean
    setCourseMean(courseMean)
    setInstructorMean(instructorMean)
  }

  // Fetch analytics data
  useEffect(() => {
    const fetchCourseAnalytics = async () => {
      if (!courses)
        return
      const response = await fetch(`${COURSE_ANALYTICS_URLS.getAnonData}/${chosenCourse.course}/${chosenPeriod}`, {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        courseAnalyticsDispatch({type: 'SET_ANON_DATA', payload: {
          course: chosenCourse.course,
          data: data
        }})
        setOldestFetched(chosenPeriod)
        setStats()
      }
      else if (response.status === 401) {
        console.log('error')
      }
    }

    if (!anonData || !anonData[chosenCourse.course] || chosenPeriod > oldestFetched) {
      fetchCourseAnalytics()
    }
  }, [chosenCourse, chosenPeriod, courseAnalyticsDispatch, courses, oldestFetched, anonData])

  const choosePerson = (e) => {
    courseAnalyticsDispatch({type: 'SET_COURSES', payload: null})
    setChosenPerson(e.target.value)
    setChosenPersonName(`${chosenPerson.first_name} ${chosenPerson.last_name}`)
  }

  const handleChangeYear = (e) => {
    setChosenPeriod(parseInt(e.target.value))
  }

  const handleChangeCourse = (e) => {
    setChosenCourse(courses[e.target.value])
  }
  return (
    <div className="courseAnalyticsBody">
      <h1 className="pageHeader">Course Analytics</h1>
      <div className='courseAnalyticsCard'>        
        <h2>Choose Course</h2>
        {user && user.position === 'chair' &&
          <div className='choosePersonDropdown'>
            <h3>Choose Person</h3>
            <select name="person" id="person" className="dropdown" required onChange={ choosePerson }>
              <option value={ user }>{ `${user.first_name} ${user.last_name}` }</option>
            </select>
          </div>
        }
        <div className='dropdowns'>
          <h3>Courses for { chosenPersonName}</h3>
          <select name="course" id="course" className="dropdown" required onChange={ handleChangeCourse }>
            { courses && courses.map((course, i) => 
              <option key={i} value={i}>{ course.course }</option>
            )}
          </select>
          <h3>Search for a Course</h3>
          <input type="text" id="course" className="dropdown" placeholder="Search for a course" />
          <h3>Showing Data From</h3>
          <select name="course" id="course" className="dropdown" required onChange={ handleChangeYear }>
            <option value={1}>Last Year</option>
            <option value={5}>Last Five Years</option>
            <option value={10}>Last Ten Years</option>
          </select>
        </div>

        <div className='courseAnalyticsTable'>
        <h2>Data for {courses ? chosenCourse.course : ''}</h2>
        <table border="1">
          <thead>
            <tr>
              <th></th>
              <th>Course Rating</th>
              <th>Instructor Rating</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>{ chosenPersonName }</th>
              <td>{ courses ? chosenCourse.ave_course_rating_mean : '' }</td>
              <td>{ courses ? chosenCourse.ave_instructor_rating_mean : '' }</td>
            </tr>
            <tr>
              <th>Average</th>
              <td></td>
              <td>Data</td>
            </tr>
            <tr>
              <th>90%</th>
              <td>Data</td>
              <td>Data</td>
            </tr>
            <tr>
              <th>50%</th>
              <td>Data</td>
              <td>Data</td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}

export default CourseAnalytics

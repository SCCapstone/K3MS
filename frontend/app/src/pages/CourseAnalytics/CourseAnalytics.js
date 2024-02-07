import React, { useEffect, useState } from 'react'
import { COURSE_ANALYTICS_URLS, DEC_PLACES } from '../../config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from "react-router-dom";
import { useCourseAnalyticsContext } from '../../hooks/useCourseAnalyticsContext';

import './course_analytics.css'

const CourseAnalytics = () => {
  const navigate = useNavigate()

  const { user } = useAuthContext()
  const { usersToChoose, courses, anonData, allCoursesInDb, courseAnalyticsDispatch } = useCourseAnalyticsContext()

  const [ oldestFetched, setOldestFetched ] = useState(0)
  const [ chosenPerson, setChosenPerson ] = useState(user)
  const [ chosenPersonName, setChosenPersonName ] = useState(`${user.first_name} ${user.last_name}`)
  const [ chosenCourse, setChosenCourse ] = useState('')
  const [ chosenPeriod, setChosenPeriod ] = useState(1)

  const [ anonDataKey, setAnonDataKey ] = useState('')
  const [ anonDataError, setAnonDataError ] = useState('')
  const [ coursesError, setCoursesError ] = useState('')

  useEffect(() => {
    setAnonDataKey(chosenCourse.course + chosenPeriod)
  }, [chosenCourse, chosenPeriod])

    // Don't allow non-logged in users to access this page
    useEffect(() => {
      if (!user) {
        navigate('/login', { state: { mssg: 'Must be Logged In', status: 'error'}})
      }
    }, [user, navigate]);

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
  }, [allCoursesInDb])

  // Fetch users to choose from
  useEffect(() => {
    const fetchUsersToChoose = async () => {
      const response = await fetch(`${COURSE_ANALYTICS_URLS.getUsersToChoose}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data)
        courseAnalyticsDispatch({type: 'SET_USERS_TO_CHOOSE', payload: data})
      }
      else {
        console.log('error')
      }
    }
    if (!usersToChoose)
      fetchUsersToChoose()
  }, [usersToChoose, courseAnalyticsDispatch])

  // Fetch student evals for current user or chosen user
  useEffect(() => {
    const fetchCourses = async () => {
      const response = await fetch(
        `${COURSE_ANALYTICS_URLS.getCourses}/${chosenPerson.email}/${chosenPeriod}`, 
        {
          method: 'GET',
          credentials: 'include'
        }
      )

      if (response.ok) {
        const data = await response.json()
        courseAnalyticsDispatch({type: 'SET_COURSES', payload: data})
        setChosenCourse(data[0])
        setCoursesError('')
      }
      else {
        const data = await response.json()
        if (data && data.error) {
          setCoursesError(data.error)
        }
        else {
          setCoursesError('An error occurred')
        }
        courseAnalyticsDispatch({type: 'SET_COURSES', payload: null})
      }
    }
    if (!courses) {
      fetchCourses()
    }
    else if (!chosenCourse) {
      setChosenCourse(courses[0])
    }
  }, [courses, chosenPeriod, courseAnalyticsDispatch])

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
          // TODO replace with anonDataKey
          course: chosenCourse.course,
          data: data,
          period: chosenPeriod
        }})
        // setOldestFetched(chosenPeriod)
        setAnonDataError('')
      }
      else {
        const data = await response.json()
        if (data && data.error) {
          setAnonDataError(data.error)
        }
        else {
          setAnonDataError('An error occurred')
        }
      }
    }

    // if (!anonData || !anonData[chosenCourse.course] || chosenPeriod > oldestFetched) {
    console.log('prefetch')
    if (!(anonData && anonData[anonDataKey])) {
      console.log('fetching')
      fetchCourseAnalytics()
    }
  }, [chosenCourse, chosenPeriod, courseAnalyticsDispatch, courses, anonData])

  const choosePerson = (e) => {
    const chosenPersonTmp = usersToChoose.find(person => person.email === e.target.value)
    courseAnalyticsDispatch({type: 'SET_COURSES', payload: null})
    setChosenPerson(chosenPersonTmp)
    setChosenPersonName(`${chosenPersonTmp.first_name} ${chosenPersonTmp.last_name}`)
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
              { usersToChoose && usersToChoose.map((person, i) =>
                <option key={i} value={ person.email }>{ `${person.first_name} ${person.last_name}` }</option>
              )}
            </select>
          </div>
        }
        { coursesError && <p>{ coursesError }</p> }
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
            <option value={1000}>All Time</option>
          </select>
        </div>

        <div className='courseAnalyticsTable'>
        <h2>Data for {courses ? chosenCourse.course : ''}</h2>
        { anonDataError && <p>{ anonDataError }</p> }
        <table border="1">
          <thead>
            <tr>
              <th></th>
              <th>Course Rating</th>
              <th>Instructor Rating</th>
            </tr>
          </thead>
          { courses && anonData && chosenCourse &&
            <tbody>
              <tr>
                <th>{ chosenPersonName }</th>
                <td>{ courses ? chosenCourse.ave_course_rating_mean.toFixed(DEC_PLACES) : '' }</td>
                <td>{ courses ? chosenCourse.ave_instructor_rating_mean.toFixed(DEC_PLACES) : '' }</td>
              </tr>
              <tr>
                <th>Average</th>
                <td>{ anonData ? (anonData[anonDataKey] ? anonData[anonDataKey].mean_of_all_course_ratings.toFixed(DEC_PLACES) : '' ) : ''}</td>
                <td>{ anonData ? (anonData[anonDataKey] ? anonData[anonDataKey].mean_of_all_instructor_ratings.toFixed(DEC_PLACES) : '' ) : ''}</td>
              </tr>
              <tr>
                <th>Median</th>
                <td>{ anonData ? (anonData[anonDataKey] ? anonData[anonDataKey].median_of_all_course_ratings.toFixed(DEC_PLACES) : '' ) : ''}</td>
                <td>{ anonData ? (anonData[anonDataKey] ? anonData[anonDataKey].median_of_all_instructor_ratings.toFixed(DEC_PLACES) : '' ) : ''}</td>
              </tr>
              <tr>
                <th>75%</th>
                <td>{ anonData ? (anonData[anonDataKey] ? anonData[anonDataKey].course_ratings_75th_percentile.toFixed(DEC_PLACES) : '' ) : ''}</td>
                <td>{ anonData ? (anonData[anonDataKey] ? anonData[anonDataKey].instructor_ratings_75th_percentile.toFixed(DEC_PLACES) : '' ) : ''}</td>
              </tr>
            </tbody>
            }
        </table>
        </div>
      </div>
    </div>
  )
}

export default CourseAnalytics

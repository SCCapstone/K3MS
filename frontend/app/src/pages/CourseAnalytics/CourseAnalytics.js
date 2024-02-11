import React, { useEffect, useState } from 'react'
import { COURSE_ANALYTICS_URLS, DEC_PLACES } from '../../config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from "react-router-dom";
import { useCourseAnalyticsContext } from '../../hooks/useCourseAnalyticsContext';
import Plot from 'react-plotly.js';

import './course_analytics.css'

const CourseAnalytics = () => {
  const navigate = useNavigate()

  useEffect(()=>{
    console.log(coursesError)
    console.log(anonDataError)
    console.log(plottingError)
  })

  const { user } = useAuthContext()
  const { usersToChoose, courses, anonData, allCoursesInDb, courseAnalyticsDispatch } = useCourseAnalyticsContext()

  const [ chosenPerson, setChosenPerson ] = useState(user)
  const [ chosenPersonName, setChosenPersonName ] = useState(`${user.first_name} ${user.last_name}`)
  const [ chosenCourse, setChosenCourse ] = useState('')
  const [ chosenPeriod, setChosenPeriod ] = useState(1)

  const [ anonDataKey, setAnonDataKey ] = useState('')
  const [ anonDataError, setAnonDataError ] = useState('')
  const [ plottingError, setPlottingError ] = useState('')
  const [ coursesError, setCoursesError ] = useState('')

  useEffect(() => {
    setAnonDataKey(chosenCourse.course + chosenPeriod)
  })

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
    if (user && user.position !== 'chair')
      return
    const fetchUsersToChoose = async () => {
      const response = await fetch(`${COURSE_ANALYTICS_URLS.getUsersToChoose}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        courseAnalyticsDispatch({type: 'SET_USERS_TO_CHOOSE', payload: [
          {
            email: user.email, 
            first_name: user.first_name,
            last_name: user.last_name,
          }, 
          ...data
        ]})
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
          setPlottingError(data.error)
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
          key: chosenCourse.course + chosenPeriod,
          data: data,
        }})
        setAnonDataError('')
        if (data.plots.error) {
          setPlottingError(data.plots.error)
        }
        else {
          setPlottingError(data.plots.error)
        }
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
    
    if (!(anonData && anonData[chosenCourse.course + chosenPeriod])) {
      fetchCourseAnalytics()
    }
    else {
      if (anonData[chosenCourse.course + chosenPeriod].plots?.error) {
        setPlottingError(anonData[chosenCourse.course + chosenPeriod].plots?.error)
      }
      else {
        setPlottingError('')
      }
      setAnonDataError('')
    }
  }, [chosenCourse, chosenPeriod, courseAnalyticsDispatch, courses, anonData])

  const choosePerson = (e) => {
    const chosenPersonTmp = usersToChoose.find(person => person.email === e.target.value)
    courseAnalyticsDispatch({type: 'SET_COURSES', payload: null})
    setChosenPerson(chosenPersonTmp)
    setChosenPersonName(`${chosenPersonTmp.first_name} ${chosenPersonTmp.last_name}`)
  }

  const handleChangeYear = (e) => {
    courseAnalyticsDispatch({type: 'SET_COURSES', payload: null})
    setChosenPeriod(parseInt(e.target.value))
  }

  const handleChangeCourse = (e) => {
    setChosenCourse(courses[e.target.value])
  }
  return (
    <div className="courseAnalytics">
      <h1 className="pageHeader">Course Analytics</h1>
      <div className='courseAnalyticsBody'>
        <div className='courseAnalyticsCard'>
          <h1>Filters</h1>
          <div className='dropdowns'>
            { user && user.position === 'chair' &&
              <div className='choosePersonDropdown dropdownBox'>
                <h3>Choose Person</h3>
                <select name="person" id="person" className="dropdown" required onChange={ choosePerson }>
                  { usersToChoose && usersToChoose.map((person, i) =>
                    <option key={i} value={ person.email }>{ `${person.first_name} ${person.last_name}` }</option>
                  )}
                </select>
              </div>
            }
            { coursesError ? <p className='dropDownError'>{ coursesError }</p> :
              <>
                <div className="chooseCourseDropdown dropdownBox">
                  <h3>Courses for { chosenPersonName}</h3>
                  <select name="course" id="course" className="dropdown" required onChange={ handleChangeCourse }>
                    { courses && courses.map((course, i) => 
                      <option key={i} value={i}>{ course.course }</option>
                    )}
                  </select>
                </div>
                <div className="searchCourse dropdownBox">
                  <h3>Search All Courses</h3>
                  <input type="text" id="course" className="dropdown" placeholder="Search for a course" />
                </div>
              </>
            }
            <div className="choosePeriodDropdown dropdownBox">
              <h3>Showing Data From</h3>
              <select name="course" id="course" className="dropdown" required onChange={ handleChangeYear }>
                <option value={1}>Last Year</option>
                <option value={5}>Last Five Years</option>
                <option value={10}>Last Ten Years</option>
                <option value={1000}>All Time</option>
              </select>
            </div>
          </div>
        </div>

        <div className='analyticsTableDiv'>
          <h1>Data for {courses ? chosenCourse.course : ''}</h1>
          { anonDataError && <p className='anonDataError'>{ anonDataError }</p> }
          <table className="analyticsTable">
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
                <td>{ chosenCourse?.ave_course_rating_mean?.toFixed(DEC_PLACES) }</td>
                <td>{ chosenCourse?.ave_instructor_rating_mean?.toFixed(DEC_PLACES) }</td>
              </tr>
              <tr>
                <th>Average</th>
                <td>{ anonData?.[anonDataKey]?.mean_of_all_course_ratings?.toFixed(DEC_PLACES) }</td>
                <td>{ anonData?.[anonDataKey]?.mean_of_all_instructor_ratings?.toFixed(DEC_PLACES) }</td>
              </tr>
              <tr>
                <th>Median</th>
                <td>{ anonData?.[anonDataKey]?.median_of_all_course_ratings?.toFixed(DEC_PLACES) }</td>
                <td>{ anonData?.[anonDataKey]?.median_of_all_instructor_ratings?.toFixed(DEC_PLACES) }</td>
              </tr>
              <tr>
                <th>75%</th>
                <td>{ anonData?.[anonDataKey]?.course_ratings_75th_percentile?.toFixed(DEC_PLACES) }</td>
                <td>{ anonData?.[anonDataKey]?.instructor_ratings_75th_percentile?.toFixed(DEC_PLACES) }</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="analyticsPlot">
          { plottingError ? <p className='plottingError'>{ plottingError }</p> :
            <>
              { anonData?.[anonDataKey]?.plots && !anonData[anonDataKey].plots.error &&
                <>
                  <div>
                    <h1>Course Rating Distribution</h1>
                    <div className="plot">
                      <Plot
                        data={ JSON.parse(anonData[anonDataKey].plots.course_rating_plot).data } 
                        layout={ JSON.parse(anonData[anonDataKey].plots.instructor_rating_plot).layout }
                      />
                    </div>
                  </div>
                  <div>
                    <h1>Instructor Rating Distribution</h1>
                    <div className="plot">
                      <Plot 
                        data={ JSON.parse(anonData[anonDataKey].plots.instructor_rating_plot).data } 
                        layout={ JSON.parse(anonData[anonDataKey].plots.instructor_rating_plot).layout }
                      />
                    </div>
                  </div>
                </>
              }
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default CourseAnalytics
import React, { useRef, useEffect, useState } from 'react'
import { COURSE_ANALYTICS_URLS, DEC_PLACES } from '../../config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from "react-router-dom";
import { useCourseAnalyticsContext } from '../../hooks/useCourseAnalyticsContext';
import SearchDropdown from '../../components/SearchDropdown/SearchDropdown';
import plot_kde from '../../utils/plot_kde'
import { useLocation } from 'react-router-dom'

import './course_analytics.css'

const CourseAnalytics = () => {
  const navigate = useNavigate()

  const query = new URLSearchParams(useLocation().search)
  const queryEmail = query.get('email')

  const { user } = useAuthContext()
  const { usersToChoose, courses, anonData, allCoursesInDb, courseAnalyticsDispatch } = useCourseAnalyticsContext()

  const [ chosenPerson, setChosenPerson ] = useState(null)
  const [ chosenPersonName, setChosenPersonName ] = useState('')
  const [ chosenCourse, setChosenCourse ] = useState(null)
  const [ chosenPeriod, setChosenPeriod ] = useState(1000)

  const [ anonDataKey, setAnonDataKey ] = useState('')
  const [ anonDataError, setAnonDataError ] = useState('')
  const [ plottingError, setPlottingError ] = useState('')
  const [ coursesError, setCoursesError ] = useState('')

  const usersDropdownRef = useRef(null)

  useEffect(() => {
    if (chosenCourse && chosenPeriod){
      setAnonDataKey(chosenCourse.course + chosenPeriod)
    }
  })

  // Don't allow non-logged in users to access this page
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { mssg: 'Must be Logged In', status: 'error'}})
    }
  }, [user, navigate]);

  // On first render or when userToChoose is set, set chosenPerson
  useEffect(() => {
    if (user && !chosenPerson) {
      if (queryEmail) {
          if (usersToChoose) {
            const chosenPersonTmp = usersToChoose.find(person => person.email === queryEmail)
            if (!chosenPersonTmp) {
              navigate('/dashboard', { state: { mssg: 'You cannot view data for this user. This incident will be reported!', status: 'error'}})
              return
            }
            courseAnalyticsDispatch({type: 'SET_COURSES', payload: null})
            setChosenPerson(chosenPersonTmp)
            setChosenPersonName(`${chosenPersonTmp.first_name} ${chosenPersonTmp.last_name}`)
            if (usersDropdownRef?.current) {
              usersDropdownRef.current.value = chosenPersonTmp.email
            }
          }
      }
      else {
        courseAnalyticsDispatch({type: 'SET_COURSES', payload: null})
        setChosenPerson(user)
        setChosenPersonName(`${user.first_name} ${user.last_name}`)
      }
    }
  }, [user, courseAnalyticsDispatch, usersToChoose])

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

  // Fetch student evals for current user or chosen user - run whenever chosenPerson or chosenPeriod changes
  useEffect(() => {
    const fetchCourses = async () => {
      const response = await fetch(
        `${COURSE_ANALYTICS_URLS.getCourses}/${chosenPerson.email}/${chosenPeriod}`, 
        {
          method: 'GET',
          credentials: 'include'
        }
      )

      const data = await response.json()
      if (response.ok) {
        courseAnalyticsDispatch({type: 'SET_COURSES', payload: data})
        setChosenCourse(data[0])
        setCoursesError('')
      }
      else {
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
    if (chosenPerson) {
      if (!courses) {
        console.log('fetching courses')
        fetchCourses()
      }
      else if (!chosenCourse) {
        setChosenCourse(courses[0])
      }
    }
  }, [courses, chosenPerson, chosenPeriod, courseAnalyticsDispatch])

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
          setPlottingError('')
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
    
    if (chosenCourse) {
      if (!(anonData && anonData[chosenCourse.course + chosenPeriod])) {
        console.log('fetching anon data')
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
    }
  }, [chosenCourse, chosenPeriod, courseAnalyticsDispatch, courses, anonData])

  const choosePerson = (option) => {
    const chosenPersonTmp = usersToChoose.find(person => `${person.first_name} ${person.last_name}` === option)
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

  const chooseCourseFromAllCourses = (option) => {
    let courseTmp = courses.find(course => course.course === option)
    if (!courseTmp) {
      courseTmp = {
        ave_course_rating_mean: null,
        ave_instructor_rating_mean: null,
        course: option
      }
    }
    setChosenCourse(courseTmp)
  }

  const [courseRatingsPlot, setCourseRatingsPlot] = useState(null)
  const [instrRatingsPlot, setInstrRatingsPlot] = useState(null)
  useEffect(() => {
    if (anonData?.[anonDataKey]?.plots?.course_rating_plot && chosenCourse && chosenPersonName) {
      const { data: courseData, layout: courseLayout } = JSON.parse(anonData[anonDataKey].plots.course_rating_plot)
      const { data: instructorData, layout: instructorLayout } = JSON.parse(anonData[anonDataKey].plots.instructor_rating_plot)
      setCourseRatingsPlot(plot_kde(courseData, courseLayout, chosenPersonName, chosenCourse.ave_course_rating_mean, 'Course'))
      setInstrRatingsPlot(plot_kde(instructorData, instructorLayout, chosenPersonName, chosenCourse.ave_instructor_rating_mean, 'Instructor'))
    }
  }, [anonData, anonDataKey, chosenCourse, chosenPersonName])

  return (
    <div className="courseAnalytics">
      <h1 className="pageHeader">Course Analytics</h1>
      <div className='courseAnalyticsBody'>
        <div className='courseAnalyticsCard'>
          <h1>Filters</h1>
          <div className='dropdowns'>
            { user && user.position === 'chair' &&
              <div className='choosePersonDropdown dropdownBox'>
                { usersToChoose &&
                  <SearchDropdown
                    label='Choose Person'
                    placeholder='Search for users'
                    options={ usersToChoose.map(person => `${person.first_name} ${person.last_name}`) }
                    setChosenOption={ choosePerson }
                    dropdownClassName='dropdown'
                    includeNone={false}
                    initialSearchQuery={ chosenPerson ? `${chosenPerson.first_name} ${chosenPerson.last_name}` : `${user?.first_name} ${user?.last_name}`}
                  />
                }
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
                  { allCoursesInDb && courses &&
                    <SearchDropdown
                      label='Search All Courses'
                      placeholder='Search for course'
                      options={ allCoursesInDb }
                      setChosenOption={ chooseCourseFromAllCourses }
                      dropdownClassName='dropdown'
                      includeNone={false}
                    />
                  }
                </div>
              </>
            }
            <div className="choosePeriodDropdown dropdownBox">
              <h3>Showing Data From</h3>
              <select name="course" id="course" className="dropdown" required onChange={ handleChangeYear }>
                <option value={1000}>All Time</option>
                <option value={1}>Last Year</option>
                <option value={5}>Last Five Years</option>
                <option value={10}>Last Ten Years</option>
              </select>
            </div>
          </div>
        </div>

        <div className='analyticsTableDiv'>
          { !coursesError && <h1>Data for {chosenCourse ? chosenCourse.course : ''}</h1> }
          { anonDataError && <p className='anonDataError'>{ anonDataError }</p> }
          { !coursesError && 
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
                  <td>{ chosenCourse?.ave_course_rating_mean ? chosenCourse?.ave_course_rating_mean?.toFixed(DEC_PLACES) : 'n/a'}</td>
                  <td>{ chosenCourse?.ave_instructor_rating_mean ? chosenCourse?.ave_instructor_rating_mean?.toFixed(DEC_PLACES) : 'n/a' }</td>
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
          }
        </div>

        <div className="analyticsPlot">
          { plottingError ? <p className='plottingError'>{ plottingError }</p> :
            <>
              { anonData?.[anonDataKey]?.plots && !anonData[anonDataKey].plots.error &&
                <>
                  <div>
                    <h1>Course Rating Distribution</h1>
                    <div className="plot">
                      { courseRatingsPlot }
                    </div>
                  </div>
                  <div>
                    <h1>Instructor Rating Distribution</h1>
                    <div className="plot">
                      { instrRatingsPlot }
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
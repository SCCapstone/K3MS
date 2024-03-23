import React, { useEffect, useState, useRef } from 'react'
import { STUDENT_EVALS_URL, COURSE_ANALYTICS_URLS } from '../../config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate, useLocation } from "react-router-dom";
import { useCourseAnalyticsContext } from '../../hooks/useCourseAnalyticsContext';
import { useStudentEvalsContext } from '../../hooks/useStudentEvalsContext';
import './student_evaluations.css'

const StudentEvaluations = () => {
  const navigate = useNavigate()

  const query = new URLSearchParams(useLocation().search)
  const queryEmail = query.get('email')

  const { user } = useAuthContext()
  const { courses, studentEvalsDispatch } = useStudentEvalsContext()
  const { usersToChoose, courseAnalyticsDispatch } = useCourseAnalyticsContext()

  const [chosenPerson, setChosenPerson] = useState(null)
  const [otherUserEvals, setOtherUserEvals] = useState(null)

  const [error, setError] = useState(null)

  const usersDropdownRef = useRef(null)

  const [courseQuery, setCourseQuery] = useState('')

  const fetchOtherUserEvals = async (email) => {
    const response = await fetch(`${STUDENT_EVALS_URL}/${email}`, {
      method: 'GET',
      credentials: 'include'
    })

    const data = await response.json()
    if (response.ok) {
      // setErrorFunc(null)
      setOtherUserEvals(data)
    }
    else if (response.status === 404) {
      setOtherUserEvals(null)
      // setErrorFunc(data?.error)
    }
  }

  // On first render or when usersToChoose is set, set chosenPerson from url query and fetch data
  useEffect(() => {
    if (!chosenPerson && queryEmail && usersToChoose) {
      const chosenPersonTmp = usersToChoose.find(person => person.email === queryEmail)
      if (!chosenPersonTmp) {
        navigate('/dashboard', { state: { mssg: 'You cannot view data for this user. This incident will be reported!', status: 'error'}})
        return
      }
      if (chosenPersonTmp.email !== user.email) {
        setChosenPerson(chosenPersonTmp)
        if (usersDropdownRef?.current) {
          usersDropdownRef.current.value = chosenPersonTmp.email
        }
        fetchOtherUserEvals(chosenPersonTmp.email)
      }
    }
  }, [user, usersToChoose])

  // Don't allow non-logged in users to access this page
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { mssg: 'Must be Logged In', status: 'error'}})
    }
  }, [user, navigate]);

  // Fetch student evals
  useEffect(() => {
    const fetchStudentEvals = async () => {
      const response = await fetch(STUDENT_EVALS_URL, {
        method: 'GET',
        credentials: 'include'
      })

      const data = await response.json()
      if (response.ok) {
        studentEvalsDispatch({type: 'SET_COURSES', payload: data})
      }
      else if (!response.ok) {
        console.log(data?.error)
        setError(data?.error)
      }
    }
    if (!courses) {
      fetchStudentEvals()
    }
  }, [courses, studentEvalsDispatch])

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

  const choosePerson = (e) => {
    const chosenPersonTmp = usersToChoose.find(person => person.email === e.target.value)
    if (chosenPersonTmp.email === user.email) {
      setChosenPerson(null)
      setOtherUserEvals(null)
      return
    }
    setChosenPerson(chosenPersonTmp)
    fetchOtherUserEvals(chosenPersonTmp.email)
  }

  // Function to handle button click and navigate to another page with data
  const handleButtonClick = (course) => {
    // Encode course object into a query parameter
    const courseQueryParam = encodeURIComponent(JSON.stringify(course));
    // Navigate to the desired page with data
    if (chosenPerson)
      navigate(`/student-evals-details?course=${courseQueryParam}&email=${chosenPerson.email}`);
    else
      navigate(`/student-evals-details?course=${courseQueryParam}`);
  }

  return (
    <div className="studentEvalsBody">
      <h1 className="pageHeader">My Student Evaluations</h1>
        <div className='studentEvalsCard studentEvalsOptions'>
          <div className='studentEvalsButtons'>
            { user && user.position === 'chair' &&
                <div className='studentEvalsDropdownBox'>
                  <h3>Choose Person</h3>
                  <select name="person" id="person" className="studentEvalsDropdown" required  onChange={ choosePerson } ref={ usersDropdownRef }>
                    { usersToChoose && usersToChoose.map((person, i) =>
                      <option key={i} value={ person.email }>{ `${person.first_name} ${person.last_name}` }</option>
                    )}
                  </select>
                </div>
            }
            <div className='studentEvalsDropdownBox'>
              <h3>Filter Courses</h3>
              <input type="text" className="studentEvalsDropdown" onChange={ (e) => setCourseQuery(e.target.value) } placeholder="Enter Course Name" />
            </div>
          </div>
        </div>
      { (!chosenPerson && courses) || (chosenPerson && otherUserEvals) ?
          <div className='courses'>
            { chosenPerson ? 
              otherUserEvals?.filter(
                (course) => course.course.toLowerCase().includes(courseQuery.toLowerCase())
              ).map((course, i) => 
                <div className='studentEvalsCard' key={i}>
                  <h1>{ course.course }</h1>
                  <div className='studentEvalsCardContent'>
                    <p>Average Course Rating: { course.ave_course_rating_mean.toFixed(2) }</p>
                    <p>Average Instructor Rating: { course.ave_instructor_rating_mean.toFixed(2) }</p>
                    <button onClick={() => handleButtonClick(course.course)}>Details</button>
                  </div>
                </div>
              ) : 
              courses?.filter(
                (course) => course.course.toLowerCase().includes(courseQuery.toLowerCase())
              ).map((course, i) => 
                <div className='studentEvalsCard' key={i}>
                  <h1>{ course.course }</h1>
                  <div className='studentEvalsCardContent'>
                    <p>Average Course Rating: { course.ave_course_rating_mean.toFixed(2) }</p>
                    <p>Average Instructor Rating: { course.ave_instructor_rating_mean.toFixed(2) }</p>
                    <button onClick={() => handleButtonClick(course.course)}>Details</button>
                  </div>
                </div>
              )
            }
          </div> :  error ? <p className='studentEvalError'>{ error }</p> : <p>Loading...</p>
        }
    </div>
  )
}

export default StudentEvaluations

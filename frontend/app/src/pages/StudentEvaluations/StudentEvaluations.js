import React, { useEffect } from 'react'
import { STUDENT_EVALS_URL } from '../../config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from "react-router-dom";
import { useStudentEvalsContext } from '../../hooks/useStudentEvalsContext';
import './student_evaluations.css'

const StudentEvaluations = () => {
  const navigate = useNavigate()

  const { user } = useAuthContext()
  const { courses, studentEvalsDispatch } = useStudentEvalsContext()

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

      if (response.ok) {
        const data = await response.json()
        studentEvalsDispatch({type: 'SET_COURSES', payload: data})
      }
      else if (response.status === 401) {
        console.log('error')
      }
    }
    if (!courses) {
      fetchStudentEvals()
    }
  }, [courses, studentEvalsDispatch])

  // Function to handle button click and navigate to another page with data
  const handleButtonClick = (course) => {
    // Encode course object into a query parameter
    const courseQueryParam = encodeURIComponent(JSON.stringify(course));
    // Navigate to the desired page with data
    navigate(`/student-evals-details?course=${courseQueryParam}`);
  }
  return (
    <div className="studentEvalsBody">
      <h1 className="pageHeader">My Student Evaluations</h1>
      <div className='courses'>
        {courses && courses.map((course, i) => {
          return (
            <div className='studentEvalsCard' key={i}>
              <h1>{ course.course }</h1>
              <div className='studentEvalsCardContent'>
                <p>Average Course Rating: { course.ave_course_rating_mean.toFixed(2) }</p>
                <p>Average Instructor Rating: { course.ave_instructor_rating_mean.toFixed(2) }</p>
                {/* Add button here */}
                <button onClick={() => handleButtonClick(course.course)}>Details</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StudentEvaluations

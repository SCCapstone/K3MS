import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { STUDENT_EVALS_DETAILS_URL } from '../../config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from "react-router-dom";
import { useStudentEvalsDetailsContext } from '../../hooks/useStudentEvalsDetailsContext';
import './student_evaluations_details.css'

const StudentEvaluationsDetails = () => {
  const navigate = useNavigate()
  const location = useLocation();

  const { user } = useAuthContext()
  const { courses, studentEvalsDetailsDispatch } = useStudentEvalsDetailsContext()
  const [ name, setName ] = useState('');

  // TEST for Dropdown
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);

  // Don't allow non-logged in users to access this page
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { mssg: 'Must be Logged In', status: 'error'}})
    }
  }, [user, navigate]);
  
  // Fetch student evals details
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const courseQueryParam = queryParams.get('course');

    const course_name = JSON.parse(decodeURIComponent(courseQueryParam));
    setName(course_name);

    const fetchStudentEvalsDetails = async () => {
      // const response = await fetch(STUDENT_EVALS_DETAILS_URL, {
      const response = await fetch(`${STUDENT_EVALS_DETAILS_URL}/${course_name}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        studentEvalsDetailsDispatch({type: 'SET_COURSES', payload: data})
        // Extract available semester and year options for each course
        const semesters = new Set();
        const years = new Set();

        data.forEach(course => {
          semesters.add(course.semester);
          years.add(course.year);
        });

        setSemesterOptions([...semesters]);
        setYearOptions([...years]);
      }
      else if (response.status === 401) {
        console.log('error')
      }
    }
    if (!courses || courses[0].course != course_name) {
      // studentEvalsDetailsDispatch({type: 'SET_COURSES', payload: null})
      fetchStudentEvalsDetails()
    } else{
      console.log(courses)
    }
  }, [courses, studentEvalsDetailsDispatch])

  // Event handler for selecting semester
  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };

  useEffect(() => {
    console.log("Selected Semester:", selectedSemester);
  }, [selectedSemester]);

  // Event handler for selecting year
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  useEffect(() => {
    console.log("Selected Year:", selectedYear);
  }, [selectedYear]);

  return (
    <div className="studentEvalsDetailsBody">
      <h1 className="pageHeader">{name} Evaluation Details</h1>
      <div className="dropdown">
        {/* Dropdown for selecting semester */}
        <select value={selectedSemester} onChange={handleSemesterChange}>
          <option value="">Select Semester</option>
          {/* Map over semester options and populate the dropdown */}
          {/* Assuming semesterOptions is an array of semester options */}
          {semesterOptions.map((semester) => (
            <option key={semester} value={semester}>
              {semester}
            </option>
          ))}
        </select>
        {/* Dropdown for selecting year */}
        <select value={selectedYear} onChange={handleYearChange}>
          <option value="">Select Year</option>
          {/* Map over year options and populate the dropdown */}
          {/* Assuming yearOptions is an array of year options */}
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="course_details">
        {courses &&
          courses.map((course, i) => {
            // Check if the course matches the selected semester and year
            if (course.semester === selectedSemester && course.year === selectedYear) {
              return (
                <div className="studentEvalsDetailsCard" key={i}>
                  <h1>{course.semester} {course.year}</h1>
                  <div className="studentEvalsDetailsCardContent">
                    
                    <p>Instructor_type       :     {course.instructor_type                  }</p>
                    <p>Participants_count    :     {course.participants_count               }</p>
                    <p>Number_of_returns     :     {course.number_of_returns                }</p>
                    <p>Course_rating_mean    :     {course.course_rating_mean               }</p>
                    <p>Instructor_rating_mean:     {course.instructor_rating_mean           }</p>
                    <div className='questions'>
                      {course.details.map((detail, j) => (
                        
                        <div key={j}>
                          <div className="SPACER">_</div>
                          <p>{detail.question_id}. {detail.question}</p>
                          <p>Mean: {detail.mean}</p>
                          <p>STD: {detail.std}</p>
                          <p>Median: {detail.median}</p>
                          <p>Returns: {detail.returns}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            } else {
              // If the course doesn't match, return null or an empty fragment
              return null;
            }
          })}
      </div>
    </div>
  );
}

export default StudentEvaluationsDetails
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { STUDENT_EVALS_DETAILS_URL } from '../../config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from "react-router-dom";
import { useStudentEvalsContext } from '../../hooks/useStudentEvalsContext';
import './student_evaluations_details.css'

const StudentEvaluationsDetails = () => {
  const navigate = useNavigate()

  const query = new URLSearchParams(useLocation().search)
  const queryEmail = query.get('email')
  const courseQueryParam = query.get('course');
  const course_name = JSON.parse(decodeURIComponent(courseQueryParam));

  const { user } = useAuthContext()
  const { courseDetails, studentEvalsDispatch } = useStudentEvalsContext()
  const [ name, setName ] = useState(course_name);

  // TEST for Dropdown
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState(null);

  // Don't allow non-logged in users to access this page
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { mssg: 'Must be Logged In', status: 'error'}})
    }
  }, [user, navigate]);
  
  // Fetch student evals details
  useEffect(() => {
    const fetchStudentEvalsDetails = async () => {
      let url = `${STUDENT_EVALS_DETAILS_URL}/${course_name}`
      if (queryEmail && queryEmail !== user.email) {
        url = `${STUDENT_EVALS_DETAILS_URL}/${course_name}/${queryEmail}`
      }
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data)
        studentEvalsDispatch({type: 'SET_COURSE_DETAILS', payload: data})
        // Extract available semester and year options for each course
        const years = new Set();

        data.forEach(course => {
          years.add(course.year);
        });
        setYearOptions([...years]);
        setSelectedYear([...years][0])
      }
      else if (response.status === 401) {
        console.log('error')
      }
    }
    if (
      !courseDetails || 
      courseDetails[0].course !== course_name || 
      (queryEmail && courseDetails[0].email !== queryEmail) ||
      (!queryEmail && courseDetails[0].email !== user.email)
    ) {
      fetchStudentEvalsDetails()
    } 
    else {
      // If context is already set but options are empty, fill them in
      if (yearOptions.length === 0) {
      const years = new Set();
        courseDetails.forEach(course => {
          years.add(course.year);
        });
        setYearOptions([...years]);
        setSelectedYear([...years][0])
      }
    }
  }, [courseDetails, studentEvalsDispatch])

  // Always update the semester options when the year changes
  useEffect(() => {
    if (courseDetails && selectedYear) {
      const semesters = new Set();
      courseDetails.forEach(course => {
        if (course.year === selectedYear) {
          semesters.add(course.semester);
        }
      })
      setSemesterOptions([...semesters]);
      setSelectedSemester([...semesters][0])
    }
  }, [selectedYear, courseDetails])

  // Always update the section options when the semester changes
  useEffect(() => {
    if (courseDetails && selectedSemester) {
      const sections = new Set();
      courseDetails.forEach(course => {
        if (
          course.year === selectedYear &&
          course.semester === selectedSemester
        ) {
          sections.add(course.section);
        }
      })
      setSectionOptions([...sections]);
      setSelectedSection([...sections][0])
    }
   }, [selectedYear, selectedSemester, courseDetails])

  // Always update the current course based on year, semester, and section
  useEffect(() => {
    if (courseDetails && selectedYear && selectedSemester && selectedSection) {
      courseDetails.forEach(course => {
        if (
          course.year === selectedYear &&
          course.semester === selectedSemester &&
          course.section === selectedSection
        ) {
          // set course
          setSelectedCourse(course)
        }
      })
    }
  }, [selectedYear, selectedSemester, selectedSection])

  // Event handler for selecting year
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };
  
  // Event handler for selecting semester
  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };

  // Event handler for selecting section
  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
  };

  return (
    <div className="studentEvalsDetailsBody">
      <h1 className="pageHeader">{name} Evaluation Details</h1>
      <div className="studentEvalsCard">
        <h1>Filters</h1>
        <div className='dropdowns'>
          <div className='dropdownBox'>
            <h3>Year</h3>
            <select className='dropdown' value={selectedYear} onChange={handleYearChange}>
              {yearOptions.map((year) => (
                <option key={ year } value={ year }>{ year }</option>
              ))}
            </select>
          </div>
          <div className='dropdownBox'>
            <h3>Semester</h3>
            <select className='dropdown' value={selectedSemester} onChange={handleSemesterChange}>
              {semesterOptions.map((semester) => (
                <option key={ semester } value={ semester }>{ semester }</option>
              ))}
            </select>
          </div>
          <div className='dropdownBox'>
            <h3>Section</h3>
            <select className='dropdown' value={selectedSection} onChange={handleSectionChange}>
              {sectionOptions.map((section) => (
                <option key={ section } value={ section }>{ section }</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="course_details">
        {selectedCourse &&
          <div className="studentEvalsDetailsCard">
            <h1>{selectedCourse.semester} {selectedCourse.year} {selectedCourse.section}</h1>
            <div className="studentEvalsDetailsCardContent">
              <p>Instructor_type       :     {selectedCourse.instructor_type                  }</p>
              <p>Participants_count    :     {selectedCourse.participants_count               }</p>
              <p>Number_of_returns     :     {selectedCourse.number_of_returns                }</p>
              <p>Course_rating_mean    :     {selectedCourse.course_rating_mean               }</p>
              <p>Instructor_rating_mean:     {selectedCourse.instructor_rating_mean           }</p>
              <div className='questions'>
                {selectedCourse.details.map((detail, j) => (
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
          }
      </div>
    </div>
  );
}

export default StudentEvaluationsDetails
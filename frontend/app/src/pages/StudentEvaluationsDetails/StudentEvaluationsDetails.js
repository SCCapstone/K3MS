import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { STUDENT_EVALS_DETAILS_URL } from '../../config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from "react-router-dom";
import { useStudentEvalsContext } from '../../hooks/useStudentEvalsContext';
import './student_evaluations_details.css'

const StudentEvaluationsDetails = () => {
  const navigate = useNavigate()
  const location = useLocation();

  const { user } = useAuthContext()
  const { courseDetails, studentEvalsDispatch } = useStudentEvalsContext()
  const [ name, setName ] = useState('');

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
    const queryParams = new URLSearchParams(location.search);
    const courseQueryParam = queryParams.get('course');

    const course_name = JSON.parse(decodeURIComponent(courseQueryParam));
    setName(course_name);

    const fetchStudentEvalsDetails = async () => {
      const response = await fetch(`${STUDENT_EVALS_DETAILS_URL}/${course_name}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
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
    if (!courseDetails || courseDetails[0].course !== course_name) {
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
      <h2 className="pageHeader">{name} Evaluation Details</h2>
      <div className="studentEvalsCard">
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
      <div>
        {selectedCourse &&
          // <div className="studentEvalsDetailsCard">
          <div className="course_details">
            <h1>{selectedCourse.semester} {selectedCourse.year} {selectedCourse.section}</h1>
              <table className="introTable">
                <thead>
                  <tr>
                    <th>Instructor Type</th>
                    <th>Participants Count</th>
                    <th>Number of Returns</th>
                    <th>Course Rating Mean</th>
                    <th>Instructor Rating Mean</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{selectedCourse.instructor_type}</td>
                    <td>{selectedCourse.participants_count}</td>
                    <td>{selectedCourse.number_of_returns}</td>
                    <td>{selectedCourse.course_rating_mean}</td>
                    <td>{selectedCourse.instructor_rating_mean}</td>
                  </tr>
                </tbody>
              </table>
              
              <div className='questions'>
                <table className="evaluationsTable">
                  <thead>
                    <tr>
                      <th>Evaluation Question</th>
                      <th>Mean</th>
                      <th>STD</th>
                      <th>Median</th>
                      <th>Returns</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCourse.details.map((detail, j) => (
                      <tr key={j}>
                        <td className="evalQuestion">{detail.question_id}. {detail.question}</td>
                        <td>{detail.mean}</td>
                        <td>{detail.std}</td>
                        <td>{detail.median}</td>
                        <td>{detail.returns}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </div>
          }
      </div>
    </div>
  );
}

export default StudentEvaluationsDetails
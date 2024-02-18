import React, { useState, useEffect } from 'react';
import { LIMITED_GRANTS_URL, LIMITED_PUBS_URL, LIMITED_EVALS_URL } from '../../config';
import { useAuthContext } from '../../hooks/useAuthContext'
import { useDashboardContext } from '../../hooks/useDashboardContext';
import { useNavigate } from "react-router-dom";
import './dashboard.css';

async function getDashboardData(route, dispatch, action, setError) {
  const response = await fetch(route, {
    method: 'GET',
    credentials: 'include'
  })
  const json = await response.json()
  if (response.ok) {
    dispatch({type: action, payload: json})
  }
  else {
    setError(json.error ? json.error : 'Error')
  }
}

const Dashboard = () => {
  const navigate = useNavigate()

  const { user } = useAuthContext()
  const { grants, pubs, courses, dashboardDispatch } = useDashboardContext()

  const [grantsError, setGrantsError] = useState('');
  const [pubsError, setPubsError] = useState('');
  const [coursesError, setCoursesError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { mssg: 'Must be Logged In', status: 'error'}})
    }
  }, [user, navigate]);

  useEffect(() => {
    // Get data for each card
    if (!pubs) {
      getDashboardData(LIMITED_PUBS_URL, dashboardDispatch, 'SET_PUBS', setPubsError)
    } 
    if (!grants) {
      getDashboardData(LIMITED_GRANTS_URL, dashboardDispatch, 'SET_GRANTS', setGrantsError)
    }
    if (!courses) {
      getDashboardData(LIMITED_EVALS_URL, dashboardDispatch, 'SET_COURSES', setCoursesError)
    }
    console.log(courses)
  }, [grants, pubs, courses, dashboardDispatch])

  return (
    <div>
      <h1 className='pageHeader'>Dashboard</h1>
      <div className='dashboardBody'>
        <div className='dashboardCard'>
          <div className='dashboardCardHeader'>
            <h1>Grants</h1>
            <button onClick={ (e) => navigate('/research-info') }>See All</button>
          </div>
          {grantsError && <p className='error'>{grantsError}</p>}
          <div className="dashboardCardContent">
            <div className="dashboardTable">
              { grants ?
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Amount</th>
                      <th>Grant Year</th>
                    </tr>
                  </thead>
                  <tbody>
                  { grants.map((grant) => {
                    return (
                      <tr key={ grant.title }>
                        <td>{ grant.title }</td>
                        <td>{ grant.amount }</td>
                        <td>{ grant.year }</td>
                      </tr>
                    )
                  })}
                  </tbody>
                </table>
                : grantsError ? grantsError : <p>Loading...</p>
              }
            </div>
          </div>
        </div>
        <div className='dashboardCard'>
          <div className='dashboardCardHeader'>
            <h1>Publications</h1>
            <button onClick={ (e) => navigate('/research-info') }>See All</button>
          </div>
          {grantsError && <p className='error'>{grantsError}</p>}
          <div className="dashboardCardContent">
            <div className="dashboardTable">
              { pubs ?
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Authors</th>
                      <th>Publication Year</th>
                      <th>ISBN</th>
                    </tr>
                  </thead>
                  <tbody>
                  { pubs.map((pub) => {
                    return (
                      <tr key={ pub.title }>
                        <td>{ pub.title }</td>
                        <td>{ pub.authors }</td>
                        <td>{ pub.publication_year }</td>
                        <td>{ pub.isbn }</td>
                      </tr>
                    )
                  })}
                  </tbody>
                </table>
                : pubsError ? pubsError : <p>Loading...</p>
              }
            </div>
          </div>
        </div>
        <div className='dashboardCard'>
          <div className='dashboardCardHeader'>
            <h1>Student Evals</h1>
            <button onClick={ (e) => navigate('/student-evals') }>See All</button>
          </div>
          {coursesError && <p className='error'>{coursesError}</p>}
          <div className="dashboardCardContent">
            <div className="dashboardTable">
              { courses ?
                <table>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Ave. Course Rating</th>
                      <th>Ave. Instr. Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                  { courses.map((course) => {
                    return (
                      <tr key={ course.course }>
                        <td>{ course.course }</td>
                        <td>{ course.ave_course_rating_mean.toFixed(2) }</td>
                        <td>{ course.ave_instructor_rating_mean.toFixed(2) }</td>
                      </tr>
                    )
                  })}
                  </tbody>
                </table>
                : coursesError ? coursesError : <p>Loading...</p>
              }
            </div>
          </div>
        </div>
        <div className='dashboardCard'>
          <div className='dashboardCardHeader'>
            <h1>Course Analytics</h1>
            <button onClick={ (e) => navigate('/course-analytics') }>See All</button>
          </div>
          {coursesError && <p className='error'>{coursesError}</p>}
          <div className="dashboardCardContent">
            <div className="dashboardTable">
              { courses ?
                <table>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Ave. Course Rating</th>
                      <th>Ave. Instr. Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                  { courses.map((course) => {
                    return (
                      <tr key={ course.course }>
                        <td>{ course.course }</td>
                        <td>{ course.ave_course_rating_mean.toFixed(2) }</td>
                        <td>{ course.ave_instructor_rating_mean.toFixed(2) }</td>
                      </tr>
                    )
                  })}
                  </tbody>
                </table>
                : coursesError ? coursesError : <p>Loading...</p>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

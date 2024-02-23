import React, { useState, useEffect, useRef } from 'react';
import { LIMITED_GRANTS_URL, LIMITED_PUBS_URL, LIMITED_EVALS_URL, COURSE_ANALYTICS_URLS } from '../../config';
import { useAuthContext } from '../../hooks/useAuthContext'
import { useDashboardContext } from '../../hooks/useDashboardContext';
import { useNavigate } from "react-router-dom";
import Plot from 'react-plotly.js';
import './dashboard.css';

async function getDashboardData(route, dispatch, action, setError) {
  const response = await fetch(route, {
    method: 'GET',
    credentials: 'include'
  })
  const json = await response.json()
  if (response.ok) {
    dispatch({type: action, payload: json})
    return json
  }
  else {
    setError(json.error ? json.error : 'Error')
  }
}

const Dashboard = () => {
  const navigate = useNavigate()

  const { user } = useAuthContext()
  const { grants, pubs, courses, anonData, dashboardDispatch } = useDashboardContext()

  const plotRef = useRef(null)

  const [plot, setPlot] = useState(null)
  const [grantsError, setGrantsError] = useState('');
  const [pubsError, setPubsError] = useState('');
  const [coursesError, setCoursesError] = useState('');
  const [analyticsError, setAnalyticsError] = useState('');
  const [plottingError, setPlottingError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { mssg: 'Must be Logged In', status: 'error'}})
    }
  }, [user, navigate]);
  
  const updatePlot = () => {
    // setPlotWidth(plotRef?.current?.clientHeight)
    // console.log('resize', plotRef?.current?.clientHeight,plotRef?.current?.clientWidth)
    console.log(plot)
    if (plot) {
      console.log('resize', plotRef?.current?.clientHeight,plotRef?.current?.clientWidth)
      plot.layout.width = String(plotRef?.current?.clientWidth)
      plot.layout.height = null
      setPlot({...plot})
    }
  }

  useEffect(() => {
    console.log('useEffect')  
    window.addEventListener('resize', updatePlot);
    updatePlot();
    return () => window.removeEventListener('resize', updatePlot);
  }, [window]);

  useEffect(() => {
    const getData = async () => {
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
      if (courses && !anonData) {
        const data = await getDashboardData(
          COURSE_ANALYTICS_URLS.getAnonData + `/${courses[0].course}/1`, 
          dashboardDispatch, 
          'SET_ANON_DATA', 
          setAnalyticsError
        )
        if (!analyticsError && data.plots) {
          if (data.plots.error) {
            setPlottingError(data.plots.error)
          }
          else {
            const plotData = JSON.parse(data.plots.course_rating_plot).data
            const plotLayout = JSON.parse(data.plots.course_rating_plot).layout
            
            plotLayout.width = window.innerWidth * 0.25
            plotLayout.height = window.innerWidth * 0.25
            plotLayout.responsive = true

            setPlot({data: plotData, layout: plotLayout})  
            setPlottingError('')
          }
        }
        }
    }
    getData()
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
          <div className="dashboardCardContent">
            {grantsError && <p className='DashboardError'>{grantsError}</p>}
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
                : grantsError ? '' : <p>Loading...</p>
              }
            </div>
          </div>
        </div>
        <div className='dashboardCard'>
          <div className='dashboardCardHeader'>
            <h1>Publications</h1>
            <button onClick={ (e) => navigate('/research-info') }>See All</button>
          </div>
          <div className="dashboardCardContent">
            {pubsError && <p className='DashboardError'>{pubsError}</p>}
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
                : pubsError ? '' : <p>Loading...</p>
              }
            </div>
          </div>
        </div>
        <div className='dashboardCard'>
          <div className='dashboardCardHeader'>
            <h1>Student Evals</h1>
            <button onClick={ (e) => navigate('/student-evals') }>See All</button>
          </div>
          <div className="dashboardCardContent">
            {coursesError && <p className='DashboardError'>{coursesError}</p>}
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
                : coursesError ? '' : <p>Loading...</p>
              }
            </div>
          </div>
        </div>
        <div className='dashboardCard'>
          <div className='dashboardCardHeader'>
            <h1>Course Analytics</h1>
            <button onClick={ (e) => navigate('/course-analytics') }>See All</button>
          </div>
          <div className="dashboardCardContent" ref={ plotRef }>
            <h2>{ courses?.[0]?.course }</h2>
            {coursesError && <p className='DashboardError'>{coursesError}</p>}
            { anonData ?
                plot ? 
                  <div>
                    <div className="dashboardPlot">
                      <Plot
                        data={ plot.data } 
                        layout={ plot.layout }
                      />
                    </div>
                  </div> 
                  : plottingError ? <p className='DashboardError'>{ plottingError }</p> : ''
                : analyticsError ? '' : <p>Loading...</p>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

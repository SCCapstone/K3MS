import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { GRANTS_URL, PUBS_URL, EXPEN_URL } from '../../config';
import { useNavigate } from "react-router-dom";
import { useResearchInfoContext } from '../../hooks/useResearchInfoContext';
import './research_info.css'

const ResearchInfo = () => {
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const { grants, pubs, expen, researchInfoDispatch } = useResearchInfoContext()

  // Don't allow non-logged in users to access this page
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { mssg: 'Must be Logged In', status: 'error'}})
    }
  }, [user, navigate]);

  // Fetch grants
  useEffect(() => {
    const fetchGrants = async () => {
      const response = await fetch(GRANTS_URL, {
        method: 'GET',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        researchInfoDispatch({type: 'SET_GRANTS', payload: data})
      }
      else if (response.status === 401) {
        console.log('error')
      }
    }

    const fetchPubs = async () => {
      const response = await fetch(PUBS_URL, {
        method: 'GET',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        researchInfoDispatch({type: 'SET_PUBS', payload: data})
      }
      else if (response.status === 401) {
        console.log('error')
      }
    }

    const fetchExpen = async () => {
      const response = await fetch(EXPEN_URL, {
        method: 'GET',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        researchInfoDispatch({type: 'SET_EXPEN', payload: data})
      }
      else if (response.status === 401) {
        console.log('error')
      }
    }

    // Only fetch if state is empty
    if (!grants) {
      fetchGrants()
    }
    if (!pubs) {
      fetchPubs()
    }
    if (!expen) {
      fetchExpen()
    }
  }, [grants, expen, pubs, researchInfoDispatch])


  return (
    <div className="researchInfo">
      <h1 className='pageHeader'>Research Info</h1>
      <div className="researchInfoCard">
        <h1>Grants</h1>
        <div className="researchInfoCardContent">
          <div className="researchInfoTable">
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
              : <p>Loading...</p>
            }
          </div>
        </div>
      </div>

      <div className="researchInfoCard">
        <h1>Publications</h1>
        <div className="researchInfoCardContent">
          <div className="researchInfoTable">
            { pubs ?
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Publication Year</th>
                    <th>ISBN</th>
                  </tr>
                </thead>
                <tbody>
                { pubs.map((pub) => {
                  return (
                    <tr key={ pub.title }>
                      <td>{ pub.title }</td>
                      <td>{ pub.publication_year }</td>
                      <td>{ pub.isbn }</td>
                    </tr>
                  )
                })}
                </tbody>
              </table>
              : <p>Loading...</p>
            }
          </div>
        </div>
      </div>

      <div className="researchInfoCard">
        <h1>Expenditures</h1>
        <div className="researchInfoCardContent">
          <div className="researchInfoTable">
            { expen ?
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Calendar Year</th>
                    <th>Reporting Department</th>
                    <th>P.I.</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                { expen.map((ex) => {
                  return (
                    <tr key={ ex.amount }>
                      <td>{ ex.title }</td>
                      <td>{ ex.calendar_year }</td>
                      <td>{ ex.reporting_department }</td>
                      <td>{ ex.pi_name }</td>
                      <td>{ ex.amount }</td>
                    </tr>
                  )
                })}
                </tbody>
              </table>
              : <p>Loading...</p>
            }
          </div>
        </div>
      </div>
    </div>
  )
}



export default ResearchInfo
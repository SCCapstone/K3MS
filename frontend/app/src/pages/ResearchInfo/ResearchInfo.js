import React, { useState, useEffect, useRef } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { GRANTS_URL, PUBS_URL, EXPEN_URL, COURSE_ANALYTICS_URLS } from '../../config';
import { useNavigate, useLocation } from "react-router-dom";
import { useResearchInfoContext } from '../../hooks/useResearchInfoContext';
import './research_info.css'

const ResearchInfo = () => {
  const navigate = useNavigate()

  const query = new URLSearchParams(useLocation().search)
  const queryPage = query.get('page')?.toLowerCase()
  const queryEmail = query.get('email')

  const { user } = useAuthContext()
  const { usersToChoose, grants, pubs, expens, researchInfoDispatch } = useResearchInfoContext()

  const [grantsError, setGrantsError] = useState(null)
  const [pubsError, setPubsError] = useState(null)
  const [expenError, setExpenError] = useState(null)
  const [cardToShow, setCardToShow] = useState(queryPage ? queryPage : 'grants')
  const [chosenPerson, setChosenPerson] = useState(null)
  const [otherUserGrants, setOtherUserGrants] = useState(null)
  const [otherUserPubs, setOtherUserPubs] = useState(null)
  const [otherUserExpen, setOtherUserExpen] = useState(null)

  const usersDropdownRef = useRef(null)

  const fetchOtherUserInfo = async (url, setFunc, setErrorFunc, email) => {
    const response = await fetch(`${url}/${email}`, {
      method: 'GET',
      credentials: 'include'
    })

    const data = await response.json()
    if (response.ok) {
      setErrorFunc(null)
      setFunc(data)
    }
    else if (response.status === 404) {
      setFunc(null)
      setErrorFunc(data?.error)
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
        fetchOtherUserInfo(GRANTS_URL, setOtherUserGrants, setGrantsError, chosenPersonTmp.email)
        fetchOtherUserInfo(PUBS_URL, setOtherUserPubs, setPubsError, chosenPersonTmp.email)
        fetchOtherUserInfo(EXPEN_URL, setOtherUserExpen, () => {}, chosenPersonTmp.email)
      }
    }
  }, [user, usersToChoose])

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
        researchInfoDispatch({type: 'SET_USERS_TO_CHOOSE', payload: [
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
  }, [usersToChoose, researchInfoDispatch])


  // Don't allow non-logged in users to access this page
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { mssg: 'Must be Logged In', status: 'error'}})
    }
  }, [user, navigate]);

  // Don't allow non-chairs or non-professors to access this page
  useEffect(() => {
    if (user && (user.position !== 'chair' && user.position !== 'professor')) {
      let redirect = user ? '/dashboard' : '/login'
      navigate(redirect, { 
        state: { 
          mssg: 'You do not have access to this page - this incident will be reported', 
          status: 'error'
        }
      })
    }
  }, [user, navigate]);

  // Fetch grants
  useEffect(() => {
    const fetchGrants = async () => {
      const response = await fetch(GRANTS_URL, {
        method: 'GET',
        credentials: 'include'
      })

      const data = await response.json()
      if (response.ok) {
        setGrantsError(null)
        researchInfoDispatch({type: 'SET_GRANTS', payload: data})
      }
      else if (response.status === 404) {
        setGrantsError(data?.error)
      }
    }

    const fetchPubs = async () => {
      const response = await fetch(PUBS_URL, {
        method: 'GET',
        credentials: 'include'
      })

      const data = await response.json()
      if (response.ok) {
        setPubsError(null)
        researchInfoDispatch({type: 'SET_PUBS', payload: data})
      }
      else if (response.status === 404) {
        setPubsError(data?.error)
      }
    }

    const fetchExpen = async () => {
      const response = await fetch(EXPEN_URL, {
        method: 'GET',
        credentials: 'include'
      })

      const data = await response.json()
      if (response.ok) {
        researchInfoDispatch({type: 'SET_EXPEN', payload: data})
      }
      else if (response.status === 404) {
        setExpenError(data?.error)
      }
    }

    // Only fetch if state is empty
    if (!grants) {
      fetchGrants()
    }
    if (!pubs) {
      fetchPubs()
    }
    if (!expens) {
      fetchExpen()
    }
  }, [grants, expens, pubs, researchInfoDispatch])

  const choosePerson = (e) => {
    const chosenPersonTmp = usersToChoose.find(person => person.email === e.target.value)
    if (chosenPersonTmp.email === user.email) {
      setChosenPerson(null)
      setOtherUserGrants(null)
      setOtherUserPubs(null)
      setOtherUserExpen(null)
      return
    }
    setChosenPerson(chosenPersonTmp)
    fetchOtherUserInfo(GRANTS_URL, setOtherUserGrants, setGrantsError, chosenPersonTmp.email)
    fetchOtherUserInfo(PUBS_URL, setOtherUserPubs, setPubsError, chosenPersonTmp.email)
    fetchOtherUserInfo(EXPEN_URL, setOtherUserExpen, setExpenError, chosenPersonTmp.email)
  }

  return (
    <div className="researchInfo">
      <h1 className='pageHeader'>Research Info</h1>
      <div className='researchInfoCard options'>
        <div className='researchInfobuttons'>
          { user && user.position === 'chair' &&
            <div className='researchInfoDropdownBox'>
              <h3>Choose Person</h3>
              <select name="person" id="person" className="researchInfoDropdown" required  onChange={ choosePerson } ref={ usersDropdownRef }>
                { usersToChoose && usersToChoose.map((person, i) =>
                  <option key={i} value={ person.email }>{ `${person.first_name} ${person.last_name}` }</option>
                )}
              </select>
            </div>
          }
          <div className="researchInfoDropdownBox pageSelectorBox">
            <h3>Choose Page</h3>
            <div className="pageSelectors">
              <button 
                className={ cardToShow == 'grants' ? 'active' : ''}
                onClick={ () => setCardToShow('grants')}
              >Grants</button>
              <button 
                className={ cardToShow == 'publications' ? 'active' : ''}
                onClick={ () => setCardToShow('publications')}
              >Publications</button>
              <button 
                className={ cardToShow == 'expenditures' ? 'active' : ''}
                onClick={ () => setCardToShow('expenditures')}
              >Expenditures</button>
            </div>
          </div>
        </div>
      </div>
      
      { cardToShow === 'grants' &&
        <div className="researchInfoCard researchInfoBodyCard">
          <h1>Grants</h1>
          <div className="researchInfoCardContent">
            <div className="researchInfoTable">
              { (!chosenPerson && grants) || (chosenPerson && otherUserGrants) ?
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Amount</th>
                      <th>Grant Year</th>
                    </tr>
                  </thead>
                  <tbody>
                  { chosenPerson ?
                    otherUserGrants?.map((grant) => {
                      return (
                        <tr key={ grant.title }>
                          <td>{ grant.title }</td>
                          <td>{ grant.amount }</td>
                          <td>{ grant.year }</td>
                        </tr>
                      )
                    }) : 
                    grants?.map((grant) => {
                      return (
                        <tr key={ grant.title }>
                          <td>{ grant.title }</td>
                          <td>{ grant.amount }</td>
                          <td>{ grant.year }</td>
                        </tr>
                      )
                    })
                  }
                  </tbody>
                </table>
                : (grantsError ? <p>{grantsError}</p> : <p>Loading...</p>)
              }
            </div>
          </div>
        </div>
      }

      { cardToShow === 'publications' &&
        <div className="researchInfoCard researchInfoBodyCard">
          <h1>Publications</h1>
          <div className="researchInfoCardContent">
            <div className="researchInfoTable">
              { (!chosenPerson && pubs) || (chosenPerson && otherUserPubs) ?
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
                  { chosenPerson ?
                    otherUserPubs?.map((pub) => {
                      return (
                        <tr key={ pub.title }>
                          <td>{ pub.title }</td>
                          <td>{ pub.authors }</td>
                          <td>{ pub.publication_year }</td>
                          <td>{ pub.isbn }</td>
                        </tr>
                      )}) :
                    pubs?.map((pub) => {
                      return (
                        <tr key={ pub.title }>
                          <td>{ pub.title }</td>
                          <td>{ pub.authors }</td>
                          <td>{ pub.publication_year }</td>
                          <td>{ pub.isbn }</td>
                        </tr>
                      )
                    })
                  }
                  </tbody>
                </table>
                : (pubsError ? <p>{pubsError}</p> : <p>Loading...</p>)
              }
            </div>
          </div>
        </div>
      }

      { cardToShow === 'expenditures' &&
        <div className="researchInfoCard researchInfoBodyCard">
          <h1>Expenditures</h1>
          <div className="researchInfoCardContent">
            <div className="researchInfoTable">
              { (!chosenPerson && expens) || (chosenPerson && otherUserExpen) ?
                <table>
                  <thead>
                    <tr>
                      <th>Calendar Year</th>
                      <th>Reporting Department</th>
                      <th>P.I.</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                  { chosenPerson ? 
                    otherUserExpen.map((ex, i) => {
                      return (
                        <tr key={ i }>
                          <td>{ ex.year }</td>
                          <td>{ ex.reporting_department }</td>
                          <td>{ ex.pi_name }</td>
                          <td>{ ex.amount }</td>
                        </tr>
                      )}) :
                    expens.map((ex, i) => {
                      return (
                        <tr key={ i }>
                          <td>{ ex.year }</td>
                          <td>{ ex.reporting_department }</td>
                          <td>{ ex.pi_name }</td>
                          <td>{ ex.amount }</td>
                        </tr>
                      )})
                    }
                  </tbody>
                </table>
                : (expenError ? <p>{expenError}</p> : <p>Loading...</p>)
              }
            </div>
          </div>
        </div>
      }
    </div>
  )
}



export default ResearchInfo
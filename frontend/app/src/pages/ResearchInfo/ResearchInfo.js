import React, { useState, useEffect, useRef } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { GRANTS_URL, PUBS_URL, EXPEN_URL, COURSE_ANALYTICS_URLS, DELETE_ENTRY_URL } from '../../config';
import { useNavigate, useLocation } from "react-router-dom";
import { useResearchInfoContext } from '../../hooks/useResearchInfoContext';
import { useCourseAnalyticsContext } from '../../hooks/useCourseAnalyticsContext';
import { useDashboardContext } from '../../hooks/useDashboardContext';
import SearchDropdown from '../../components/SearchDropdown/SearchDropdown';
import './research_info.css'
import deleteIcon from '../../assets/delete-icon.svg'

const ResearchInfo = () => {
  const navigate = useNavigate()

  const query = new URLSearchParams(useLocation().search)
  const queryPage = query.get('page')?.toLowerCase()
  const queryEmail = query.get('email')

  const { user } = useAuthContext()
  const { grants, pubs, expens, researchInfoDispatch } = useResearchInfoContext()
  const { usersToChoose, courseAnalyticsDispatch } = useCourseAnalyticsContext()
  const { dashboardDispatch } = useDashboardContext()

  const [grantsError, setGrantsError] = useState(null)
  const [pubsError, setPubsError] = useState(null)
  const [expenError, setExpenError] = useState(null)
  const [cardToShow, setCardToShow] = useState(queryPage ? queryPage : 'grants')
  const [chosenPerson, setChosenPerson] = useState(null)
  const [otherUserGrants, setOtherUserGrants] = useState(null)
  const [otherUserPubs, setOtherUserPubs] = useState(null)
  const [otherUserExpen, setOtherUserExpen] = useState(null)

  const usersDropdownRef = useRef(null)

  const [searchQuery, setSearchQuery] = useState('')

  const fetchOtherUserInfo = async (url, setFunc, setErrorFunc, email, sortFunc) => {
    const response = await fetch(`${url}/${email}`, {
      method: 'GET',
      credentials: 'include'
    })

    const data = await response.json()
    if (response.ok) {
      setErrorFunc(null)
      setFunc(data.sort(sortFunc))
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
        researchInfoDispatch({type: 'SET_GRANTS', payload: data.sort((a,b) => parseInt(b.year) - parseInt(a.year))})
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
        researchInfoDispatch({type: 'SET_PUBS', payload: data.sort((a,b) => parseInt(b.publication_year) - parseInt(a.publication_year))})
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
        researchInfoDispatch({type: 'SET_EXPEN', payload: data.sort((a,b) => parseInt(b.year) - parseInt(a.year))})
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

  const choosePerson = (option) => {
    const chosenPersonTmp = usersToChoose.find(person => `${person.first_name} ${person.last_name}` === option)
    if (chosenPersonTmp.email === user.email) {
      setChosenPerson(null)
      setOtherUserGrants(null)
      setOtherUserPubs(null)
      setOtherUserExpen(null)
      return
    }
    setChosenPerson(chosenPersonTmp)
    fetchOtherUserInfo(GRANTS_URL, setOtherUserGrants, setGrantsError, chosenPersonTmp.email, (a,b) => parseInt(b.year) - parseInt(a.year))
    fetchOtherUserInfo(PUBS_URL, setOtherUserPubs, setPubsError, chosenPersonTmp.email, (a,b) => parseInt(b.publication_year) - parseInt(a.publication_year))
    fetchOtherUserInfo(EXPEN_URL, setOtherUserExpen, setExpenError, chosenPersonTmp.email, (a,b) => parseInt(b.year) - parseInt(a.year))
  }


  // Delete Functionality:
  const deleteEntry = async (e) => {
    // e passes in the object which includes grant_title which is used to delete that specific grant
    const alertResponse = window.confirm("Are you sure you want to delete this entry's data? This cannot be undone.");
    if (alertResponse) {

      const type = e.type

      const response = await fetch(DELETE_ENTRY_URL, {
        method: 'DELETE',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: e.email,
          type: e.type,
          title: e.title,
          year: e.year,
        })
      })
      const json = await response.json()
      if (!response.ok) {
        if (type === 'grant'){
          setGrantsError(json.error)
        } else if (type === 'pub'){
          setPubsError(json.error)
        } else if (type === 'expen'){
          setExpenError(json.error)
        }
        console.log(json.error)
      }
      if (response.ok) {
        if (type === 'grant') {
          // Update grants state to remove the grant that was deleted
          setGrantsError(null)
          if (e.email === user.email){
            const temp_grants = grants.filter((g) => g.title != e.title)
            if (temp_grants.length === 0){
              setPubsError('No grants found for this user.')
              researchInfoDispatch({type: 'SET_GRANTS', payload: null})
            } else {
              researchInfoDispatch({type: 'SET_GRANTS', payload: temp_grants})
            }
          } else if (chosenPerson && e.email === chosenPerson.email){
            const temp_grants = otherUserGrants.filter((g) => g.title != e.title)
            if (temp_grants.length === 0){
              setGrantsError('No grants found for this user.')
              setOtherUserGrants(null)
            } else {
              setOtherUserGrants(temp_grants)
            }
          }

          // Clear grants state in dashboard context
          dashboardDispatch({type: 'SET_GRANTS', payload: null})

        } else if (type === 'pub') {
          // Update pubs state to remove the publication that was deleted
          setPubsError(null)
          if (e.email === user.email){
            const temp_pubs = pubs.filter((p) => p.title != p.title)
            if (temp_pubs.length === 0){
              setPubsError('No publications found for this user.')
              researchInfoDispatch({type: 'SET_PUBS', payload: null})
            } else {
              researchInfoDispatch({type: 'SET_PUBS', payload: temp_pubs})
            }

          } else if (chosenPerson && e.email === chosenPerson.email){
            const temp_pubs = otherUserPubs.filter((p) => p.title != e.title)
            if (temp_pubs.length === 0){
              setPubsError('No publications found for this user.')
              setOtherUserPubs(null)
            } else {
              setOtherUserPubs(temp_pubs)
            }
          }

          // Clear pubs state in dashboard context
          dashboardDispatch({type: 'SET_PUBS', payload: null})

        } else if (type === 'expen') {
          // Update expen state to remove the expenditure that was deleted
          setExpenError(null)
          if (e.email === user.email){
            const temp_expens = expens.filter((p) => p.year != e.title)
            if (temp_expens.length === 0){
              setExpenError('No expenditures found for this user.')
              researchInfoDispatch({type: 'SET_EXPEN', payload: null})
            } else {
              researchInfoDispatch({type: 'SET_EXPEN', payload: temp_expens})
            }

          } else if (chosenPerson && e.email === chosenPerson.email){
            const temp_expens = otherUserExpen.filter((p) => p.year != e.title)
            if (temp_expens.length === 0){
              setExpenError('No expenditures found for this user.')
              setOtherUserExpen(null)
            } else {
              setOtherUserExpen(temp_expens)
            }
          }

          // Clear expen state in dashboard context
          dashboardDispatch({type: 'SET_EXPEN', payload: null})
        }
      }
    }
  }

  return (
    <div className="researchInfo">
      <h1 className='pageHeader'>Research Info</h1>
      <div className='researchInfoCard options'>
        <div className='researchInfobuttons'>
          { user && user.position === 'chair' &&
            <div className='researchInfoDropdownBox'>
              { usersToChoose &&
                <SearchDropdown
                  label='Choose Person'
                  placeholder='Enter Name'
                  options={ usersToChoose.map((person) => `${person.first_name} ${person.last_name}`) }
                  setChosenOption={ choosePerson }
                  dropdownClassName="researchInfoDropdown"
                  includeNone={ false }
                  initialSearchQuery={ chosenPerson ? `${chosenPerson.first_name} ${chosenPerson.last_name}` : `${user?.first_name} ${user?.last_name}`}
                  />
              }
            </div>
          }
          <div className="researchInfoDropdownBox">
            <h3>Filter Items</h3>
            <input type="text" className="researchInfoDropdown" onChange={ (e) => setSearchQuery(e.target.value) } placeholder="Enter Item Name or Year" />
          </div>
          <div className="researchInfoDropdownBox pageSelectorBox">
            <h3>Choose Page</h3>
            <div className="pageSelectors">
              <button 
                className={ cardToShow === 'grants' ? 'active' : ''}
                onClick={ () => setCardToShow('grants')}
              >Grants</button>
              <button 
                className={ cardToShow === 'publications' ? 'active' : ''}
                onClick={ () => setCardToShow('publications')}
              >Publications</button>
              <button 
                className={ cardToShow === 'expenditures' ? 'active' : ''}
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
                      <th>Delete?</th>
                    </tr>
                  </thead>
                  <tbody>
                  { chosenPerson ?
                    otherUserGrants?.filter((grant) => {
                      return grant.title.toLowerCase().includes(searchQuery.toLowerCase()) || grant.year.includes(searchQuery)
                    })?.map((grant) => {
                      return (
                        <tr key={ grant.title }>
                          <td>{ grant.title }</td>
                          <td>{ grant.amount }</td>
                          <td>{ grant.year }</td>
                          <td><button className="delete" onClick={() => deleteEntry({type: 'grant', title: grant.title, email: chosenPerson.email, year: grant.year})}>
                            <img className="deleteIcon" src={ deleteIcon} alt="Delete Icon"></img>
                          </button></td>
                        </tr>
                      )
                    }) : 
                    grants?.filter((grant) => {
                      return grant.title.toLowerCase().includes(searchQuery.toLowerCase()) || grant.year.includes(searchQuery)
                    })?.map((grant) => {
                      return (
                        <tr key={ grant.title }>
                          <td>{ grant.title }</td>
                          <td>{ grant.amount }</td>
                          <td>{ grant.year }</td>
                          <td><button className="delete" onClick={() => deleteEntry({type: 'grant', title: grant.title, email: user.email, year: grant.year})}>
                            <img className="deleteIcon" src={ deleteIcon} alt="Delete Icon"></img>
                          </button></td>
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
                      <th>Delete?</th>
                    </tr>
                  </thead>
                  <tbody>
                  { chosenPerson ?
                    otherUserPubs?.filter((pub) => {
                      return pub.title.toLowerCase().includes(searchQuery.toLowerCase()) || pub.publication_year.includes(searchQuery)
                    })?.map((pub) => {
                      return (
                        <tr key={ pub.title }>
                          <td>{ pub.title }</td>
                          <td>{ pub.authors }</td>
                          <td>{ pub.publication_year }</td>
                          <td>{ pub.isbn }</td>
                          <td><button className="delete" onClick={() => deleteEntry({type: 'pub', title: pub.title, email: chosenPerson.email, year: pub.publication_year})}>
                            <img className="deleteIcon" src={ deleteIcon} alt="Delete Icon"></img>
                          </button></td>
                        </tr>
                      )}) :
                    pubs?.filter((pub) => {
                      return pub.title.toLowerCase().includes(searchQuery.toLowerCase()) || pub.publication_year.includes(searchQuery)
                    })?.map((pub) => {
                      return (
                        <tr key={ pub.title }>
                          <td>{ pub.title }</td>
                          <td>{ pub.authors }</td>
                          <td>{ pub.publication_year }</td>
                          <td>{ pub.isbn }</td>
                          <td><button className="delete" onClick={() => deleteEntry({type: 'pub', title: pub.title, email: user.email, year: pub.publication_year})}>
                            <img className="deleteIcon" src={ deleteIcon} alt="Delete Icon"></img>
                          </button></td>
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
                      <th>Delete?</th>
                    </tr>
                  </thead>
                  <tbody>
                  { chosenPerson ? 
                    otherUserExpen?.filter((expen) => {
                      return expen.year.includes(searchQuery)
                    })?.map((ex, i) => {
                      return (
                        <tr key={ i }>
                          <td>{ ex.year }</td>
                          <td>{ ex.reporting_department }</td>
                          <td>{ ex.pi_name }</td>
                          <td>{ ex.amount }</td>
                          <td><button className="delete" onClick={() => deleteEntry({type: 'expen', title: ex.year, email: chosenPerson.email, year: ex.year})}>
                            <img className="deleteIcon" src={ deleteIcon} alt="Delete Icon"></img>
                          </button></td>
                        </tr>
                      )}) :
                    expens?.filter((expen) => {
                      return expen.year.includes(searchQuery)
                    })?.map((ex, i) => {
                      return (
                        <tr key={ i }>
                          <td>{ ex.year }</td>
                          <td>{ ex.reporting_department }</td>
                          <td>{ ex.pi_name }</td>
                          <td>{ ex.amount }</td>
                          <td><button className="delete" onClick={() => deleteEntry({type: 'expen', title: ex.year, email: user.email, year: ex.year})}>
                            <img className="deleteIcon" src={ deleteIcon} alt="Delete Icon"></img>
                          </button></td>
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
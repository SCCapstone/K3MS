import React, { useState, useEffect } from 'react';
import { UPDATE_PASSWORD_URL, DELETE_EVALS_URL, DELETE_ALL_GRANTS_URL, DELETE_ALL_PUBS_URL, DELETE_ALL_EXPENS_URL } from '../../config';
import { useAuthContext } from '../../hooks/useAuthContext'
import { useCourseAnalyticsContext } from '../../hooks/useCourseAnalyticsContext';
import { useStudentEvalsContext } from '../../hooks/useStudentEvalsContext';
import { useDashboardContext } from '../../hooks/useDashboardContext';
import { useTeamAssessmentsContext } from '../../hooks/useTeamAssessmentsContext';
import { useResearchInfoContext } from '../../hooks/useResearchInfoContext';
import { useNavigate } from "react-router-dom";
import './accountsettings.css';

const confirmation_text = "I want to delete all student evaluations in the database"
const grantsConfirmationText = "I want to delete all my grants"
const pubsConfirmationText = "I want to delete all my publications"
const expensConfirmationText = "I want to delete all my expenditures"
const AccountSettings = () => {
    const navigate = useNavigate()

    const { user, userDispatch } = useAuthContext()
    const { courseAnalyticsDispatch } = useCourseAnalyticsContext()
    const { studentEvalsDispatch } = useStudentEvalsContext()
    const { dashboardDispatch } = useDashboardContext()
    const { teamAssessmentsDispatch } = useTeamAssessmentsContext()
    const { researchInfoDispatch } = useResearchInfoContext()

    useEffect(() => {
        if (!user) {
        navigate('/login', { state: { mssg: 'Must Be Logged In', status: 'error'}})
        }
    }, [user, navigate]);

    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const [new_password, setNewPassword] = useState('')
    const [confirm_new_password, setConfirmNewPassword] = useState('')

    const [deleteEvalsConfirm, setDeleteEvalsConfirm] = useState('')
    const [evalsError, setEvalsError] = useState(null)
    const [evalsEmptyFields, setEvalsEmptyFields] = useState([])

    const [deleteGrantsConfirm, setDeleteGrantsConfirm] = useState('')
    const [grantsError, setGrantsError] = useState(null)

    const [deletePubsConfirm, setDeletePubsConfirm] = useState('')
    const [pubsError, setPubsError] = useState(null)

    const [deleteExpensConfirm, setDeleteExpensConfirm] = useState('')
    const [expensError, setExpensError] = useState(null)

    const updatePassword = async (e) => {
        e.preventDefault()

        // Check If new_password and confirm_new_password Match
        if (new_password !== confirm_new_password) {
            setError("Passwords Do Not Match");
            return;
        }
    
        const response = await fetch(UPDATE_PASSWORD_URL, {
          method: 'POST',
          credentials: 'include',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            new_password: new_password,
            confirm_new_password: confirm_new_password
          })
        })
    
        const json = await response.json()
        if (!response.ok) {
          setError(json.error)
          if (json.empty_fields)
            setEmptyFields(json.empty_fields)
        }
    
        if (response.ok) {
          setError(null)
          setEmptyFields([])
          setNewPassword('')
          setConfirmNewPassword('')
    
            // Navigate to dashboard
            navigate('/dashboard', { state: { mssg: 'Password Updated Successfully', status: 'ok' }})
        }
    };

    const deleteAllEvals = async (e) => {
      e.preventDefault()
      if (deleteEvalsConfirm !== confirmation_text) {
        setEvalsError("Confirmation Text Does Not Match")
        return
      }
      const alertResponse = window.confirm("Are you sure you want to delete all student evaluation data? This cannot be undone.");
      if (alertResponse) {
        const response = await fetch(DELETE_EVALS_URL, {
          method: 'DELETE',
          credentials: 'include',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            confirmText: deleteEvalsConfirm
          })
        })
        const json = await response.json()
        if (!response.ok) {
          setEvalsError(json.error)
        }
        if (response.ok) {
          setEvalsError(null)
          setDeleteEvalsConfirm('')

          // Clear evaluation data
          studentEvalsDispatch({ type: 'CLEAR_DATA' })
          courseAnalyticsDispatch({ type: 'CLEAR_DATA' })
          dashboardDispatch({ type: 'CLEAR_DATA' })
          teamAssessmentsDispatch({ type: 'CLEAR_DATA' })

          navigate('/dashboard', { state: { mssg: 'All Evaluations Deleted', status: 'ok' }})
        }
      }
    }


    const deleteAllGrants = async (e) => {
      e.preventDefault()
      if (deleteGrantsConfirm !== grantsConfirmationText) {
        setGrantsError("Confirmation Text Does Not Match")
        return
      }
      const alertResponse = window.confirm("Are you sure you want to delete all grant data? This cannot be undone.");
      if (alertResponse) {
        const response = await fetch(DELETE_ALL_GRANTS_URL, {
          method: 'DELETE',
          credentials: 'include',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            confirmText: deleteGrantsConfirm
          })
        })
        const json = await response.json()
        if (!response.ok) {
          setGrantsError(json.error)
        }
        if (response.ok) {
          setGrantsError(null)
          setDeleteGrantsConfirm('')

          // Clear grant data
          researchInfoDispatch({ type: 'SET_GRANTS', payload: null })
          dashboardDispatch({ type: 'SET_GRANTS', payload: null })

          navigate('/dashboard', { state: { mssg: 'All Grants Deleted', status: 'ok' }})
        }
      }
    }

    const deleteAllPubs = async (e) => {
      e.preventDefault()
      if (deletePubsConfirm !== pubsConfirmationText) {
        setPubsError("Confirmation Text Does Not Match")
        return
      }
      const alertResponse = window.confirm("Are you sure you want to delete all publication data? This cannot be undone.");
      if (alertResponse) {
        const response = await fetch(DELETE_ALL_PUBS_URL, {
          method: 'DELETE',
          credentials: 'include',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            confirmText: deletePubsConfirm
          })
        })
        const json = await response.json()
        if (!response.ok) {
          setPubsError(json.error)
        }
        if (response.ok) {
          setPubsError(null)
          setDeletePubsConfirm('')

          // Clear grant data
          researchInfoDispatch({ type: 'SET_PUBS', payload: null })
          dashboardDispatch({ type: 'SET_PUBS', payload: null })

          navigate('/dashboard', { state: { mssg: 'All Publications Deleted', status: 'ok' }})
        }
      }
    }

    const deleteAllExpens = async (e) => {
      e.preventDefault()
      if (deleteExpensConfirm !== expensConfirmationText) {
        setExpensError("Confirmation Text Does Not Match")
        return
      }
      const alertResponse = window.confirm("Are you sure you want to delete all expenditure data? This cannot be undone.");
      if (alertResponse) {
        const response = await fetch(DELETE_ALL_EXPENS_URL, {
          method: 'DELETE',
          credentials: 'include',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            confirmText: deleteExpensConfirm
          })
        })
        const json = await response.json()
        if (!response.ok) {
          setExpensError(json.error)
        }
        if (response.ok) {
          setExpensError(null)
          setDeleteExpensConfirm('')

          // Clear grant data
          researchInfoDispatch({ type: 'SET_EXPEN', payload: null })
          dashboardDispatch({ type: 'SET_EXPEN', payload: null })

          navigate('/dashboard', { state: { mssg: 'All Expenditures Deleted', status: 'ok' }})
        }
      }
    }

    return (
        <>
          <h1 className="accountSettingsPageHeader">Account Settings</h1>
          <section className="updatePasswordCard">
            <h1>Update Password</h1>
            <form className="updatePassword" onSubmit={ updatePassword }>
                <input 
                  type="password" 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  value={ new_password } 
                  placeholder="New Password"
                  className={ emptyFields.includes('new_password') ? 'errorField' : '' }
                />
            
                <input 
                  type="password" 
                  onChange={(e) => setConfirmNewPassword(e.target.value)} 
                  value={ confirm_new_password } 
                  placeholder="Confirm New Password"
                />
                <button>Update Password</button>
                {error && <div className="errorField">{ error }</div>}
            </form>
          </section>

          <section className="updatePasswordCard">
            <h1>Delete All Grants</h1>
            <form className="updatePassword" onSubmit={ deleteAllGrants  }>
                <label><b><u>Type:</u></b> { grantsConfirmationText }</label>
                <input 
                  type="text" 
                  onChange={(e) => setDeleteGrantsConfirm(e.target.value)} 
                  value={ deleteGrantsConfirm } 
                  placeholder="Type confirmation text"
                />
                <button>Delete All My Grants</button>
                {grantsError && <div className="errorField">{ grantsError }</div>}
            </form>
          </section>

          <section className="updatePasswordCard">
            <h1>Delete All Publications</h1>
            <form className="updatePassword" onSubmit={ deleteAllPubs }>
                <label><b><u>Type:</u></b> { pubsConfirmationText }</label>
                <input
                  type="text"
                  onChange={(e) => setDeletePubsConfirm(e.target.value)}
                  value={ deletePubsConfirm }
                  placeholder="Type confirmation text"
                />
                <button>Delete All My Publications</button>
                {pubsError && <div className="errorField">{ pubsError }</div>}
            </form>
          </section>

          <section className="updatePasswordCard">
            <h1>Delete All Expenditures</h1>
            <form className="updatePassword" onSubmit={ deleteAllExpens }>
                <label><b><u>Type:</u></b> { expensConfirmationText }</label>
                <input
                  type="text"
                  onChange={(e) => setDeleteExpensConfirm(e.target.value)}
                  value={ deleteExpensConfirm }
                  placeholder="Type confirmation text"
                />
                <button>Delete All My Expenditures</button>
                {expensError && <div className="errorField">{ expensError }</div>}
            </form>
          </section>

          { user && user.position == 'chair' &&
            <section className="updatePasswordCard">
              <h1>Delete Evaluations</h1>
              <form className="updatePassword" onSubmit={ deleteAllEvals }>
                  <label><b><u>Type:</u></b> { confirmation_text }</label>
                  <input 
                    type="text" 
                    onChange={(e) => setDeleteEvalsConfirm(e.target.value)} 
                    value={ deleteEvalsConfirm } 
                    placeholder="Type confirmation text"
                    className={ evalsEmptyFields.includes('confirmText') ? 'errorField' : '' }
                  />
                  <button>Delete All Evaluations</button>
                  {evalsError && <div className="errorField">{ evalsError }</div>}
              </form>
            </section>
          }
        </>
      );

}

export default AccountSettings;

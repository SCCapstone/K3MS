import React, { useState, useEffect } from 'react';
import { UPDATE_PASSWORD_URL, DELETE_EVALS_URL } from '../../config';
import { useAuthContext } from '../../hooks/useAuthContext'
import { useCourseAnalyticsContext } from '../../hooks/useCourseAnalyticsContext';
import { useStudentEvalsContext } from '../../hooks/useStudentEvalsContext';
import { useDashboardContext } from '../../hooks/useDashboardContext';
import { useTeamAssessmentsContext } from '../../hooks/useTeamAssessmentsContext';
import { useNavigate } from "react-router-dom";
import Alert from '../../components/Alert/Alert'
import './accountsettings.css';

const confirmation_text = "I want to delete all student evaluations in the database"
const AccountSettings = () => {
    const navigate = useNavigate()

    const { user, userDispatch } = useAuthContext()
    const { courseAnalyticsDispatch } = useCourseAnalyticsContext()
    const { studentEvalsDispatch } = useStudentEvalsContext()
    const { dashboardDispatch } = useDashboardContext()
    const { teamAssessmentsDispatch } = useTeamAssessmentsContext()

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
          if (json.empty_fields)
            setEvalsEmptyFields(json.empty_fields)
        }
        if (response.ok) {
          setEvalsError(null)
          setEvalsEmptyFields([])
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

    return (
        <>
          <Alert />
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
                  className={ emptyFields.includes('confirm_new_password') ? 'errorField' : '' }
                />
                <button>Update Password</button>
                {error && <div className="errorField">{ error }</div>}
            </form>
          </section>
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
        </>
      );

}

export default AccountSettings;

import React, { useState, useEffect } from 'react';
import { UPDATE_PASSWORD_URL, UPDATE_PROFILE_PICTURE_URL, DELETE_EVALS_URL, DELETE_ALL_GRANTS_URL, DELETE_ALL_PUBS_URL, DELETE_ALL_EXPENS_URL, GET_PROFILE_PICTURE_URL, DELETE_PROFILE_PICTURE_URL } from '../../config';
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

    const [pictureError, setPictureError] = useState(null)
    const [pictureFile, setPictureFile] = useState()
    const [pictureProcessing, setPictureProcessing] = useState(false)

    const [deletePictureError, setDeletePictureError] = useState(null)

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
            navigate('/account-settings', { state: { mssg: 'Password Updated Successfully', status: 'ok' }})
        }
    };

    // Update profile picture file
    function handleChangePicture(event) {
      setPictureFile(event.target.files[0])
    }

    // Update profile picture through backend
    async function handleSubmitPicture(event) {
      event.preventDefault();
      
      if (pictureProcessing) {
        setPictureError('Picture is currently being processed')
        return
      }
  
      if (!pictureFile) {
        setPictureError('No file selected')
        return
      }
  
      const formData = new FormData();
      formData.append('file', pictureFile);
      formData.append('fileName', pictureFile.name);
  
      try {
        setPictureError(null)
        setPictureProcessing(true)
        const response = await fetch(UPDATE_PROFILE_PICTURE_URL, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        const json = await response.json();
  
        if(!response.ok) {
          setPictureProcessing(false)
          if (json.error) {
            setPictureError(`Error uploading file - ${json.error}`)
          }
        }
  
        if (response.ok) {
          setPictureError(null)
          setPictureProcessing(false)

          const fetchProfilePicture = async () => {
            const response = await fetch(GET_PROFILE_PICTURE_URL, {
              method: 'GET',
              credentials: 'include'
            })
            const blob = await response.blob()
            if (response.ok) {
              const url = URL.createObjectURL(blob)
              userDispatch({type: 'SET_PROFILE_PICTURE_URL', payload: url})
            }
            else {
              console.log('Error fetching profile picture')
            }
          }
          fetchProfilePicture()

          navigate('/account-settings', { state: { mssg: 'Profile picture updated successfully', status: 'ok' }})
        }
      } catch (error) {
        setPictureProcessing(false)
        setPictureError('Error uploading file')
        console.error('Fetch error: ', error.message);
      }
    }

    const handleDeletePicture = async (e) => {
      const alertResponse = window.confirm("Are you sure you want to delete all student evaluation data? This cannot be undone.");
      if (!alertResponse) {
        return
      }
      e.preventDefault()
      const response = await fetch(DELETE_PROFILE_PICTURE_URL, {
        method: 'DELETE',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'}
      })
      const json = await response.json()
      if (!response.ok) {
        setDeletePictureError(json.error)
      }
      if (response.ok) {
        setDeletePictureError(null)
        userDispatch({type: 'SET_PROFILE_PICTURE_URL', payload: null})
        navigate('/account-settings', { state: { mssg: 'Profile picture deleted successfully', status: 'ok' }})
      }
    }

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

          navigate('/account-settings', { state: { mssg: 'All Evaluations Deleted', status: 'ok' }})
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

          navigate('/account-settings', { state: { mssg: 'All Grants Deleted', status: 'ok' }})
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

          navigate('/account-settings', { state: { mssg: 'All Publications Deleted', status: 'ok' }})
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
          researchInfoDispatch({ type: 'SET_EXPENS', payload: null })
          dashboardDispatch({ type: 'SET_EXPENS', payload: null })

          navigate('/account-settings', { state: { mssg: 'All Expenditures Deleted', status: 'ok' }})
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
            <h1>Update Profile Picture</h1>
            <label>Please ensure your image is square for the best results</label>
            <form onSubmit={handleSubmitPicture} className="evalupload-form">
                <input type="file" onChange={handleChangePicture} className="evalupload-form-input" />
                <button type="submit" className="evalupload-form-button">Upload</button>
                {pictureError && <div className="errorField">{ pictureError }</div>}
                {pictureProcessing && <p>Processing...</p>}
            </form>
          </section>

          <section className="updatePasswordCard">
            <h1>Delete Profile Picture</h1>
            <form onSubmit={handleDeletePicture} className="evalupload-form">
                <button type="submit" className="evalupload-form-button">Delete Profile Picture</button>
                {deletePictureError && <div className="errorField">{ deletePictureError }</div>}
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

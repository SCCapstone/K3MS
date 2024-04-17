import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../../hooks/useAuthContext';
import { MANUAL_USER_CREATION_URL, USER_CREATION_URL, USER_UPDATE_URL, USER_DELETION_URL, CHECK_AUTH_URL } from '../../config'
import { useCourseAnalyticsContext } from '../../hooks/useCourseAnalyticsContext';
import { useTeamAssessmentsContext } from '../../hooks/useTeamAssessmentsContext';
import ConfirmAlert from '../../components/ConfirmAlert/ConfirmAlert';

import './useradmin.css'

const UserAdmin = () => {
  const navigate = useNavigate()

  const { user, userDispatch } = useAuthContext()
  const { courseAnalyticsDispatch } = useCourseAnalyticsContext()
  const { teamAssessmentsDispatch } = useTeamAssessmentsContext()

  // Create
  const [firstNameCreate, setfirstNameCreate] = useState('')
  const [lastNameCreate, setlastNameCreate] = useState('')
  const [emailCreate, setEmailCreate] = useState('')
  const [positionCreate, setPositionCreate] = useState('')
  const [error, setError] = useState('')
  const [emptyFields, setEmptyFields] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Manual Create
  const [firstNameManual, setfirstNameManual] = useState('')
  const [lastNameManual, setlastNameManual] = useState('')
  const [emailManual, setEmailManual] = useState('')
  const [positionManual, setPositionManual] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [manualError, setManualError] = useState('')
  const [manualEmptyFields, setManualEmptyFields] = useState([])

  // Update
  const [emailUpdate, setEmailUpdate] = useState('')
  const [firstNameUpdate, setFirstNameUpdate] = useState('')
  const [lastNameUpdate, setLastNameUpdate] = useState('')
  const [positionUpdate, setPositionUpdate] = useState('')
  const [updateError, setUpdateError] = useState('')
  const [updateEmptyFields, setUpdateEmptyFields] = useState([])

  // Delete
  const [emailDelete, setEmailDelete] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleteEmptyFields, setDeleteEmptyFields] = useState([])

  // Alert
  const [confirmationMssg, setConfirmationMssg] = useState('')
  const [confirmationFunc, setConfirmationFunc] = useState(() => {})
  const handleDeleteSomething = (e, confirmationFunc, confirmationMssg) => {
    e.preventDefault()
    setConfirmationMssg(confirmationMssg)
    setConfirmationFunc(() => confirmationFunc)
  }
  // Don't allow non-logged in users or non-chairs to access this page
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { mssg: 'Must be Logged In', status: 'error'}})
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.position !== 'chair') {
      let redirect = user ? '/dashboard' : '/login'
      navigate(redirect, { 
        state: { 
          mssg: 'You do not have access to this page - this incident will be reported', 
          status: 'error'
        }
      })
    }
  }, [user, navigate]);

  const createUser = async (e) => {
    e.preventDefault()
    setError(null)
    setEmptyFields([])
    setIsProcessing(true)

    const response = await fetch(USER_CREATION_URL, {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        first_name: firstNameCreate,
        last_name: lastNameCreate,
        email: emailCreate,
        position: positionCreate,
      })
    })
    
    const json = await response.json()
    if (!response.ok) {
      setIsProcessing(false)
      setError(json.error)
      if (json.empty_fields)
        setEmptyFields(json.empty_fields)
    }

    if (response.ok) {
      setIsProcessing(false)
      setError(null)
      setEmptyFields([])
      setfirstNameCreate('')
      setlastNameCreate('')
      setEmailCreate('')
      setPositionCreate('')

      navigate('/useradmin', { state: { mssg: 'User Creation Process Started - Awaiting their response', status: 'ok' }})
    }
  }

  const createUserManual = async (e) => {
    e.preventDefault()
    setManualError(null)
    setManualEmptyFields([])

    if (password !== confirmPassword) {
      setManualError('Passwords do not match')
      return
    }

    const response = await fetch(MANUAL_USER_CREATION_URL, {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        first_name: firstNameManual,
        last_name: lastNameManual,
        email: emailManual,
        position: positionManual,
        password: password
      })
    })

    const json = await response.json()
    if (!response.ok) {
      setManualError(json.error)
      if (json.empty_fields)
        setManualEmptyFields(json.empty_fields)
    }
    if (response.ok) {
      setManualError(null)
      setManualEmptyFields([])
      setfirstNameManual('')
      setlastNameManual('')
      setEmailManual('')
      setPositionManual('')
      setPassword('')
      setConfirmPassword('')

      // Clear users to choose and data that may contain info from them
      courseAnalyticsDispatch({ type: 'CLEAR_DATA' })

      navigate('/useradmin', { state: { mssg: 'User Created', status: 'ok' }})
    }
  }

  const deleteUser = async () => {

    const response = await fetch(USER_DELETION_URL, {
      method: 'DELETE',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: emailDelete
      })
    })

    const json = await response.json()
    if (!response.ok) {
      console.log(json)
      setDeleteError(json.error)
      if (json.empty_fields)
        setDeleteEmptyFields(json.empty_fields)
    }
    if (response.ok) {
      setDeleteError(null)
      setDeleteEmptyFields([])
      setEmailDelete('')
      
      // Clear users to choose and data that may contain info from them
      courseAnalyticsDispatch({ type: 'CLEAR_DATA' })

      navigate('/useradmin', { state: { mssg: 'User Deleted', status: 'ok' }})
    }
  }

  const updateUser = async (e) => {
    e.preventDefault()

    const response = await fetch(USER_UPDATE_URL, {
      method: 'PATCH',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        first_name: firstNameUpdate,
        last_name: lastNameUpdate,
        email: emailUpdate,
        position: positionUpdate
      })
    })

    const json = await response.json()
    if (!response.ok) {
      setUpdateError(json.error)
      if (json.empty_fields)
        setUpdateEmptyFields(json.empty_fields)
    }
    if (response.ok) {
      setUpdateError(null)
      setUpdateEmptyFields([])
      setFirstNameUpdate('')
      setLastNameUpdate('')
      setEmailUpdate('')
      setPositionUpdate('')

      // Clear users to choose and data that may contain info from them
      courseAnalyticsDispatch({ type: 'CLEAR_DATA' })
      teamAssessmentsDispatch({ type: 'CLEAR_DATA' })

      // If the user updates their own account, update the user object
      if (user.email === emailUpdate) {
        // Send request to backend to get updated user
        const check_auth = async () => {
          const response = await fetch(CHECK_AUTH_URL, {
            credentials: 'include'
          })

          if (response.ok) {
            const json = await response.json()
            userDispatch({ type: 'LOGIN', payload: json[0] })
          }
        }
        check_auth()
      }

      navigate('/useradmin', { state: { mssg: json.mssg, status: 'ok' }})
    }
  }

  return (
    <>
      <ConfirmAlert 
        mssg={ confirmationMssg }
        setMssg={ setConfirmationMssg }
        onConfirm={ confirmationFunc } 
        onCancel={ () => {} }
      />
      <h1 className="userCreationPageHeader">User Administration</h1>
      <section className="userCreationCard">
        <h1>Create a User</h1>
        <p>User will receive an email to set their password</p>
        <form className="userCreationForm" onSubmit={ (e) => {createUser(e)} }>
            <input 
              type="text" 
              onChange={(e) => setfirstNameCreate(e.target.value)} 
              value={ firstNameCreate } 
              placeholder="First Name"
              className={ emptyFields.includes('first_name') ? 'errorField' : '' }
            />
            <input 
              type="text" 
              onChange={(e) => setlastNameCreate(e.target.value)} 
              value={ lastNameCreate } 
              placeholder="Last Name"
              className={ emptyFields.includes('last_name') ? 'errorField' : '' }
            />
            <input 
              type="email" 
              onChange={(e) => setEmailCreate(e.target.value)} 
              value={ emailCreate } 
              placeholder="Email"
              className={ emptyFields.includes('email') ? 'errorField' : '' }
            />
            <select
              type="text" 
              onChange={(e) => setPositionCreate(e.target.value)} 
              className={ emptyFields.includes('position') ? 'errorField' : '' }>
              <option value="">Position</option>
              <option value="chair">Chair</option>
              <option value="professor">Professor</option>
              <option value="instructor">Instructor</option>
            </select>
            <button>Create</button>
            {error && <div className="errorField">{ error }</div>}
            {isProcessing && <div>Processing...</div>}
        </form>
      </section>
      <section className="userCreationCard">
        <h1>Create a User - Manual</h1>
        <p>Create user and manually set a password</p>
        <form className="userCreationForm" onSubmit={ (e) => {createUserManual(e)} }>
            <input 
              type="text" 
              onChange={(e) => setfirstNameManual(e.target.value)} 
              value={ firstNameManual } 
              placeholder="First Name"
              className={ manualEmptyFields.includes('first_name') ? 'errorField' : '' }
            />
            <input 
              type="text" 
              onChange={(e) => setlastNameManual(e.target.value)} 
              value={ lastNameManual } 
              placeholder="Last Name"
              className={ manualEmptyFields.includes('last_name') ? 'errorField' : '' }
            />
            <input 
              type="email" 
              onChange={(e) => setEmailManual(e.target.value)} 
              value={ emailManual } 
              placeholder="Email"
              className={ manualEmptyFields.includes('email') ? 'errorField' : '' }
            />
            <select
              type="text" 
              onChange={(e) => setPositionManual(e.target.value)} 
              className={ manualEmptyFields.includes('position') ? 'errorField' : '' }>
              <option value="">Position</option>
              <option value="chair">Chair</option>
              <option value="professor">Professor</option>
              <option value="instructor">Instructor</option>
            </select>
            <input 
              type="password" 
              onChange={(e) => setPassword(e.target.value)} 
              value={ password } 
              placeholder="Password"
              className={ manualEmptyFields.includes('password') ? 'errorField' : '' }
            />
            <input 
              type="password" 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              value={ confirmPassword } 
              placeholder="Confirm Password"
              className={ manualEmptyFields.includes('password') ? 'errorField' : '' }
            />
            <button>Create</button>
            {manualError && <div className="errorField">{ manualError }</div>}
        </form>
      </section>
      <section className="userCreationCard">
        <h1>Update a User</h1>
        <p>Fill in the Email and any fields to update</p>
        <form className="userCreationForm" onSubmit={ (e) => {updateUser(e)} }>
            <input 
              type="email" 
              onChange={(e) => setEmailUpdate(e.target.value)} 
              value={ emailUpdate } 
              placeholder="Email"
              className={ updateEmptyFields.includes('email') ? 'errorField' : '' }
            />
            <input 
              type="text" 
              onChange={(e) => setFirstNameUpdate(e.target.value)} 
              value={ firstNameUpdate } 
              placeholder="First Name"
            />
            <input 
              type="text" 
              onChange={(e) => setLastNameUpdate(e.target.value)} 
              value={ lastNameUpdate } 
              placeholder="Last Name"
            />
            <select
              type="text" 
              onChange={(e) => setPositionUpdate(e.target.value)}>
              <option value="">Position</option>
              <option value="chair">Chair</option>
              <option value="professor">Professor</option>
              <option value="instructor">Instructor</option>
            </select>
            <button>Update</button>
            {updateError && <div className="errorField">{ updateError }</div>}
        </form>
      </section>
      <section className="userCreationCard">
        <h1>Delete a User</h1>
        <form 
          className="userCreationForm" 
          onSubmit={ (e) => handleDeleteSomething(e, deleteUser, "Are you sure you want to delete this user and all associated data?") }
        >
            <input 
              type="email" 
              onChange={(e) => setEmailDelete(e.target.value)} 
              value={ emailDelete } 
              placeholder="Email"
              className={ deleteEmptyFields.includes('email') ? 'errorField' : '' }
            />
            <button>Delete</button>
            {deleteError && <div className="errorField">{ deleteError }</div>}
        </form>
      </section>
    </>
  )
}

export default UserAdmin
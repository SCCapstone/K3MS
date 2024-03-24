import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../../hooks/useAuthContext';
import { USER_CREATION_URL, USER_UPDATE_URL, USER_DELETION_URL } from '../../config'
import { useCourseAnalyticsContext } from '../../hooks/useCourseAnalyticsContext';

import './useradmin.css'

const UserAdmin = () => {
  const navigate = useNavigate()

  const { user } = useAuthContext()
  const { courseAnalyticsDispatch } = useCourseAnalyticsContext()

  // Create
  const [firstNameCreate, setfirstNameCreate] = useState('')
  const [lastNameCreate, setlastNameCreate] = useState('')
  const [emailCreate, setEmailCreate] = useState('')
  const [positionCreate, setPositionCreate] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [emptyFields, setEmptyFields] = useState([])

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

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const response = await fetch(USER_CREATION_URL, {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        first_name: firstNameCreate,
        last_name: lastNameCreate,
        email: emailCreate,
        position: positionCreate,
        password: password
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
      setfirstNameCreate('')
      setlastNameCreate('')
      setEmailCreate('')
      setPositionCreate('')
      setPassword('')
      setConfirmPassword('')

      // Clear users to choose and data that may contain info from them
      courseAnalyticsDispatch({ type: 'CLEAR_DATA' })
      navigate('/dashboard', { state: { mssg: 'User Created', status: 'ok' }})
    }
  }

  const deleteUser = async (e) => {
    e.preventDefault()

    const alertResponse = window.confirm("Are you sure you delete this user and all associated data?");
    if (alertResponse) {
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

        navigate('/dashboard', { state: { mssg: 'User Deleted', status: 'ok' }})
      }
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

      navigate('/dashboard', { state: { mssg: json.mssg, status: 'ok' }})
    }
  }

  return (
    <>
      <h1 className="userCreationPageHeader">User Administration</h1>
      <section className="userCreationCard">
        <h1>Create a User</h1>
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
            <input 
              type="password" 
              onChange={(e) => setPassword(e.target.value)} 
              value={ password } 
              placeholder="Password"
              className={ emptyFields.includes('password') ? 'errorField' : '' }
            />
            <input 
              type="password" 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              value={ confirmPassword } 
              placeholder="Confirm Password"
              className={ emptyFields.includes('password') ? 'errorField' : '' }
            />
            <button>Create</button>
            {error && <div className="errorField">{ error }</div>}
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
        <form className="userCreationForm" onSubmit={ (e) => {deleteUser(e)} }>
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
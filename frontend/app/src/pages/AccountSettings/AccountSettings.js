import React, { useState, useEffect } from 'react';
import { ACCOUNT_SETTINGS_URL } from '../../config';
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from "react-router-dom";
import Alert from '../../components/Alert/Alert'
import './accountsettings.css';

const AccountSettings = () => {
    const navigate = useNavigate()

    const { user, userDispatch } = useAuthContext()

    useEffect(() => {
        if (!user) {
        navigate('/login', { state: { mssg: 'Must Be Logged In', status: 'error'}})
        }
    }, [user, navigate]);

    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const [new_password, setNewPassword] = useState('')
    const [confirm_new_password, setConfirmNewPassword] = useState('')

    const updatePassword = async (e) => {
        e.preventDefault()

        // Check If new_password and confirm_new_password Match
        if (new_password !== confirm_new_password) {
            setError("Passwords Do Not Match");
            return;
        }
    
        const response = await fetch(ACCOUNT_SETTINGS_URL, {
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
        </>
      );

}

export default AccountSettings;

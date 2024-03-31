import { useEffect, useState, createContext, useReducer } from 'react'
import { CHECK_AUTH_URL } from '../config'

// Context to save and modify user logged in state

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      // Save user in local storage
      // localStorage.setItem('user', JSON.stringify(action.payload))

      // set logged in user to the payload user
      return { ...state, user: action.payload } 

    case 'SET_PROFILE_PICTURE_URL':
      return { ...state, profilePictureUrl: action.payload }

    case 'LOGOUT':
      // Remove user from local storage
      // localStorage.removeItem('user', JSON.stringify(action.payload))

      // set logged in user to null
      return { user: null, profilePictureUrl: null}
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, userDispatch] = useReducer(authReducer, { 
    user: null,  // initial state is null - not logged in 
    profilePictureUrl: null
  })
  const [checkedStorage, setCheckedStorage] = useState(false)

  // on refresh, check if we have a valid auth cookie
  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem('user')) 

    // Send request to backend to test if we have a valid auth cookie
    const check_auth = async () => {
      const response = await fetch(CHECK_AUTH_URL, {
        credentials: 'include'
      })

      if (response.ok) {
        const json = await response.json()
        userDispatch({ type: 'LOGIN', payload: json[0] })
      }
      
      setCheckedStorage(true)
    }
    check_auth()
  }, [])

  // provide authContext context to all parts of app
  return (
    <AuthContext.Provider value={{ ...state, userDispatch, checkedStorage }}>
      { children }
    </AuthContext.Provider>
  )

}
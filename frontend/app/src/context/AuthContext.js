import { useEffect, useState, createContext, useReducer } from 'react'

// Context to save and modify user logged in state

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      // Save user in local storage
      localStorage.setItem('user', JSON.stringify(action.payload))

      // set logged in user to the payload user
      return { user: action.payload } 
    case 'LOGOUT':
      // Remove user from local storage
      localStorage.removeItem('user', JSON.stringify(action.payload))

      // set logged in user to null
      return { user: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, userDispatch] = useReducer(authReducer, { 
    user: null  // initial state is null - not logged in 
  })
  const [checkedStorage, setCheckedStorage] = useState(false)

  // on refresh, check if user is already saved in local storage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')) 

    // If a user was found, login with that user
    if (user) {
      userDispatch({ type: 'LOGIN', payload: user }) 
    }

    setCheckedStorage(true)
  }, [])

  console.log('AuthContext state:', state)
  
  // provide authContext context to all parts of app
  return (
    <AuthContext.Provider value={{ ...state, userDispatch, checkedStorage }}>
      { children }
    </AuthContext.Provider>
  )

}
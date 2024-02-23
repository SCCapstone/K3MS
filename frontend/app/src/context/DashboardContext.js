import { createContext, useReducer } from 'react'

// Context to save and modify dashboard data

export const DashboardContext = createContext()

export const dashboardReducer = (state, action) => {
  switch (action.type) {
    case 'SET_GRANTS':
      return { 
        ...state, 
        grants: action.payload,
      }
    case 'SET_PUBS':
      return { 
        ...state, 
        pubs: action.payload,
      }
    case 'SET_COURSES':
      return { 
        ...state, 
        courses: action.payload,
      }
    case 'SET_ANON_DATA':
      return { 
        ...state, 
        anonData: action.payload,
      }
    case 'CLEAR_DATA':
      return {
        grants: null,
        pubs: null,
        courses: null,
        anonData: null
      }
    default:
      return state
  }
}

export const DashboardContextProvider = ({ children }) => {
  const [state, dashboardDispatch] = useReducer(dashboardReducer, { 
    grants: null,
    pubs: null,
    courses: null,
    anonData: null,
  })
  
  // provide DashboardContext context to all parts of app
  return (
    <DashboardContext.Provider value={{ ...state, dashboardDispatch }}>
      { children }
    </DashboardContext.Provider>
  )

}
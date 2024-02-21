import { createContext, useReducer } from 'react'

// Context to save and modify student evaluations

export const TeamAssessmentsContext = createContext()

export const teamAssessmentsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_COURSES':
      return { 
        ...state, 
        courses: action.payload,  // list of courses
      }
    
    case 'SET_TEAM':
      return {
        ...state,
        team: action.payload, // list of team members
      }

    default:
      return state
  }
}

export const TeamAssessmentsContextProvider = ({ children }) => {
  const [state, teamAssessmentsDispatch] = useReducer(teamAssessmentsReducer, { 
    courses: null,
  })
  
  // provide TeamAssessmentsContext context to all parts of app
  return (
    <TeamAssessmentsContext.Provider value={{ ...state, teamAssessmentsDispatch }}>
      { children }
    </TeamAssessmentsContext.Provider>
  )

}
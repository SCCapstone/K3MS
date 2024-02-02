import { createContext, useReducer } from 'react'

// Context to save and modify student evaluations

export const StudentEvalsDetailsContext = createContext()

export const studentEvalsDetailsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_COURSES': 
      console.log({...action.payload})
      return { 
        ...state, 
        courses: action.payload,  // list of courses
      }
    default:
      return state
  }
}

export const StudentEvalsDetailsContextProvider = ({ children }) => {
  const [state, studentEvalsDetailsDispatch] = useReducer(studentEvalsDetailsReducer, { 
    courses: null,
  })
  
  // provide StudentEvalsDetailsContext context to all parts of app
  return (
    <StudentEvalsDetailsContext.Provider value={{ ...state, studentEvalsDetailsDispatch }}>
      { children }
    </StudentEvalsDetailsContext.Provider>
  )
}
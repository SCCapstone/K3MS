import { createContext, useReducer } from 'react'

// Context to save and modify student evaluations

export const StudentEvalsContext = createContext()

export const studentEvalsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_COURSES':
      return { 
        ...state, 
        courses: action.payload,  // list of courses
      }
    case 'SET_COURSE_DETAILS':
      return { 
        ...state, 
        courseDetails: action.payload
      }
    case 'CLEAR_DATA':
      return {
        courses: null,
        courseDetails: null
      }
    default:
      return state
  }
}

export const StudentEvalsContextProvider = ({ children }) => {
  const [state, studentEvalsDispatch] = useReducer(studentEvalsReducer, { 
    courses: null,
    courseDetails: null,
  })
  
  // provide StudentEvalsContext context to all parts of app
  return (
    <StudentEvalsContext.Provider value={{ ...state, studentEvalsDispatch }}>
      { children }
    </StudentEvalsContext.Provider>
  )

}
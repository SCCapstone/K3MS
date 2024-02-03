import { createContext, useReducer } from 'react'

// Context to save and modify course analytics

export const CourseAnalyticsContext = createContext()

export const courseAnalyticsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_COURSES':
      return { 
        ...state, 
        courses: action.payload,  // list of courses
      }
    default:
      return state
  }
}

export const CourseAnalyticsContextProvider = ({ children }) => {
  const [state, courseAnalyticsDispatch] = useReducer(courseAnalyticsReducer, { 
    courses: null,
  })
  
  // provide CourseAnalyticsContext context to all parts of app
  return (
    <CourseAnalyticsContext.Provider value={{ ...state, courseAnalyticsDispatch }}>
      { children }
    </CourseAnalyticsContext.Provider>
  )

}
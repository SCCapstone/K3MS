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
    case 'SET_ANON_DATA':
      return { 
        ...state, 
        anonData: {
          ...state.anonData,
          [action.payload.course]: action.payload.data
        }
      }
    default:
      return state
  }
}

export const CourseAnalyticsContextProvider = ({ children }) => {
  const [state, courseAnalyticsDispatch] = useReducer(courseAnalyticsReducer, { 
    usersToChoose: null,
    courses: null,
    anonData: null
  })
  
  // provide CourseAnalyticsContext context to all parts of app
  return (
    <CourseAnalyticsContext.Provider value={{ ...state, courseAnalyticsDispatch }}>
      { children }
    </CourseAnalyticsContext.Provider>
  )

}
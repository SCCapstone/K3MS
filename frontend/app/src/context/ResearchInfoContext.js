import { createContext, useReducer } from 'react'

// Context to save and modify user logged in state

export const ResearchInfoContext = createContext()

export const researchInfoReducer = (state, action) => {
  switch (action.type) {
    case 'SET_GRANTS':
      return { 
        ...state, 
        grants: action.payload  // list of grants
      }
    case 'SET_PUBS':
      return { 
        ...state, 
        pubs: action.payload    // list of publicatons
      }
    case 'SET_EXPEN':
        return { 
          ...state, 
          expen: action.payload // list of expenditures (per year)
        }
    default:
      return state
  }
}

export const ResearchInfoContextProvider = ({ children }) => {
  const [state, researchInfoDispatch] = useReducer(researchInfoReducer, { 
    grants: null,
    pubs: null,
    expen: null
  })
  
  // provide researchInfoContext context to all parts of app
  return (
    <ResearchInfoContext.Provider value={{ ...state, researchInfoDispatch }}>
      { children }
    </ResearchInfoContext.Provider>
  )

}
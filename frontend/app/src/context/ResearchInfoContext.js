import { createContext, useReducer } from 'react'

// Context to save and modify user logged in state

export const ResearchInfoContext = createContext()

export const researchInfoReducer = (state, action) => {
  switch (action.type) {
    case 'SET_GRANTS':
      return { 
        ...state, 
        grants: action.payload
      }
    case 'UPDATE_GRANTS':
      return { 
        ...state, 
        grants: state.grants ? state.grants.concat(action.payload) : action.payload
      }
    case 'SET_PUBS':
      return { 
        ...state, 
        pubs: action.payload
      }
    case 'UPDATE_PUBS':
      return { 
        ...state, 
        pubs: state.pubs ? state.pubs.concat(action.payload) : action.payload
      }
    case 'SET_EXPEN':
        return { 
          ...state, 
          expen: action.payload
        }
    case 'UPDATE_EXPEN':
        return { 
          ...state, 
          expen: state.expen.concat(action.payload)
        }
    case 'CLEAR_DATA':
      return {
        grants: null,
        pubs: null,
        expen: null
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
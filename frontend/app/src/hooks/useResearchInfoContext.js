import { ResearchInfoContext } from "../context/ResearchInfoContext"
import { useContext } from "react"

export const useResearchInfoContext = () => {
  const context = useContext(ResearchInfoContext)

  if(!context) {
    throw Error('useResearchInfoContext must be used inside an useResearchInfoContextProvider')
  }

  return context
}
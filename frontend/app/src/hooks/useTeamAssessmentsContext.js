import { TeamAssessmentsContext } from "../context/TeamAssessmentsContext"
import { useContext } from "react"

export const useTeamAssessmentsContext = () => {
  const context = useContext(TeamAssessmentsContext)

  if(!context) {
    throw Error('useTeamAssessmentsContext must be used inside an useTeamAssessmentsContextProvider')
  }

  return context
}
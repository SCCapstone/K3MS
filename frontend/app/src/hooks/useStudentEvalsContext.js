import { StudentEvalsContext } from "../context/StudentEvalsContext"
import { useContext } from "react"

export const useStudentEvalsContext = () => {
  const context = useContext(StudentEvalsContext)

  if(!context) {
    throw Error('useStudentEvalsContext must be used inside an useStudentEvalsContextProvider')
  }

  return context
}
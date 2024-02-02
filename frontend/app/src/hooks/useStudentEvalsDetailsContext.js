import { StudentEvalsDetailsContext } from "../context/StudentEvalsDetailsContext"
import { useContext } from "react"

export const useStudentEvalsDetailsContext = () => {
  const context = useContext(StudentEvalsDetailsContext)

  if(!context) {
    throw Error('useStudentEvalsDetailsContext must be used inside an useStudentEvalsDetailsContextProvider')
  }

  return context
}
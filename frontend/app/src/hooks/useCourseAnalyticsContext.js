import { CourseAnalyticsContext } from "../context/CourseAnalyticsContext"
import { useContext } from "react"

export const useCourseAnalyticsContext = () => {
  const context = useContext(CourseAnalyticsContext)

  if(!context) {
    throw Error('useCourseAnalyticsContext must be used inside an useCourseAnalyticsContextProvider')
  }

  return context
}
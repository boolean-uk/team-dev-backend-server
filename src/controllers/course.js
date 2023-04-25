import { createCourse, getCourses, getCourseById } from '../domain/course.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const { name } = req.body

  if (!name) {
    return sendMessageResponse(res, 400, 'No course name has been provided')
  }
  try {
    const createdCourse = await createCourse(name)
    return sendDataResponse(res, 201, createdCourse)
  } catch (e) {
    return sendDataResponse(res, 500, { error: 'Unable to create course' })
  }
}

export const getAll = async (req, res) => {
  try {
    const allCourses = await getCourses()
    return sendDataResponse(res, 200, allCourses)
  } catch (e) {
    return sendDataResponse(res, 500, { error: e.message })
  }
}

export const getById = async (req, res) => {
  const courseId = Number(req.params.id)
  try {
    const course = await getCourseById(courseId)
    if (!course) {
      return sendDataResponse(res, 404, { error: 'Course not found' })
    }
    return sendDataResponse(res, 200, course)
  } catch (e) {
    return sendDataResponse(res, 500, { error: e.message })
  }
}

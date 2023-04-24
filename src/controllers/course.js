import Course from '../domain/course.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const { name } = req.body

  if (!name) {
    return sendMessageResponse(res, 400, 'No course name has been provided')
  }
  try {
    const courseToCreate = await Course.fromJson(req.body)
    const createdCourse = await courseToCreate.save()

    return sendDataResponse(res, 201, createdCourse)
  } catch (e) {
    return sendDataResponse(res, 500, { error: 'Unable to create course' })
  }
}

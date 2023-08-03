import { sendDataResponse, sendErrorResponse } from '../utils/responses.js'
import { createCourse, findByCourseName } from '../domain/courses.js'

const validateCourseFunctionInputs = (req) => {
  const { name } = req.body
  const keys = Object.keys(req.body)

  const invalidKeys = keys.find((key) => {
    return key !== 'name'
  })
  if (invalidKeys) {
    return { Error: 'Invalid key provided!' }
  }
  if (keys.includes('name') && typeof req.body.name !== 'string') {
    return { Error: 'Course name must be a string!' }
  }
  if (!keys[0]) {
    return { Error: 'No data provided.' }
  }
  if (!name) {
    return { Error: 'Please provide Course name immediatley!' }
  }
  return null
}
export const addCourse = async (req, res) => {
  const { name } = req.body

  const validationError = validateCourseFunctionInputs(req)
  if (validationError) {
    return sendErrorResponse(res, 400, validationError)
  }
  const existingCourse = await findByCourseName(name)

  if (existingCourse) {
    return sendErrorResponse(res, 409, 'Course already exists!')
  }
  try {
    const newCourse = await createCourse(name)
    return sendDataResponse(res, 201, { course: newCourse })
  } catch (err) {
    console.error(err)
    return sendErrorResponse(res, 500, {
      Error: 'Unexpected Error!'
    })
  }
}

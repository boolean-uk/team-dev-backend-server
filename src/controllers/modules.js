import Module, { createModule } from '../domain/modules.js'
import { sendDataResponse } from '../utils/responses.js'

const validateModuleFunctionInputs = (req) => {
  const { moduleName, courseId } = req.body
  const keys = Object.keys(req.body)

  const invalidKeys = keys.find((key) => {
    return key !== 'moduleName' && key !== 'courseId'
  })
  if (invalidKeys) {
    return { Error: 'Invalid key provided!' }
  }
  if (keys.includes('moduleName') && typeof req.body.moduleName !== 'string') {
    return { Error: 'Module name must be a string!' }
  }
  if (keys.includes('courseId') && typeof req.body.courseId !== 'number') {
    return { Error: 'Course id must be a number!' }
  }
  if (!keys[0]) {
    return { Error: 'No data provided.' }
  }
  if (!moduleName) {
    return { Error: 'Please provide Module name immediatley!' }
  }
  if (!courseId) {
    return { Error: 'Please provide Course ID immediatley!' }
  }
  return null
}

export const addModule = async (req, res) => {
  const { moduleName, courseId } = req.body

  const validationError = validateModuleFunctionInputs(req)
  if (validationError) {
    return sendDataResponse(res, 400, validationError)
  }
  const existingModule = await Module.findByModuleName(moduleName)

  if (existingModule) {
    return sendDataResponse(res, 400, 'Module already exists!')
  }
  try {
    const resModule = await createModule(moduleName, courseId)
    return sendDataResponse(res, 201, { module: resModule })
  } catch (err) {
    return sendDataResponse(res, 500, {
      Error: 'Unexpected Error!'
    })
  }
}

import Module, { createModule, getModulesById } from '../domain/modules.js'
import { sendDataResponse } from '../utils/responses.js'

const validateModuleFunctionInputs = (req) => {
  const { name, courseId } = req.body
  const keys = Object.keys(req.body)

  const invalidKeys = keys.find((key) => {
    return key !== 'name' && key !== 'courseId'
  })
  if (invalidKeys) {
    return { Error: 'Invalid key provided!' }
  }
  if (keys.includes('name') && typeof req.body.name !== 'string') {
    return { Error: 'Module name must be a string!' }
  }
  if (keys.includes('courseId') && typeof req.body.courseId !== 'number') {
    return { Error: 'Course id must be a number!' }
  }
  if (!keys[0]) {
    return { Error: 'No data provided.' }
  }
  if (!name) {
    return { Error: 'Please provide Module name immediatley!' }
  }
  if (!courseId) {
    return { Error: 'Please provide Course ID immediatley!' }
  }
  return null
}

export const addModule = async (req, res) => {
  const { name, courseId } = req.body

  const validationError = validateModuleFunctionInputs(req)
  if (validationError) {
    return sendDataResponse(res, 400, validationError)
  }
  const existingModule = await Module.findByModuleName(name)

  if (existingModule) {
    return sendDataResponse(res, 409, 'Module already exists!')
  }
  try {
    const resModule = await createModule(name, courseId)
    return sendDataResponse(res, 201, { module: resModule })
  } catch (err) {
    return sendDataResponse(res, 500, {
      Error: 'Unexpected Error!'
    })
  }
}

export const getAll = async (req, res) => {
  try {
    const modules = await getModulesById()

    if (!modules) {
      return sendDataResponse(res, 404, 'Modules not found')
    }

    return sendDataResponse(res, 200, modules)
  } catch (error) {
    return sendDataResponse(res, 500, 'Unable to get delivery logs')
  }
}

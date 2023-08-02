import {
  createModule,
  getModuleById,
  updateModuleDetails,
  findByModuleName
} from '../domain/modules.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

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
  const existingModule = await findByModuleName(name)

  if (existingModule) {
    return sendDataResponse(res, 409, { Error: 'Module already exists!' })
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

export const updateModule = async (req, res) => {
  const { name, courseId } = req.body
  const moduleId = Number(req.params.id)
  const validationError = validateModuleFunctionInputs(req)
  if (validationError) {
    return sendDataResponse(res, 400, validationError)
  }

  try {
    const resModule = await updateModuleDetails(moduleId, name, courseId)
    return sendDataResponse(res, 200, { module: resModule })
  } catch (err) {
    if (err.code === 'P2025') {
      return sendMessageResponse(
        res,
        409,
        'The course to which the module is being modified does not exist.'
      )
    }
    if (err.code === 'P2016') {
      return sendMessageResponse(
        res,
        404,
        'The module being modified does not exist.'
      )
    }
    return sendMessageResponse(res, 500, 'Unexpected Error')
  }
}

export const getAll = async (req, res) => {
  try {
    const moduleId = parseInt(req.params.id, 10)
    const module = await getModuleById(moduleId)

    if (!module) {
      return sendDataResponse(res, 404, 'Modules not found')
    }

    return sendDataResponse(res, 200, module)
  } catch (error) {
    console.error(error)
    return sendDataResponse(res, 500, 'Unable to get modules')
  }
}

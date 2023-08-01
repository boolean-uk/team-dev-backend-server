import Module, {
  createModule,
  getModulesById,
  updateModuleDetails
} from '../domain/modules.js'
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
    return sendDataResponse(res, 409, { Error: 'Module already exists!' })
  }
  try {
    const resModule = await createModule(name, courseId)
    return sendDataResponse(res, 201, { module: resModule })
  } catch (err) {
    console.log(err)
    return sendDataResponse(res, 500, {
      Error: 'Unexpected Error!'
    })
  }
}

export const editModules = async (req, res) => {
  const { name, courseId } = req.body
  const moduleId = Number(req.params.id)
  const validationError = validateModuleFunctionInputs(req)
  if (validationError) {
    return sendDataResponse(res, 400, validationError)
  }

  const existingModule = await Module.findByModuleName(name)

  if (existingModule) {
    return sendDataResponse(res, 409, { Error: 'Module already exists!' })
  }

  try {
    const resModule = await updateModuleDetails(moduleId, name, courseId)
    return sendDataResponse(res, 200, { module: resModule })
  } catch (err) {
    if (err.code === 'P2025') {
      return sendDataResponse(res, 409, {
        Error:
          'The course to which the module is being mdofiied does not exist.'
      })
    }
    return sendDataResponse(res, 500, {
      Error: 'Unexpected Error!'
    })
  }
}

export const getAll = async (req, res) => {
  try {
    const moduleId = parseInt(req.params.id, 10)
    const modules = await getModulesById(moduleId)

    if (!modules) {
      return sendDataResponse(res, 404, 'Modules not found')
    }

    return sendDataResponse(res, 200, modules)
  } catch (error) {
    console.error(error)
    return sendDataResponse(res, 500, 'Unable to get modules')
  }
}

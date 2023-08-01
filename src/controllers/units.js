import Unit, { createUnit } from '../domain/units.js'
import { sendDataResponse } from '../utils/responses.js'

const validateUnitFunctionInputs = (req) => {
  const { name, moduleId } = req.body
  const keys = Object.keys(req.body)

  const invalidKeys = keys.find((key) => {
    return key !== 'name' && key !== 'moduleId'
  })
  if (invalidKeys) {
    return { Error: 'Invalid key provided!' }
  }
  if (keys.includes('name') && typeof req.body.name !== 'string') {
    return { Error: 'Unit name must be a string!' }
  }
  if (keys.includes('moduleId') && typeof req.body.moduleId !== 'number') {
    return { Error: 'Module id must be a number!' }
  }
  if (!keys[0]) {
    return { Error: 'No data provided.' }
  }
  if (!name) {
    return { Error: 'Please provide Unit name immediatley!' }
  }
  if (!moduleId) {
    return { Error: 'Please provide Unit Id immediatley!' }
  }
  return null
}

export const addUnit = async (req, res) => {
  const { name, moduleId } = req.body

  const validationError = validateUnitFunctionInputs(req)
  if (validationError) {
    return sendDataResponse(res, 400, validationError)
  }
  const existingUnit = await Unit.findByUnitName(name)
  const existingModule = await Unit.findByModuleId(moduleId)

  if (existingUnit) {
    return sendDataResponse(res, 409, 'Unit already exists!')
  }
  if (!existingModule) {
    return sendDataResponse(res, 404, 'Module does not exist!')
  }
  try {
    const newUnit = await createUnit(name, moduleId)
    return sendDataResponse(res, 201, { unit: newUnit })
  } catch (err) {
    console.error(err)
    return sendDataResponse(res, 500, {
      Error: 'Unexpected Error!'
    })
  }
}

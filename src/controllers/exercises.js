import { sendDataResponse, sendErrorResponse } from '../utils/responses.js'
import {
  getAll,
  getAllForUser,
  getExerciseById,
  createExercise,
  findByExerciseName,
  findByUnitId,
  updateExerciseDetails
} from '../domain/exercises.js'

const validateExerciseFunctionInputs = (req) => {
  const { name, unitId } = req.body
  const keys = Object.keys(req.body)

  const invalidKeys = keys.find((key) => {
    return key !== 'name' && key !== 'unitId'
  })
  if (invalidKeys) {
    return { Error: 'Invalid key provided!' }
  }
  if (keys.includes('name') && typeof req.body.name !== 'string') {
    return { Error: 'Exercise name must be a string!' }
  }
  if (keys.includes('unitId') && typeof req.body.unitId !== 'number') {
    return { Error: 'Unit id must be a number!' }
  }
  if (!keys[0]) {
    return { Error: 'No data provided.' }
  }
  if (!name) {
    return { Error: 'Please provide Exercise name immediatley!' }
  }
  if (!unitId) {
    return { Error: 'Please provide Unit Id immediatley!' }
  }
  return null
}

export const addExercise = async (req, res) => {
  const { name, unitId } = req.body

  const validationError = validateExerciseFunctionInputs(req)
  if (validationError) {
    return sendErrorResponse(res, 400, validationError)
  }
  const existingExercise = await findByExerciseName(name)
  const existingUnit = await findByUnitId(unitId)

  if (existingExercise) {
    return sendErrorResponse(res, 409, 'Exercise already exists!')
  }
  if (!existingUnit) {
    return sendErrorResponse(res, 404, 'Unit does not exist!')
  }
  try {
    const newExercise = await createExercise(name, unitId)
    return sendDataResponse(res, 201, { exercise: newExercise })
  } catch (err) {
    console.error(err)
    return sendErrorResponse(res, 500, {
      Error: 'Unexpected Error!'
    })
  }
}
export const updateExercise = async (req, res) => {
  const { name, unitId } = req.body
  const exerciseId = Number(req.params.id)
  const validationError = validateExerciseFunctionInputs(req)
  if (validationError) {
    return sendErrorResponse(res, 400, validationError.Error)
  }

  try {
    const resExercise = await updateExerciseDetails(exerciseId, name, unitId)
    return sendDataResponse(res, 200, { exercise: resExercise })
  } catch (err) {
    if (err.code === 'P2025') {
      return sendErrorResponse(
        res,
        409,
        'The unit to which the exercise is being modified does not exist.'
      )
    }
    if (err.code === 'P2016') {
      return sendErrorResponse(
        res,
        404,
        'The exercise being modified does not exist.'
      )
    }
    return sendErrorResponse(res, 500, 'Unexpected Error')
  }
}
export const getById = async (req, res) => {
  const exerciseId = Number(req.params.id)
  try {
    const exercise = await getExerciseById(exerciseId)
    return sendErrorResponse(res, 404, exercise)
  } catch (e) {
    return sendErrorResponse(res, 500, e)
  }
}

export const getAllByUnit = async (req, res) => {
  const unitId = Number(req.params.id)
  try {
    const exercises = await getAll(unitId)
    return sendErrorResponse(res, 404, exercises)
  } catch (e) {
    return sendErrorResponse(res, 500, e)
  }
}

export const getAllByUserId = async (req, res) => {
  const userid = Number(req.params.id)
  try {
    const exercises = await getAllForUser(userid)
    return sendErrorResponse(res, 404, exercises)
  } catch (e) {
    return sendErrorResponse(res, 500, 'Unable to get UserID')
  }
}

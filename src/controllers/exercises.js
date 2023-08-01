import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import { getAll, getAllForUser, getExerciseById } from '../domain/exercises.js'

export const getById = async (req, res) => {
  const exerciseId = Number(req.params.id)
  try {
    const exercise = await getExerciseById(exerciseId)
    return sendDataResponse(res, 404, exercise)
  } catch (e) {
    console.error(e)
    return sendMessageResponse(res, 500, { error: e })
  }
}

export const getAllByUnit = async (req, res) => {
  const unitId = Number(req.params.id)
  try {
    const exercises = await getAll(unitId)
    return sendDataResponse(res, 404, { exercises })
  } catch (e) {
    console.error(e)
    return sendMessageResponse(res, 500, { error: e })
  }
}

export const getAllByUserId = async (req, res) => {
  const userid = Number(req.params.id)
  try {
    const exercises = await getAllForUser(userid)
    return sendDataResponse(res, 404, { exercises })
  } catch (e) {
    console.error(e)
    return sendMessageResponse(res, 500, 'Unable to get UserID')
  }
}

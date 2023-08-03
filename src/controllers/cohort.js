import {
  createCohort,
  getCohort,
  getAllCohorts,
  addStudent
} from '../domain/cohort.js'
import { sendDataResponse, sendErrorResponse } from '../utils/responses.js'
import User from '../domain/user.js'

export const create = async (req, res) => {
  try {
    const createdCohort = await createCohort()

    return sendDataResponse(res, 201, createdCohort)
  } catch (e) {
    return sendErrorResponse(res, 500, 'Unable to create cohort')
  }
}

export const get = async (req, res) => {
  const cohortId = parseInt(req.params.id)
  try {
    const gettingCohort = await getCohort(cohortId)
    if (gettingCohort === null) {
      return sendErrorResponse(res, 404, 'Cohort does not exist')
    }
    return sendDataResponse(res, 200, gettingCohort)
  } catch (error) {
    return sendErrorResponse(res, 500, 'Unable to get cohort')
  }
}

export const getAll = async (req, res) => {
  const cohorts = await getAllCohorts()

  return sendDataResponse(res, 200, cohorts)
}

export const addUser = async (req, res) => {
  const { cohortId, userId } = req.body
  try {
    const existingUser = await User.findById(userId)
    if (!existingUser) {
      return sendErrorResponse(res, 404, 'User does not exist')
    }
    const foundCohort = await getCohort(cohortId)
    if (!foundCohort) {
      return sendErrorResponse(res, 404, 'Cohort not found')
    }
    if (existingUser.role === 'TEACHER') {
      return sendErrorResponse(res, 409, `Teacher can't be assigned to cohorts`)
    }
    const student = await addStudent(cohortId, userId)
    return sendDataResponse(res, 201, student)
  } catch (error) {
    return sendErrorResponse(res, 500, 'Unable to get cohort')
  }
}

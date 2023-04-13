import { createCohort, Cohort, findByCohortId } from '../domain/cohort.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import User from '../domain/user.js'

export const create = async (req, res) => {
  try {
    const createdCohort = await createCohort()

    return sendDataResponse(res, 201, createdCohort)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to create cohort')
  }
}

export const getStudents = async (req, res) => {
  const { cohortId } = req.query
  const { userId } = req.params.id

  const foundStudents = await User._findMany(userId)
  if (foundStudents) {
    const foundCohort = await Cohort.findByCohortId(cohortId)
    if (!foundCohort) {
      return sendMessageResponse(res, 404, 'No cohort with{id}')
    }
    const foundStudents = foundCohort.users
    return sendDataResponse(res, 200, foundStudents)
  }
}

import { createCohort, getCohort } from '../domain/cohort.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  try {
    const createdCohort = await createCohort()

    return sendDataResponse(res, 201, createdCohort)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to create cohort')
  }
}

export const get = async (req, res) => {
  const cohortId = parseInt(req.params.id)
  try {
    const gettingCohort = await getCohort(cohortId)
    if (gettingCohort === null) {
      return sendMessageResponse(res, 404, 'Cohort does not exist')
    }
    return sendDataResponse(res, 200, gettingCohort)
  } catch (error) {
    return sendMessageResponse(res, 500, 'Unable to get cohort')
  }
}

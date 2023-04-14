import { createCohort } from '../domain/cohort.js'
import { sendDataResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  try {
    const createdCohort = await createCohort()

    return sendDataResponse(res, 201, createdCohort)
  } catch (e) {
    return sendDataResponse(res, 500, { error: 'Unable to create cohort' })
  }
}

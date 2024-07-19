import { createCohort } from '../domain/cohort.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import ERR from '../utils/errors.js'

export const create = async (req, res) => {
  try {
    const createdCohort = await createCohort()

    return sendDataResponse(res, 201, createdCohort)
  } catch (e) {
    console.log('An error occured while trying to create a cohort:', e)
    return sendMessageResponse(res, 500, { error: ERR.INTERNAL_ERROR })
  }
}

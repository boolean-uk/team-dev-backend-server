import { createCohort } from '../domain/cohort.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const { cohortName, startDate, endDate } = req.body
  if (cohortName === '' || startDate === '' || endDate === '') {
    return sendDataResponse(res, 400, { error: 'One or more felds is missing' })
  }
  try {
    const createdCohort = await createCohort(cohortName, startDate, endDate)

    return sendDataResponse(res, 201, createdCohort)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to create cohort')
  }
}

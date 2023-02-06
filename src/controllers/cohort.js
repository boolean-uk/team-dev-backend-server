import { createCohort } from '../domain/cohort.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const { cohortName, course, startDate, endDate } = req.body
  try {
    const createdCohort = await createCohort(
      cohortName,
      course,
      startDate,
      endDate
    )

    return sendDataResponse(res, 201, createdCohort)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to create cohort')
  }
}

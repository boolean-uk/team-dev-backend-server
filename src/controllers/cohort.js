import { createCohort, Cohort } from '../domain/cohort.js'
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

export const getAll = async (req, res) => {
  const cohorts = await Cohort.findAll()
  return sendDataResponse(res, 200, { cohorts: cohorts })
}

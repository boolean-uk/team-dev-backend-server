import { Cohort } from '../domain/cohort.js'
import { createCohort } from '../domain/cohort.js'
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
  const cohortList = await Cohort.findAll()
  if (cohortList) {
    return sendDataResponse(res, 200, cohortList)
  } else {
    return sendMessageResponse(res, 404, 'No cohorts exist')
  }
}

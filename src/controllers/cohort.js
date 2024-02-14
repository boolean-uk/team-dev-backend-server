import { createCohort, Cohort } from '../domain/cohort.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  try {
    const createdCohort = await createCohort()

    return sendDataResponse(res, 201, createdCohort)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to create cohort')
  }
}

export const getCohorts = async (req, res) => {
  try {
    const foundCohorts = await Cohort.getAll()
    return sendDataResponse(res, 200, foundCohorts)
  } catch (e) {
    console.log('Error retrieving cohorts', e)
    return sendMessageResponse(res, 500, 'Unable to get the list of cohorts')
  }
}

import {
  createCohort,
  getAllCohorts,
  getCohortById,
  deleteCohort
} from '../domain/cohort.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  try {
    const createdCohort = await createCohort()

    return sendDataResponse(res, 201, createdCohort)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to create cohort')
  }
}

export const getAll = async (req, res) => {
  const allCohorts = await getAllCohorts()

  return sendDataResponse(res, 200, allCohorts)
}

export const getById = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const searchedCohort = await getCohortById(id)
    if (searchedCohort == null || searchedCohort.cohort == null) {
      return sendDataResponse(res, 404, { id: 'Cohort not found' })
    }
    return sendDataResponse(res, 200, searchedCohort)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to get cohort')
  }
}

export const deleteById = async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const searchedCohort = await deleteCohort(id)
    if (searchedCohort == null || searchedCohort.cohort == null) {
      return sendDataResponse(res, 404, { id: 'Cohort not found' })
    }
    return sendDataResponse(res, 200, searchedCohort)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to delete cohort')
  }
}

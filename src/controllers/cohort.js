import { Cohort, getStudentsOfCohort } from '../domain/cohort.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  try {
    const createdCohort = await Cohort.createCohort()

    return sendDataResponse(res, 201, createdCohort)
  } catch (e) {
    return sendDataResponse(res, 500, { error: 'Unable to create cohort' })
  }
}

export const getAllCohorts = async (req, res) => {
  const cohortList = await Cohort.findAll()
  if (cohortList) {
    return sendDataResponse(res, 200, cohortList)
  } else {
    return sendMessageResponse(res, 404, 'No cohorts exist')
  }
}

export const getStudents = async (req, res) => {
  const cohortId = req.params.id

  const students = await getStudentsOfCohort(cohortId)

  if (students === null) {
    return sendDataResponse(
      res,
      404,
      `No students found for Cohort ${cohortId}`
    )
  }

  return sendDataResponse(res, 200, students)
}

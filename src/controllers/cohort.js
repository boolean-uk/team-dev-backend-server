import { createCohort, getStudentsOfCohort } from '../domain/cohort.js'
import { sendDataResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  try {
    const createdCohort = await createCohort()

    return sendDataResponse(res, 201, createdCohort)
  } catch (e) {
    return sendDataResponse(res, 500, { error: 'Unable to create cohort' })
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

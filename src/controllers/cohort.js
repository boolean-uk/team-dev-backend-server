import { createCohort, Cohort } from '../domain/cohort.js'
import { Student } from '../domain/student.js'
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

export const getStudentsByCohortId = async (req, res) => {
  const cohortId = parseInt(req.params.id)

  if (!cohortId) {
    return sendMessageResponse(res, 400, { error: 'No provided cohort ID' })
  }

  try {
    const foundCohort = await Cohort.getAll()

    const hasCohort = foundCohort.find((cohort) => cohort.id.id === cohortId)

    if (!hasCohort) {
      return sendMessageResponse(res, 404, 'No cohort found with provided ID')
    }

    const foundStudents = await Student.getAllStudentsByCohortId(cohortId)

    return res.status(200).send({ students: foundStudents })
  } catch (e) {
    console.log('Error getting cohort by ID:', e)
    return sendMessageResponse(res, 500, 'Unable to get students')
  }
}

export const changeStudentCohort = async (req, res) => {
  const { studentId, newCohortId } = req.body

  if (!studentId || !newCohortId) {
    return sendMessageResponse(res, 400, 'Missing student ID or new cohort ID')
  }

  try {
    await Student.changeCohort(studentId, newCohortId)
    return sendMessageResponse(res, 200, 'Student cohort changed successfully')
  } catch (e) {
    console.error('Error changing student cohort:', e)
    return sendMessageResponse(res, 500, 'Internal server error')
  }
}

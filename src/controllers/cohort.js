import { createCohort, Cohort } from '../domain/cohort.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const { cohortName, startDate, endDate } = req.body
  if (cohortName === '' || startDate === '' || endDate === '') {
    return sendDataResponse(res, 400, {
      error: 'One or more fields are missing'
    })
  }
  // check that dates provided are in ISO Standard format
  const validStartDate = /^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])$/.test(
    startDate
  )
  const validEndDate = /^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])$/.test(endDate)

  if (!validStartDate) {
    return sendDataResponse(res, 400, { error: 'Invalid start date' })
  }
  if (!validEndDate) {
    return sendDataResponse(res, 400, { error: 'Invalid end date' })
  }
  // format dates for acceptance by Prisma
  const startDateFormatted = new Date(startDate)
  const endDateFormatted = new Date(endDate)

  // check for unique cohort name
  const foundCohortName = await Cohort.findByName(cohortName)
  if (foundCohortName) {
    return sendDataResponse(res, 400, { error: 'Cohort name already exists' })
  }

  try {
    const createdCohort = await createCohort(
      cohortName,
      startDateFormatted,
      endDateFormatted
    )

    return sendDataResponse(res, 201, createdCohort)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to create cohort')
  }
}

export const deleteCohortById = async (req, res) => {
  const id = Number(req.params.id)

  if (!id) {
    return sendDataResponse(res, 404, { error: 'Cohort id does not exist' })
  }
  try {
    const foundCohortById = await Cohort.findById(id)
    if (!foundCohortById) {
      return sendDataResponse(res, 404, {
        error: 'Cohort with given id not found'
      })
    }
    if (
      req.user.role === 'STUDENT' &&
      req.user.id !== foundCohortById.user.id
    ) {
      return sendMessageResponse(
        res,
        403,
        'You are unable to delete this cohort'
      )
    }
    const deletedCohort = await Cohort.delete(id)

    return sendDataResponse(res, 201, {
      deletedCohort
    })
  } catch (error) {
    return sendMessageResponse(res, 400, `Unable to delete cohort: ${error}`)
  }
}

export const getAll = async (req, res) => {
  const cohorts = await Cohort.findAll()
  return sendDataResponse(res, 200, { cohorts: cohorts })
}

export const getById = async (req, res) => {
  const id = Number(req.params.id)
  const cohort = await Cohort.findById(id)
  if (!cohort) {
    return sendDataResponse(res, 404, {
      error: 'Cohort with given id not found'
    })
  }
  return sendDataResponse(res, 200, { cohort })
}

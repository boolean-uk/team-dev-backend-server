import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import { createLog } from '../domain/deliveryLog.js'
import { Cohort } from '../domain/cohort.js'

export const create = async (req, res) => {
  const { date, cohortId, lines, title } = req.body
  const user = req.user
  // check for missing fields
  if (
    !date ||
    !cohortId ||
    !lines ||
    !title ||
    date === '' ||
    cohortId === '' ||
    title === ''
  ) {
    return sendDataResponse(res, 400, { error: 'One or more missing fields' })
  }
  // check date is valid
  const validDate =
    /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/.test(
      date
    )
  if (!validDate) {
    return sendDataResponse(res, 400, { error: 'Invalid date' })
  }
  // check cohort with id exists
  const foundCohort = await Cohort.findById(cohortId)
  if (!foundCohort) {
    return sendMessageResponse(res, 400, {
      error: 'Cohort with that id does not exist'
    })
  }

  // if checks pass create/return log
  const log = await createLog(date, cohortId, lines, user, title)

  return sendDataResponse(res, 201, {
    log
  })
}

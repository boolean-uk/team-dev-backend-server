import { createDeliveryLog, getDeliveryLog } from '../domain/deliveryLog.js'
import { getCohort } from '../domain/cohort.js'
import { sendDataResponse, sendErrorResponse } from '../utils/responses.js'

export const getLogs = async (req, res) => {
  const cohortId = parseInt(req.params.id)
  try {
    const foundCohort = await getCohort(cohortId)
    if (!foundCohort) {
      return sendErrorResponse(res, 404, 'Cohort not found')
    }
    const gettingLogs = await getDeliveryLog(cohortId)
    if (gettingLogs.length === 0) {
      return sendErrorResponse(
        res,
        404,
        'No delivery logs found for this cohort'
      )
    }
    return sendDataResponse(res, 201, gettingLogs)
  } catch (error) {
    return sendErrorResponse(res, 500, 'Unable to get delivery logs')
  }
}

export const create = async (req, res) => {
  const { date, cohort_id: cohortId, lines, title } = req.body
  const userId = req.user.id

  try {
    const formatdDate = new Date(date)

    const createdDeliveryLog = await createDeliveryLog(
      formatdDate,
      userId,
      title,
      cohortId,
      lines
    )

    return sendDataResponse(res, 201, createdDeliveryLog)
  } catch (error) {
    return sendErrorResponse(res, 500, 'Unable to create new delivery log')
  }
}

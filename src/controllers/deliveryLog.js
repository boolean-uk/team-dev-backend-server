import { getCohortById } from '../domain/cohort.js'
import { createDeliveryLogDb } from '../domain/deliveryLog.js'
import { sendDataResponse } from '../utils/responses.js'
import ERR from '../utils/errors.js'

export const createDeliveryLog = async (req, res) => {
  const { cohort_id: cohortId, lines } = req.body
  const { firstName, lastName } = req.user

  if (!cohortId || !lines) {
    return sendDataResponse(res, 400, {
      error: ERR.INCOMPLETE_DELIVERY_LOG_REQUEST
    })
  }

  try {
    const cohortExists = await getCohortById(cohortId)
    if (!cohortExists) {
      return sendDataResponse(res, 404, { error: ERR.COHORT_NOT_FOUND })
    }
    const log = await createDeliveryLogDb(cohortId, req.user.id, lines)

    const logLines = log.lines.map((line) => ({
      id: line.id,
      content: line.content
    }))

    return sendDataResponse(res, 201, {
      data: {
        log: {
          id: log.id,
          cohortId: cohortId,
          date: log.date,
          author: {
            id: log.user.id,
            firstName,
            lastName
          },
          lines: logLines
        }
      }
    })
  } catch (error) {
    console.error('An error occurred while creating the delivery log', error)
    return sendDataResponse(res, 500, { error: ERR.DELIVERY_LOG_GENERIC_ERROR })
  }
}

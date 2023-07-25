import Cohort from '../domain/user.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import prisma from '@prisma/client'
import { createDeliveryLog } from '../domain/deliveryLog.js'

export const getLogs = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const foundCohort = await Cohort.findById(id)
    if (!foundCohort) {
      return sendDataResponse(res, 404, { id: 'Cohort not found' })
    }

    const foundLogs = await prisma.DeliveryLogs.findMany({
      where: { cohortId: id }
    })
    console.log(foundLogs)
    return sendDataResponse(res, 200, foundLogs)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to get cohort')
  }
}

export const create = async (req, res) => {
  const { date, cohort_id: cohortId, lines, title } = req.body
  const userId = req.user.id

  const formattedDate = new Date(date)

  const createdDeliveryLog = await createDeliveryLog(
    formattedDate,
    userId,
    title,
    cohortId,
    lines
  )

  return sendDataResponse(res, 201, createdDeliveryLog)
}

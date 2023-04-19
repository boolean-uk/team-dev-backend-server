import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import { DeliveryLog } from '../domain/deliveryLog.js'

export const create = async (req, res) => {
  const { date, title, cohortId, lines } = req.body
  const author = req.user.id

  if (!title || !lines) {
    return sendMessageResponse(res, 400, {
      error: 'The log must have a title and a content'
    })
  }
  const parsedDate = new Date(date)

  const createdLog = await DeliveryLog.createLog(
    parsedDate,
    title,
    author,
    cohortId,
    lines
  )
  console.log(createdLog)
  return sendDataResponse(res, 201, { log: createdLog })
}

export const update = async (req, res) => {
  const { logId } = parseInt(req.params.id)
  const { data } = req.body
  console.log(logId, data)
}

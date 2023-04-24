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

  try {
    const createdLog = await DeliveryLog.createLog(
      parsedDate,
      title,
      author,
      cohortId,
      lines
    )
    return sendDataResponse(res, 201, { log: createdLog })
  } catch (e) {
    return sendMessageResponse(res, 500, { Error: 'Unable to create log' })
  }
}

import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import { createLog } from '../domain/log.js'

export const create = async (req, res) => {
  try {
    const createdLog = await createLog(req.body, req.user)
    return sendDataResponse(res, 201, createdLog)
  } catch (error) {
    return sendMessageResponse(res, 500, 'unable to create log')
  }
}

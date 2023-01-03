import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import { createLog } from '../domain/log.js'
import { errorCodes } from '../utils/dbClient.js'

export const create = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return sendMessageResponse(res, 400, 'Bad Request')
    }
    const createdLog = await createLog(req.body, req.user)
    return sendDataResponse(res, 201, createdLog)
  } catch (error) {
    console.error(error)
    if (error.code === errorCodes.recordNotFound) {
      return sendMessageResponse(res, 404, 'Sequence not found')
    }
    if (error.code === errorCodes.violateRelation) {
      return sendMessageResponse(res, 404, 'Sequence log already exists')
    }
    return sendMessageResponse(res, 500, 'Unable to create log')
  }
}

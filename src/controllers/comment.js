import { getCommentsDb } from '../domain/comment.js'
import { sendDataResponse } from '../utils/responses.js'

export const getComments = async (req, res) => {
  const comments = await getCommentsDb()
  return sendDataResponse(res, 200, { comments })
}
